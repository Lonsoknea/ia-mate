'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables from ../.env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
const analyzeRouter = require('./routes/analyze');
const generateRouter = require('./routes/generate');
const diagramRouter = require('./routes/diagram');
const refineRouter = require('./routes/refine');

app.use('/api/analyze', analyzeRouter);
app.use('/api/generate', generateRouter);
app.use('/api/diagram', diagramRouter);
app.use('/api/refine', refineRouter);

// Start server
app.listen(PORT, () => {
  console.log(`IA MATE backend listening on http://localhost:${PORT}`);
});
