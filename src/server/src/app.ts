import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import { CorsOptions } from 'cors';
import { BASE_URL } from './config';
import {
  startDeleteExpiredSessionsRoutine,
  startPurgueDeletedUsersRoutine,
  authorizationChecker,
} from './scripts';
import { LOGGER } from './utils/Logger';

// Server port
const PORT = process.env.PORT || 3000;

// Create express server
const app = express();

// Setup express middlewares
app.use(cookieParser());
app.use(morgan('dev'));

// Cors configuration
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
};

// Setup express controllers
useExpressServer(app, {
  cors: corsOptions,
  routePrefix: BASE_URL,
  authorizationChecker,
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 404,
  },
  controllers: [__dirname + '/controllers/*.ts'],
  middlewares: [__dirname + '/middlewares/*.ts'],
});

// Connect to database
createConnection()
  .then(async (connection) => {
    await connection.runMigrations();
    runRoutines();
    LOGGER.info(`Connected to database "${connection.driver.database}"`);
  })
  .catch((err) => {
    console.error(err);
  });

// Server routines
function runRoutines() {
  startDeleteExpiredSessionsRoutine();
  startPurgueDeletedUsersRoutine();
}

// Start listening
app.listen(PORT, () => {
  LOGGER.info(`Server running at port ${PORT}`);
});
