export interface Appointment {
  id: string;
  doctor: Doctor;
  time: string;
  patientFirstName: string;
  patientLastName: string;
  type: 'NEW PATIENT' | 'FOLLOW UP';
}

export interface AppointmentDeleteParams {
  doctorId: string;
  apptId: string;
}

export interface AppointmentGetParams {
  id: string;
}

export interface AppointmentGetQuery {
  date: string;
}

export interface AppointmentPostParams {
  id: string;
}

export interface AppointmentPostBody {
  time: string;
  firstName: string;
  lastName: string;
  type: 'NEW PATIENT' | 'FOLLOW UP';
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
