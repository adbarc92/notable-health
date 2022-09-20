import { ConnectionManager, Connection } from 'typeorm';

import typeOrmConfig from './config';

import { Doctor, Appointment } from './models';

const connectionManager = new ConnectionManager();

const connection = connectionManager.create({
  ...typeOrmConfig,
  entities: [ Doctor, Appointment ]
});

export const initConnection = async (): Promise<Connection | null> => {
  try {
    await connection.connect();
    console.debug('Connected!');
    return connection;
  } catch (err) {
    console.log('It is failing here');
    console.error(err);
    return null;
  }
};