import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { EmployeesService } from '../employees/employees.service';

export interface AuthGoogleResponse {
  accessToken: string;
  user: {
    email: string;
    name: string;
    picture?: string;
    googleSub: string;
    employeeId: number | null;
    role: string | null;
  };
}

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly employeesService: EmployeesService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

  async verifyPinAndSignJwt(pin: string): Promise<AuthGoogleResponse> {
    const employee = await this.employeesService.findByPin(pin);
    if (!employee) {
      throw new UnauthorizedException('Invalid PIN');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: `pin-${employee.id}`,
      email: employee.email ?? '',
      employeeId: employee.id,
    });

    return {
      accessToken,
      user: {
        email: employee.email ?? '',
        name: employee.name,
        picture: undefined,
        googleSub: `pin-${employee.id}`,
        employeeId: employee.id,
        role: employee.role,
      },
    };
  }

  async verifyGoogleAndSignJwt(idToken: string): Promise<AuthGoogleResponse> {
    const audience = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!audience) {
      throw new UnauthorizedException('Server is not configured for Google sign-in');
    }

    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Invalid or expired Google token');
    }

    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid Google token payload');
    }
    if (!payload.email) {
      throw new UnauthorizedException('Google account has no email');
    }
    if (payload.email_verified === false) {
      throw new UnauthorizedException('Google email is not verified');
    }

    const employee = await this.employeesService.findByEmail(payload.email);

    const accessToken = await this.jwtService.signAsync({
      sub: payload.sub,
      email: payload.email,
      employeeId: employee?.id ?? null,
    });

    return {
      accessToken,
      user: {
        email: payload.email,
        name: payload.name ?? payload.email,
        picture: payload.picture,
        googleSub: payload.sub,
        employeeId: employee?.id ?? null,
        role: employee?.role ?? null,
      },
    };
  }
}
