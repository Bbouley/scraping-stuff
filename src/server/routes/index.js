var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
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
    driver.get('http://www.daccaa.org/meetings.htm');
    // driver.click('name="cmdFindMeetings"');
    var searchMeetings = driver.findElement(webdriver.By.name('cmdFindMeetings'));
    console.log(searchMeetings.click());
    driver.quit();



    // url = 'http://www.daccaa.org/query.asp';

    // var pageData = request(url, function(err, res, html) {
    //     if(!err) {
    //         var page = cheerio.load(html);
    //         console.log(page.html())
    //         return page ;
    //     }
    // });
})

module.exports = router;
