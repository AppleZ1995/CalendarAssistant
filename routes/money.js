var express = require('express');
var router = express.Router();
var db = require('../db/database');

// GET all money records
router.get('/', function(req, res, next) {
  db.getAllMoney((err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// GET money by type (income, debt, consumption, savings)
router.get('/type/:type', function(req, res, next) {
  db.getMoneyByType(req.params.type, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// GET money summary by type
router.get('/summary/all', function(req, res, next) {
  db.getMoneySummaryByType((err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// GET money by date range
router.get('/range/:startDate/:endDate', function(req, res, next) {
  db.getMoneyByDateRange(req.params.startDate, req.params.endDate, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// POST add new money record
router.post('/', function(req, res, next) {
  const { type, title, amount, currency, date } = req.body;

  if (!type || !title || amount === undefined || !date) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  db.recordMoney(type, title, amount, currency || 'USD', date, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ success: true, data: result });
  });
});

// PUT update money record
router.put('/:id', function(req, res, next) {
  const { type, title, amount, currency, date } = req.body;

  if (!type || !title || amount === undefined || !date) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  db.updateMoney(req.params.id, type, title, amount, currency || 'USD', date, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: result });
  });
});

// DELETE money record
router.delete('/:id', function(req, res, next) {
  db.deleteMoney(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: result });
  });
});

// GET money by ID
router.get('/:id', function(req, res, next) {
  db.getMoneyById(req.params.id, (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    res.json({ success: true, data: row });
  });
});

module.exports = router;
