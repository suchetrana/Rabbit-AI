import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { helmetMiddleware } from './middlewares/helmet';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './docs/swagger';
import uploadRoute from './routes/upload.route';
import { env } from './config/env';

const app = express();

// ─── Security ─────────────────────────────────────────────
app.use(helmetMiddleware);
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Docs ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────
app.use('/api/upload', uploadRoute);

// ─── Health Check ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handling ───────────────────────────────────────
app.use(errorHandler);

export default app;
