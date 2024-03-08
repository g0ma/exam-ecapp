var express = require('express');
const mysql = require('mysql2');
var router = express.Router();

// MySQLから商品一覧を取得する接続

// 環境情報の読み込み
require('dotenv').config();
const env = process.env;

// MySQLの接続情報
function Select_Db() {
    const connection = mysql.createConnection({
        // todo: ハードコードやめる
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE
    });
    return connection;
}

router.get('/', function (req, res, next) {
  var con = Select_Db();
  const sql = 'SELECT * FROM products;';
  con.query(sql, (err, results) => {
    if (err) {
      console.log('DB ACCESS ERROR');
      return;
    }
    var items = {
      title: 'こんにちは！',
      content: results
    }
    con.end();

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
