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

export const validateAppointmentFrequency = (newAppt: Appointment, existingAppts: Appointment[]): Error | null => {
  const sameTimeAppts = [];
  for(let appt of existingAppts) {
    if (
      newAppt.time.getHours() === appt.time.getHours() &&
      newAppt.time.getMinutes() === appt.time.getMinutes()
    ) {
      sameTimeAppts.push(appt);
    }
    if (sameTimeAppts.length > 3) {
      return new Error(`Invalid: Doctor ${newAppt.doctor} is booked for time ${normalizeTime(newAppt.time)}`);
    }
  }
  return null;
}

export const validateAppointmentTime = (newAppt: Appointment): Error | null => {
  if (newAppt.time.getMinutes() % 15 !== 0) {
    return new Error(`Invalid: Appointments can only start at 15-minute intervals (e.g. 8:15AM, 8:30AM, 8:45AM, etc.).`);
  }

  return null;
};