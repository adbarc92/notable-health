export interface Appointment {
  id: string;
  doctor: Doctor;
  time: Date;
  patientFirstName: string;
  patientLastName: string;
  type: 'NEW PATIENT' | 'FOLLOW UP';
}

export interface AppointmentGet {
  doctorId: string;
  day: number | string;
}

export interface AppointmentPost {
  doctorId: string;
  time: Date;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DoctorPost {
  firstName: string;
  lastName: string;
}



export interface GetOneParams {
  id: string;
}
