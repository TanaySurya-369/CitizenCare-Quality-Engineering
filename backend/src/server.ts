import app from './app';
import { logger } from './utils/logger.util';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`CitizenCare REST API Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API Base: http://localhost:${PORT}/api`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});
