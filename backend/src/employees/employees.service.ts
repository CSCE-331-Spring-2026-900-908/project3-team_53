import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Employee } from './employees.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async findAll(role?: string): Promise<Employee[]> {
    const where: FindOptionsWhere<Employee> = {};
    if (role) {
      where.role = role;
    }
    return this.employeeRepo.find({ where, order: { name: 'ASC' } });
  }
}
