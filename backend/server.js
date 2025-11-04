import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, getDbStatus } from './config/db.js';
import moodRoutes from './routes/moodRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seasonalDiseaseRoutes from './routes/seasonalDiseaseRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'MonBondhu API' });
});

// API root helper (avoid confusion when hitting /api directly)
app.get('/api', (_req, res) => {
  res.json({
    ok: true,
    message: 'MonBondhu API',
    status: '/api/status',
    users: {
      register: { method: 'POST', path: '/api/users/register' },
      login: { method: 'POST', path: '/api/users/login' },
      recover: { method: 'POST', path: '/api/users/recover' },
      profile: { method: 'GET|PUT', path: '/api/users/:id' }
    },
    mood: {
      add: { method: 'POST', path: '/api/mood' },
      byUser: { method: 'GET', path: '/api/mood/:userId' }
    },
    help: {
      add: { method: 'POST', path: '/api/help' },
      list: { method: 'GET', path: '/api/help' }
    }
  });
});

// Detailed status
app.get('/api/status', (_req, res) => {
  const skipDb = String(process.env.SKIP_DB).toLowerCase() === 'true';
  res.json({
    ok: true,
    service: 'MonBondhu API',
    skipDb,
    db: skipDb ? { connected: false, readyState: 0 } : getDbStatus(),
    env: {
      port: process.env.PORT || 5000,
      dbName: process.env.MONGO_DB || 'monbondhu',
      hasMongoUri: Boolean(process.env.MONGO_URI)
    }
  });
});

// API Routes
app.use('/api/mood', moodRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seasonal-diseases', seasonalDiseaseRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/posts', postRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

let basePort = Number(process.env.PORT || 5000);

const skipDb = String(process.env.SKIP_DB).toLowerCase() === 'true';
const forcePort = String(process.env.FORCE_PORT).toLowerCase() === 'true';

function tryListen(port, attemptsLeft = 5) {
  const server = app.listen(port, () => console.log(`MonBondhu API running on port ${port}`));
  server.on('error', (err) => {
    if (err?.code === 'EADDRINUSE' && !forcePort && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use, trying ${nextPort}...`);
      tryListen(nextPort, attemptsLeft - 1);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

if (skipDb) {
  console.warn('Starting server in SKIP_DB mode (using in-memory storage)');
  tryListen(basePort);
} else {
  connectToDatabase()
    .then(() => {
      tryListen(basePort);
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });
}


