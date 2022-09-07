import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { Appointment } from './appointment';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => Appointment, (appointment: Appointment) => appointment.doctor)
  appointments!: Appointment[];

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
}
