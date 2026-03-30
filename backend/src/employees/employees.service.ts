import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Employee } from './employees.entity';

const SEED_EMPLOYEES: Partial<Employee>[] = [
  { name: 'Alice Johnson', role: 'Manager', email: 'alice.johnson@example.com', shift: 'Morning', isWorking: true, wage: 22.5 },
  { name: 'Bryan Lee', role: 'Barista', email: 'bryan.lee@example.com', shift: 'Afternoon', isWorking: false, wage: 15.0 },
  { name: 'Camila Davis', role: 'Cashier', email: 'camila.davis@example.com', shift: 'Evening', isWorking: true, wage: 14.75 },
];

@Injectable()
export class EmployeesService implements OnModuleInit {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async onModuleInit() {
    const count = await this.employeeRepo.count();
    if (count === 0) {
      this.logger.log('Employees table is empty — seeding default employees...');
      const employees = this.employeeRepo.create(SEED_EMPLOYEES);
      await this.employeeRepo.save(employees);
      this.logger.log(`Seeded ${employees.length} employees`);
    }
  }

  async findAll(role?: string): Promise<Employee[]> {
    const where: FindOptionsWhere<Employee> = {};
    if (role) {
      where.role = role;
    }
    return this.employeeRepo.find({ where, order: { name: 'ASC' } });
  }
}
