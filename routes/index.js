var express = require('express');
var chkAuth = require('../checkAuth');
var dbCon = require('../DBConInfo');
var router = express.Router();

router.get('/', function (req, res, next) {
  const loginUser = chkAuth.LoginChk(req.cookies.token);
  var con = dbCon.Select_Db();
  const sql = 'SELECT * FROM products;';
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(401).send('DBエラー');;
    }
    var items = {
      title: 'こんにちは！' + loginUser.name + 'さん',
      content: results
    }

    res.render('index', items);
  });
});

router.get('/search', function (req, res) {
  const word = req.query.search;
  var con = Select_Db();
  con.query('SELECT * FROM products WHERE itemname LIKE ?', ['%' + word + '%'], function (error, results, fields) {
    if (error) {
      res.status(502).send('サーバーエラー\r\n' + error.message);
    }
    var result = {
      title: word + 'の検索結果',
      content: results
    };
    res.render('index', result);
  });
});

module.exports = router;
