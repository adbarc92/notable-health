//https://stackoverflow.com/questions/42109813/node-js-environment-variables-and-heroku-deployment

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import dotenv from 'dotenv';
dotenv.config();

const typeOrmConfig: PostgresConnectionOptions = {
  name: process.env.DB_CONNECTION_NAME,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'outlinear',
  synchronize: true,
  logging: false,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};

export default typeOrmConfig;