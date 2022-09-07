import { Request, Response, Router } from 'express';
import { Connection } from 'typeorm';
import { validateRequestStrings } from '../utils';

import { Doctor } from '../database/models'
import { DoctorPost } from './types';

const DoctorsController = (connection: Connection): Router => {
  const doctorsRouter = Router();

  doctorsRouter
    .route('/doctors')
    .post(async function (
      req: Request<null, null, DoctorPost, null>,
      res: Response,
    ): Promise<Response> {
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
    })
    .get(async function (
      _,
      res: Response,
    ): Promise<Response> {
      try {
        const doctorRepo = connection.getRepository(Doctor);
        const doctors = await doctorRepo.find();
        return res.status(200).send(doctors)
      } catch(e) {
        console.error(e);
        return res.status(500).send(e);
      }
    })

    return doctorsRouter;
};

export default DoctorsController;