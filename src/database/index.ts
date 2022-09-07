import { ConnectionManager, Connection } from 'typeorm';

import typeOrmConfig from './config';

/* Add Models here */

const connectionManager = new ConnectionManager();

const connection = connectionManager.create({
  ...typeOrmConfig,
  entities: [/* Add entities here */]
});

export const initConnection = async (): Promise<Connection | null> => {
  try {
    await connection.connect();
    console.debug('Connected!');
    return connection;
  } catch (err) {
    console.error(err);
    return null;
  }
};