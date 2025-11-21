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

/* GET timer page. */
router.get('/timer', function(req, res, next) {
  res.render('timer', { title: 'Express' });
});

/* GET money page. */
router.get('/money', function(req, res, next) {
  res.render('money', { title: 'Express' });
});

module.exports = router;
