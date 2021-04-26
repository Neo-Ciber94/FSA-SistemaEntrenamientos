import 'reflect-metadata';
import express from 'express';
import { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { createExpressServer, useExpressServer } from 'routing-controllers';
import { AutenticateToken } from './middlewares/AutenticateToken';

const PORT = process.env.PORT || 3000;

// Create express server
const app = express();

// Setup express middlewares
app.use(cookieParser());
app.use(morgan('dev'));

// Setup express controllers
useExpressServer(app, {
  cors: true,
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 404,
  },
  controllers: [__dirname + '/controllers/*.ts'],
  middlewares: [AutenticateToken],
});

// Connect to database
createConnection()
  .then(async (connection) => {
    await connection.runMigrations();
    console.log(`Connected to database "${connection.driver.database}"`);
  })
  .catch((err) => {
    console.error(err);
  });

// Start listening
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}...`);
});
