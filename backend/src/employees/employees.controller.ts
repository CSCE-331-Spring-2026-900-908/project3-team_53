import { Controller, Get, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';

@Controller('api/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query('role') role?: string): Promise<Employee[]> {
    return this.employeesService.findAll(role);
  }
}
