import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Doctor } from './doctor';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Doctor, (doctor: Doctor) => doctor.appointments)
  doctor!: Doctor;

  @Column({ type: 'timestamp' })
  time!: Date;

  @Column()
  patientFirstName!: string;

  @Column()
  patientLastName!: string;

  @Column()
  type!: 'NEW PATIENT' | 'FOLLOW UP';
}
