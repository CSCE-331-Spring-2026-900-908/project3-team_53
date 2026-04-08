import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async findAll(role?: string): Promise<Employee[]> {
    const where: Record<string, unknown> = {};
    if (role) {
      where.role = role;
    }
    return this.employeeRepo.find({ where, order: { name: 'ASC' } });
  }
}
