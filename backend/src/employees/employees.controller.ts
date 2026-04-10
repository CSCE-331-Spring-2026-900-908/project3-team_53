import { Controller, Post, Body, Get, Query, Delete, Param } from '@nestjs/common';
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

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.employeesService.delete(id);
  }
}
