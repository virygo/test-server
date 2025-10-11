require('dotenv').config();
const express = require('express');

// routes
const lang = require('./middlewares/lang');
const errorHandler = require('./middlewares/errorHandler');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(lang);

// basic checks
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.send('Server is up and running'));
app.get('/api/ping', (_req, res) => res.json({ pong: true }));

// mount routers
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

// 404 logger
app.use((req, res) => {
  console.log('404', req.method, req.path);
  res.status(404).send(`Cannot ${req.method} ${req.path}`);
});

app.use(errorHandler);

module.exports = app;
