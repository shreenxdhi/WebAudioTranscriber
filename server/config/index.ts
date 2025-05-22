import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

// Environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const API_PREFIX = process.env.API_PREFIX || '/api';

// CORS
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const CORS_CREDENTIALS = process.env.CORS_CREDENTIALS === 'true';

// File Uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600', 10); // 100MB
const ALLOWED_FILE_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'];

// Database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/webaudio_transcriber';
const DB_SSL = process.env.DB_SSL === 'true';

// Authentication
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_COOKIE_EXPIRES_IN = 7; // days

// Rate Limiting
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // Limit each IP to 100 requests per windowMs

export const config = {
  env: NODE_ENV,
  isProduction: NODE_ENV === 'production',
  isDevelopment: NODE_ENV === 'development',
  server: {
    port: PORT,
    host: HOST,
    apiPrefix: API_PREFIX,
  },
  cors: {
    origin: CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    methods: CORS_METHODS,
    credentials: CORS_CREDENTIALS,
  },
  uploads: {
    directory: UPLOAD_DIR,
    maxFileSize: MAX_FILE_SIZE,
    allowedFileTypes: ALLOWED_FILE_TYPES,
  },
  database: {
    url: DATABASE_URL,
    ssl: DB_SSL,
  },
  jwt: {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
    cookieExpiresIn: JWT_COOKIE_EXPIRES_IN,
  },
  rateLimit: {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
  },
} as const;

export type Config = typeof config;
