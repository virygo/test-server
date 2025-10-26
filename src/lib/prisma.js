// src/lib/prisma.js
const { PrismaClient } = require('@prisma/client');

// Κοινό instance (singleton) – ασφαλές για dev hot-reload
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

// Στο dev κρατάμε το instance στο global, στο prod απλώς το εξάγουμε
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
