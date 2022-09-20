//https://stackoverflow.com/questions/42109813/node-js-environment-variables-and-heroku-deployment

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import dotenv from 'dotenv';
dotenv.config();

const typeOrmConfig: PostgresConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: '127.0.0.1',
  port: parseInt('5432'),
  username: 'postgres',
  password: 'postgres',
  database: 'notable_health',
  synchronize: true,
  logging: false,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};

export default typeOrmConfig;