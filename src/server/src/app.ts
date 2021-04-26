import 'reflect-metadata';
import express from 'express';
import { Express } from 'express';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { createExpressServer } from 'routing-controllers';
import { AutenticateToken } from './middlewares/AutenticateToken';

export const SECRET_KEY = '71962c672c8a782e9f6d663be94f9e5fd07037ca';
const PORT = process.env.PORT || 3000;

// Create express server
const app = createExpressServer({
  cors: true,
  defaults: {
    nullResultCode: 404,
    undefinedResultCode: 404,
  },
  controllers: [__dirname + '/controllers/*.ts'],
  // middlewares: [morgan('dev'), express.json(), AutenticateToken],
  middlewares: [morgan('dev'), express.json()],
}) as Express;

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
