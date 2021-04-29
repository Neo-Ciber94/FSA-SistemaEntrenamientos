import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import cors, { CorsOptions } from 'cors';

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
  routePrefix: '/api',
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
    console.log(`Connected to database "${connection.driver.database}"`);
  })
  .catch((err) => {
    console.error(err);
  });

// Start listening
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}...`);
});
