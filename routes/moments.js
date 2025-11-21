var express = require('express');
var router = express.Router();
var db = require('../db/database');

// POST /api/moments - Record a new moment
router.post('/moments', function(req, res, next) {
  const { title, description, date, time, category, cost, currency } = req.body;

  // Validate required fields
  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  db.recordMoment(title, description || '', date, time || '', category || 'General', 
                  parseFloat(cost) || 0, currency || 'USD', function(err, moment) {
    if (err) {
      return res.status(500).json({ error: 'Failed to record moment', details: err.message });
    }
    res.status(201).json({ success: true, moment });
  });
});

// GET /api/moments - Get all moments
router.get('/moments', function(req, res, next) {
  db.getAllMoments(function(err, moments) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch moments', details: err.message });
    }
    res.json({ success: true, moments });
  });
});

// GET /api/moments/date/:date - Get moments by date
router.get('/moments/date/:date', function(req, res, next) {
  const { date } = req.params;

  db.getMomentsByDate(date, function(err, moments) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch moments', details: err.message });
    }
    res.json({ success: true, moments });
  });
});

// GET /api/moments/category/:category - Get moments by category
router.get('/moments/category/:category', function(req, res, next) {
  const { category } = req.params;

  db.getMomentsByCategory(category, function(err, moments) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch moments', details: err.message });
    }
    res.json({ success: true, moments });
  });
});

// GET /api/moments/:id - Get moment by ID
router.get('/moments/:id', function(req, res, next) {
  const { id } = req.params;

  db.getMomentById(id, function(err, moment) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch moment', details: err.message });
    }
    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }
    res.json({ success: true, moment });
  });
});

// PUT /api/moments/:id - Update moment
router.put('/moments/:id', function(req, res, next) {
  const { id } = req.params;
  const { title, description, date, time, category, cost, currency } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  db.updateMoment(id, title, description || '', date, time || '', category || 'General',
                  parseFloat(cost) || 0, currency || 'USD', function(err, result) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update moment', details: err.message });
    }
    res.json({ success: true, result });
  });
});

// DELETE /api/moments/:id - Delete moment
router.delete('/moments/:id', function(req, res, next) {
  const { id } = req.params;

  db.deleteMoment(id, function(err, result) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete moment', details: err.message });
    }
    res.json({ success: true, result });
  });
});

// GET /api/expenses - Get expense summary
router.get('/expenses/summary', function(req, res, next) {
  db.getExpenseSummaryByCategory(function(err, summary) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch expense summary', details: err.message });
    }
    res.json({ success: true, summary });
  });
});

// GET /api/expenses/total - Get total expenses
router.get('/expenses/total', function(req, res, next) {
  db.getTotalExpenses(function(err, totals) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch total expenses', details: err.message });
    }
    res.json({ success: true, totals });
  });
});

// GET /api/expenses/range - Get expenses by date range
router.get('/expenses/range', function(req, res, next) {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }

  db.getExpensesByDateRange(startDate, endDate, function(err, expenses) {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch expenses', details: err.message });
    }
    res.json({ success: true, expenses });
  });
});

module.exports = router;
