import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    customerId: number;
    @Column()
    items: string[];
    @Column()
    totalAmount: number;
    @Column()
    status: string;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;
}