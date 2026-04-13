import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleTokenDto } from './dto/google-token.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Accepts a Google ID token (credential JWT) from the client and returns
   * an application JWT plus user profile. Link employee by email when present.
   */
  @Post('google')
  async google(@Body() body: GoogleTokenDto) {
    if (!body?.idToken || typeof body.idToken !== 'string') {
      throw new BadRequestException('idToken is required');
    }
    return this.authService.verifyGoogleAndSignJwt(body.idToken.trim());
  }

  /**
   * Accepts a numeric PIN and returns an application JWT plus user profile.
   * Designed for touch-screen employee tap login.
   */
  @Post('pin')
  async pin(@Body() body: { pin: string }) {
    if (!body?.pin || typeof body.pin !== 'string') {
      throw new BadRequestException('pin is required');
    }
    return this.authService.verifyPinAndSignJwt(body.pin.trim());
  }
}
