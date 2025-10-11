const express = require('express');
const router = express.Router();

// Προσωρινά δεδομένα για έλεγχο
const categories = [
  { id: 1, name: 'Accommodation' },
  { id: 2, name: 'Food & Drink' },
  { id: 3, name: 'Transport' },
  { id: 4, name: 'Spa & Wellness' },
];

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

// Endpoint για categories
router.get('/categories', (req, res) => {
  res.json(categories);
});

// Endpoint για users
router.get('/users', (req, res) => {
  res.json(users);
});

module.exports = router;
