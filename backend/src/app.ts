import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimiter';
import { StorageUtil } from './utils/storage.util';

dotenv.config();

const app: Application = express();

// Security and middleware setup
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: '*', // In production, restrict to frontend domain
  credentials: true,
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Ensure upload directory exists and serve uploaded evidence files
StorageUtil.ensureUploadDirExists();
app.use('/uploads', express.static(path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads')));

// Mount main REST API router
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
