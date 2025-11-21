var express = require('express');
var router = express.Router();

// Sample in-memory courses data
const sampleCourses = [
  { id: 1, name: 'Intro to Calendars' },
  { id: 2, name: 'Advanced Scheduling' },
  { id: 3, name: 'Time Management 101' },
  { id: 4, name: 'Events and Notifications' },
  { id: 5, name: 'Integration Best Practices' }
];

// GET /v1/courses?per_page=2&page=1
router.get('/v1/courses', function(req, res, next) {
  const perPage = parseInt(req.query.per_page, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const paged = sampleCourses.slice(start, end);

  res.json({
    courses: paged,
    per_page: perPage,
    page: page,
    total: sampleCourses.length
  });
});

module.exports = router;
