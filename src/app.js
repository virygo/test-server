// src/app.js
require('dotenv').config();
const express = require('express');

// middlewares
const lang = require('./middlewares/lang');
const errorHandler = require('./middlewares/errorHandler');

// routes
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const filtersRoutes = require('./routes/filters');
const businessesRoutes = require('./routes/businesses'); // <-- το νέο route
const regionsRoutes = require('./routes/regions');

const app = express();
app.use(express.json());
app.use(lang);

// basic checks
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/ping', (_req, res) => res.json({ pong: true }));

// mount routers
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/category', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api/businesses', businessesRoutes); // <-- σημαντικό
app.use('/api/regions', regionsRoutes);

// 404 logger
app.use((req, res) => {
  console.log('404', req.method, req.path);
  res.status(404).send(`Cannot ${req.method} ${req.path}`);
});

// error handler
app.use(errorHandler);

// ΠΡΟΣΟΧΗ: ΔΕΝ κάνουμε app.listen εδώ.
// Εξάγουμε μόνο το app και το κάνει listen το index.js στο root.
module.exports = app;
