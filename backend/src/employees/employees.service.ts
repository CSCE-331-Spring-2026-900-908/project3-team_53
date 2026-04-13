import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Employee } from './employees.entity';
import { CreateEmployeeDto } from './create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepo.create(dto);
    return this.employeeRepo.save(employee);
  }

  async update(id: number, dto: Partial<CreateEmployeeDto>): Promise<Employee> {
    await this.employeeRepo.update(id, dto);
    const employee = await this.employeeRepo.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async delete(id: number): Promise<void> {
    await this.employeeRepo.delete(id);
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepo.findOneBy({ id });
  }

  async findAll(role?: string): Promise<Employee[]> {
    const where: FindOptionsWhere<Employee> = {};
    if (role) {
      where.role = role;
    }
    return this.employeeRepo.find({ where, order: { name: 'ASC' } });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const normalized = email.trim().toLowerCase();
    return this.employeeRepo
      .createQueryBuilder('employee')
      .where('LOWER(employee.email) = :email', { email: normalized })
      .getOne();
  }
}
