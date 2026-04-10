import { Controller, Post, Body, Get, Query, Delete, Param, Patch } from '@nestjs/common';
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

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreateEmployeeDto>): Promise<Employee> {
    return this.employeesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.employeesService.delete(id);
  }
}
