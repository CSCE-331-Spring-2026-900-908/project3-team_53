import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { EmployeesService } from '../../employees/employees.service';
import type { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly employeesService: EmployeesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;
    if (!user?.employeeId) {
      throw new ForbiddenException('No linked employee account');
    }

    const employee = await this.employeesService.findOne(user.employeeId);
    if (!employee) {
      throw new ForbiddenException('Employee not found');
    }

    const hasRole = requiredRoles.some(
      (role) => employee.role.toLowerCase() === role.toLowerCase(),
    );
    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
