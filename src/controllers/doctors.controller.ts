import { Request, Response, Router } from 'express';
import { Connection } from 'typeorm';
import { validateAppointmentFrequency, validateAppointmentTime, validateDate, validateRequestStrings, validateAppointmentPost } from '../utils';

import { Doctor } from '../database/models';
import { Appointment } from '../database/models';
import { DoctorPost, AppointmentGetParams, AppointmentGetQuery, AppointmentPostParams, AppointmentPostBody, AppointmentDeleteParams } from './types';

const DoctorsController = (connection: Connection): Router => {
  const doctorsRouter = Router();

  doctorsRouter
    .route('/doctors')
    .post(
      async function (req: Request<null, null, DoctorPost, null>, res: Response): Promise<Response> {
        const body = req.body;
        const firstName = body?.firstName;
        const lastName = body?.lastName;

        try {
          const error = validateRequestStrings(firstName, lastName);
          if (error) {
            return res
              .status(400)
              .send('Error: name and textBody must be strings');
          }

          const doctorRepo = connection.getRepository(Doctor);
          const newDoctor = doctorRepo.create({ firstName, lastName });
          await doctorRepo.save(newDoctor);
          const doctors = await doctorRepo.find();
          return res.status(201).send(doctors);
        } catch (e) {
          console.error(e);
          return res.status(500).send(e);
        }
      }
    )
    .get(
      async function (_, res: Response): Promise<Response> {
        try {
          const doctorRepo = connection.getRepository(Doctor);
          const doctors = await doctorRepo.find();
          return res.status(200).send(doctors)
        } catch(e) {
          console.error(e);
          return res.status(500).send(e);
        }
      }
    )

  doctorsRouter
    .route('/doctors/:id/appointments')
    .post(
      async function (req: Request<AppointmentPostParams, null, AppointmentPostBody, null>, res: Response) {
        try {
          const params = req.params;
          const id = params?.id;

          const body = req.body;
          const time = body?.time;
          const patientFirstName = body?.firstName;
          const patientLastName = body?.lastName;
          const type = body?.type;

          validateAppointmentPost(time, patientFirstName, patientLastName, type);

          validateAppointmentTime(time);
          const doctorRepo = connection.getRepository(Doctor);
          const doctor = await doctorRepo.findOne({ where: {id}, relations: ['appointments'] });
          if (!doctor) {
            return res.status(404).send(`No matching doctor with id ${id} found.`);
          }

          const appts = doctor.appointments || [];

          validateAppointmentFrequency(time, appts);

          const apptRepo = connection.getRepository(Appointment);
          const newAppt = apptRepo.create(
            { doctor, time, patientFirstName, patientLastName, type }
            );
          await apptRepo.save(newAppt);
          const result = await apptRepo.find(); // TODO: Should return newly-made appointment

          res.status(201).send(result[0]);
        } catch (e) {
          res.status(400).send(e); // This is for overbooked times
        }
      }
    )
    .get(
      async function (req: Request<AppointmentGetParams, null, null, AppointmentGetQuery>, res: Response) {
        try {
          const params = req.params;
          const id = params?.id;

          const queryParams = req.query;
          const date = queryParams?.date;

          validateDate(date);
          const [month, day, year] = date.split('/');

          const doctorRepo = connection.getRepository(Doctor);
          const doctor = await doctorRepo.findOne({where: {id}, relations: ['appointments']});
          // I should be using Postgres to filter, but my TypeORM knowledge is a bit lacking and I'm low on time.
          const appts = doctor?.appointments || [];
          const result = appts.filter(appt => {
            const d = new Date(appt.time);
            const monthMatches = d.getMonth() + 1 === parseInt(month);
            const dayMatches = d.getDate() === parseInt(day);
            const yearMatches = d.getFullYear() === parseInt(year);
            return monthMatches && dayMatches && yearMatches;
          })
          res.status(200).send(result);
        } catch (e) {
          console.error(e);
          res.status(400).send(e);
        }
      }
    )

  doctorsRouter
    .route('/doctors/:doctorId/appointments/:apptId')
    .patch(
      async function(req: Request<AppointmentDeleteParams, null, AppointmentPostBody, null>, res: Response) {
        try {

          const params = req.params;
          const apptId = params?.apptId;

          const body = req.body;
          const time = body?.time;
          const patientFirstName = body?.firstName;
          const patientLastName = body?.lastName;
          const type = body?.type;

          validateAppointmentPost(time, patientFirstName, patientLastName, type);
          validateAppointmentTime(time);

          const apptsRepo = connection.getRepository(Appointment);
          const result = await apptsRepo.createQueryBuilder()
            .update({
              time,
              patientFirstName,
              patientLastName,
              type,
            })
            .where("id = :id", { id: apptId })
            .returning('*')
            .execute()

          res.status(200).send(result.raw[0]);
        } catch(e) {
          res.status(500).send(e);
        }
      }
    )
    .delete(
      async function (req: Request<AppointmentDeleteParams, null, null, null>, res: Response) {
        try {
          const params = req.params;
          const apptId = params.apptId;

          const apptRepo = connection.getRepository(Appointment);
          await apptRepo.delete({ id: apptId })
          res.status(200).send(`Appointment (id: ${apptId} deleted successfully.)`)
        } catch(e) {
          res.status(500).send(e);
        }
      }
    )

    return doctorsRouter;
};

export default DoctorsController;