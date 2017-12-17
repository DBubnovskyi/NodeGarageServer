var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('tennis', { title: 'Garage EPAM' });
});

module.exports = router;
