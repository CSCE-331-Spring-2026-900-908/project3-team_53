import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  email: string;

  @Column()
  shift: string;

  @Column({ default: false })
  isWorking: boolean;

  @Column('decimal', { precision: 8, scale: 2 })
  wage: number;
}
