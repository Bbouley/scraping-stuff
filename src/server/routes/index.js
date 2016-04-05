var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose-q')(require('mongoose'));
var Meeting = require('../models/meetings');


var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/meetinginfo', function(req, res, next) {
    console.log('Hitting meeting route');
    driver.get('http://www.daccaa.org/meetings.htm');
    driver.findElement(webdriver.By.name('cmdFindMeetings')).click();
    driver.getPageSource().then(function(source) {
        var sourceString = source.toString()
        var reg = /<td[^>]*>([\s\S]*?)<\/td>/
        var noTags = sourceString.replace(/<(?:.|\n)*?>/gm, '');
        var splitOnLines = noTags.split('\n');
        var trimArray = splitOnLines.map(function(el) {
            return el.trim();
        });
        var cleanArray = trimArray.filter(Boolean);
        res.send(cleanArray);
    });
    driver.quit();
});

router.post('/add', function(req, res, next) {
    var meeting = new Meeting(req.body);
    meeting.saveQ()
    .then(function (meeting) {
        res.json(meeting);
    })
    .catch(function(err) {
        res.json(err);
    })
    .done();
});

module.exports = router;
