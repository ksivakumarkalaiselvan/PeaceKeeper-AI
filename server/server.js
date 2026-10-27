const express = require('express');
const path = require('path');
const cors = require('cors');
const { PORT, UPLOAD_PATH } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const conflictRoutes = require('./routes/conflictRoutes');
const newsRoutes = require('./routes/newsRoutes');
const satelliteRoutes = require('./routes/satelliteRoutes');
const riskRoutes = require('./routes/riskRoutes');
const treatyRoutes = require('./routes/treatyRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportExportRoutes = require('./routes/reportExportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const mapRoutes = require('./routes/mapRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static uploaded files & frontend client
app.use('/uploads', express.static(UPLOAD_PATH));
app.use(express.static(path.join(__dirname, '../client')));

// Mount REST API endpoints under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reports', conflictRoutes);

// Export PDF route alias
app.use('/api/v1/reports', reportExportRoutes);

app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/satellite', satelliteRoutes);
app.use('/api/v1/risk', riskRoutes);
app.use('/api/v1/treaties', treatyRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/map', mapRoutes);
app.use('/api/v1/ai', aiRoutes);

// Healthcheck
app.get('/api/v1/health', (req, res) => {
  const groqService = require('./services/groqService');
  res.json({
    status: 'online',
    system: 'PeaceKeeper AI — Autonomous Swarm Command',
    groqAiEngine: {
      status: groqService.isConfigured() ? 'active' : 'inactive',
      model: groqService.primaryModel
    },
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback for Client routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 PEACEKEEPER AI COMMAND CENTER ONLINE`);
  logger.info(`📡 Server listening on port ${PORT}`);
  logger.info(`🌐 Web Dashboard: http://localhost:${PORT}`);
  logger.info(`⚡ Mode: Phase 1 (Full-Stack Mock Persistence Active)`);
  logger.info(`=======================================================`);
});

module.exports = app;
