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

  @Column({ type: 'text' })
  patientFirstName!: string;

  @Column({ type: 'text' })
  patientLastName!: string;

  @Column({ type: 'text' })
  type!: 'NEW PATIENT' | 'FOLLOW UP';
}
