const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, 'calendar.db');

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Create moments table
    db.run(`
      CREATE TABLE IF NOT EXISTS moments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        category TEXT,
        cost REAL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating moments table:', err);
      } else {
        console.log('Moments table initialized');
        // Add cost column if it doesn't exist (for existing databases)
        db.run(`ALTER TABLE moments ADD COLUMN cost REAL DEFAULT 0`, (err) => {
          if (err && !err.message.includes('duplicate')) {
            console.error('Warning: Could not add cost column:', err);
          }
        });
        db.run(`ALTER TABLE moments ADD COLUMN currency TEXT DEFAULT 'USD'`, (err) => {
          if (err && !err.message.includes('duplicate')) {
            console.error('Warning: Could not add currency column:', err);
          }
        });
      }
    });
  });
}

// Record a new moment
function recordMoment(title, description, date, time, category, cost, currency, callback) {
  const sql = `
    INSERT INTO moments (title, description, date, time, category, cost, currency)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, description, date, time, category, cost || 0, currency || 'USD'], function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, {
        id: this.lastID,
        title,
        description,
        date,
        time,
        category,
        cost: cost || 0,
        currency: currency || 'USD',
        created_at: new Date().toISOString()
      });
    }
  });
}

// Get all moments
function getAllMoments(callback) {
  const sql = 'SELECT * FROM moments ORDER BY date DESC, time DESC';

  db.all(sql, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows || []);
    }
  });
}

// Get moments by date
function getMomentsByDate(date, callback) {
  const sql = 'SELECT * FROM moments WHERE date = ? ORDER BY time DESC';

  db.all(sql, [date], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows || []);
    }
  });
}

// Get moments by category
function getMomentsByCategory(category, callback) {
  const sql = 'SELECT * FROM moments WHERE category = ? ORDER BY date DESC, time DESC';

  db.all(sql, [category], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows || []);
    }
  });
}

// Update moment
function updateMoment(id, title, description, date, time, category, cost, currency, callback) {
  const sql = `
    UPDATE moments
    SET title = ?, description = ?, date = ?, time = ?, category = ?, cost = ?, currency = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [title, description, date, time, category, cost || 0, currency || 'USD', id], function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id, changes: this.changes });
    }
  });
}

// Delete moment
function deleteMoment(id, callback) {
  const sql = 'DELETE FROM moments WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id, deleted: this.changes });
    }
  });
}

// Get moment by ID
function getMomentById(id, callback) {
  const sql = 'SELECT * FROM moments WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

// Get total expenses by date range
function getExpensesByDateRange(startDate, endDate, callback) {
  const sql = `
    SELECT * FROM moments 
    WHERE cost > 0 AND date >= ? AND date <= ?
    ORDER BY date DESC, time DESC
  `;

  db.all(sql, [startDate, endDate], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows || []);
    }
  });
}

// Get expense summary by category
function getExpenseSummaryByCategory(callback) {
  const sql = `
    SELECT category, COUNT(*) as count, SUM(cost) as total, 
           AVG(cost) as average, currency
    FROM moments
    WHERE cost > 0
    GROUP BY category, currency
    ORDER BY total DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows || []);
    }
  });
}

// Get total expenses
function getTotalExpenses(callback) {
  const sql = `
    SELECT SUM(cost) as total, currency FROM moments 
    WHERE cost > 0
    GROUP BY currency
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows || []);
    }
  });
}

// Close database
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
}

module.exports = {
  recordMoment,
  getAllMoments,
  getMomentsByDate,
  getMomentsByCategory,
  updateMoment,
  deleteMoment,
  getMomentById,
  getExpensesByDateRange,
  getExpenseSummaryByCategory,
  getTotalExpenses,
  closeDatabase,
  db
};
