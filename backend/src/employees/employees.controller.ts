import { Controller, Post, Body, Get, Query, Patch, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
import { CreateEmployeeDto } from './create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return this.employeesService.create(dto);
  }
  
  @Get()
  findAll(@Query('role') role?: string): Promise<Employee[]> {
    return this.employeesService.findAll(role);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: number): Promise<Employee> {
    return this.employeesService.update(id, { completed: true });
  }
}
