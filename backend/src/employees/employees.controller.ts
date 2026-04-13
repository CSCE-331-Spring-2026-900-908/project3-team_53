import { Controller, Post, Body, Get, Query, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
import { CreateEmployeeDto } from './create-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager')
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
