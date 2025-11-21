var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET expenses page. */
router.get('/expenses', function(req, res, next) {
  res.render('expenses', { title: 'Express' });
});

module.exports = router;
