var express = require('express');
var chkAuth = require('../checkAuth');
var dbCon = require('../DBConInfo');
var router = express.Router();

// トップページ（商品一覧の表示）
router.get('/', (req, res) => {
  const loginUser = chkAuth.LoginChk(req.cookies.token);
  var con = dbCon.Select_Db();
  const sql = 'SELECT * FROM products;';
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(401).send('DBエラー');;
    }
    var items = {
      title: '通販トップ',
      isLoggedin: chkAuth.chkLoggedin(loginUser.name),
      info: 'こんにちは！' + loginUser.name + 'さん',
      content: results,
    }
    res.render('index', items);
  });
});

// キーワード検索で絞り込んだ商品の一覧を表示する
router.get('/search', (req, res) => {
  const loginUser = chkAuth.LoginChk(req.cookies.token);
  const word = req.query.search;
  var con = dbCon.Select_Db();
  con.query('SELECT * FROM products WHERE itemname LIKE ?', ['%' + word + '%'], (error, results) => {
    if (error) {
      res.status(502).send('サーバーエラー\r\n' + error.message);
    }
    var result = {
      title: word + 'の検索結果',
      info: 'こんにちは！' + loginUser.name + 'さん',
      content: results,
      isLoggedin: chkAuth.chkLoggedin(loginUser.name)
    };
    res.render('index', result);
  });
});

module.exports = router;
