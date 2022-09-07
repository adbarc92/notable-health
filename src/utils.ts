import { Appointment } from './controllers/types';

export const validateRequestStrings = (
  ...args: (string | undefined)[]
): Error | null => {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '') {
      const err = `Invalid: ${args[i]} cannot be empty!`;
      console.error(err);
      return new Error(err);
    }
  }
  return null;
};

export const validateRequestNumbers = (
  ...args: (number | undefined)[]
): Error | null => {
  for (let i = 0; i < args.length; i++) {
    if (isNaN(args[i] as number)) {
      const err = `Invalid: argument must be a number, but is ${args[i]} instead`;
      console.error(err);
      return new Error(err);
    }
  }
  return null;
};

const normalizeTime = (input: Date): string => {
  const hour = input.getHours();
  const afternoon = hour >= 12;
  return `${(afternoon ? hour - 12 : hour).toString()}:${input.getMinutes()}${afternoon ? 'PM' : 'AM'}`;
};

export const validateAppointmentFrequency = (newApptTime: string, existingAppts: Appointment[]): Error | null => {
  const time = new Date(newApptTime);
  const sameTimeAppts = [];
  for(let appt of existingAppts) {
    const apptTime = new Date(appt.time)
    if (
      time.getHours() === apptTime.getHours() &&
      time.getMinutes() === apptTime.getMinutes()
    ) {
      sameTimeAppts.push(appt);
    }
    if (sameTimeAppts.length > 3) {
      return new Error(`Invalid: Doctor ${existingAppts[0].doctor} is booked for time ${normalizeTime(time)}`);
    }
  }
  return null;
}

export const validateAppointmentTime = (time: string): Error | null => {
  if (new Date(time).getMinutes() % 15 !== 0) {
    return new Error(`Invalid: Appointments can only start at 15-minute intervals (e.g. 8:15AM, 8:30AM, 8:45AM, etc.).`);
  }

  return null;
};

export const validateDate = (date: string): Error | null => {
  if (!date) {
    return new Error('A date must be included among the query parameters.');
  }

  const splitDate = date.split('/');

  if (splitDate.length !== 3) {
    return new Error('A date must only include a month, day, and year (formatted as MM/DD/YYYY).');
  }

  for(let timeframe in splitDate) {
    if (parseInt(timeframe) === NaN) {
      return new Error('The month, day, and year must all be numbers (formatted as MM/DD/YYYY).')
    }
  }

  const [month, day, year] = splitDate;

  if(day.length !== 2) {
    return new Error('The specified day must be exactly two characters long.')
  }

  if(year.length !== 4) {
    return new Error('The specified day must be exactly four characters long.')
  }

  if(month.length !== 2) {
    return new Error('The specified day must be exactly four characters long.')
  }

  if (parseInt(month) > 12 || parseInt(month) < 1) {
    return new Error('The specified month must be between 1 and 12.');
  }

  // Edge case: day is too large for specified month
  // Edge case: year predates computers or implementation of this system.
  // Edge case


  return null;
};

export const validateAppointmentPost = (time: string, patientFirstName: string, patientLastName: string, type: 'NEW PATIENT' | 'FOLLOW UP'): Error | null => {
  if (!time) return new Error("An appointment must have a time.");
  if (!patientFirstName) return new Error("An appointment must have a patient\'s first name.");
  if (!patientLastName) return new Error("An appointment must have a patient\'s last name.");
  if (!type || !['NEW PATIENT', 'FOLLOW UP'].includes(type)) {
    return new Error("An appointment must have a type of either 'NEW PATIENT' or 'FOLLOW UP'.");
  }

  return null;
};