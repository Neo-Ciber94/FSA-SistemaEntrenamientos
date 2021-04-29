// prettier-ignore
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '71962c672c8a782e9f6d663be94f9e5fd07037ca';
export const JWT_REFRESH_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7; // 1 week
export const JWT_ACCESS_EXPIRATION_MS = 1000 * 60 * 60; // 1 hour
export const BASE_URL = '/api';

// Minimun number of assessments a course class must have
export const MIN_NUMBER_OF_CLASS_ASSESSMENTS = 3;

// Minimun length of the password
export const MIN_PASSWORD_LENGTH = 6;

// Each minute delete all the expired user sessions
export const DELETE_USER_SESSION_TIME = 1000 * 60;

// Maximun number of concurrent user sessions
export const MAX_SESSIONS_PER_USER = 10;
