var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/meetinginfo', function(req, res, next) {
    url = 'http://www.daccaa.org/query.asp';

    request(url, function(err, res, html) {
        if(!err) {
            var pageData = cheerio.load(html);
            res.send(pageData);
        }
    })
})

module.exports = router;
