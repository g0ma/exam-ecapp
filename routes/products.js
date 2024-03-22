const express = require('express');
const mysql = require('mysql2');
var dbCon = require('../DBConInfo');
var chkAuth = require('../checkAuth');
const router = express.Router();

// 環境情報の読み込み
require('dotenv').config();
const env = process.env;

// MySQLの接続情報

router.get('/', (req, res, next) => {
    var cd = req.query.pid;
    var con = dbCon.Select_Db();
    const sql = 'SELECT * FROM products WHERE itemcd = ?;';
    con.query(sql, [cd], (err, row) => {
        if (err) {
            console.log('DB ACCESS ERROR');
            return;
        }
        console.log('succcess' + row[0].itemcd);

        res.render('products', { title: `${row[0].itemname} - 商品情報`, result: row[0] });
    });
});

router.post('/addcart', (req, res) => {
    console.log('addcart処理');
    const itemcd = req.body.itemcd;
    console.log(itemcd);
    const loginUser = chkAuth.LoginChk(req.cookies.token);

    // ログインしていない場合、ログイン画面へ遷移する
    if (loginUser.name == 'ゲスト') {
        res.writeHead(301, { Location: '/login' });
        return res.end();
    }
    // カート追加で受け取った商品とユーザーを紐づけてDBへ格納する
    const sql = 'INSERT INTO itemcart (userid, itemcd, quantity) VALUES (?, ?, ?);';
    var con = dbCon.Select_Db();
    con.query(sql, [loginUser.email, itemcd, 1], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('カート登録エラー');
            return;
        }
        res.writeHead(301, { Location: '/cart' });
        res.end();
    });

    /*
    itemcartテーブル
    userid(ユーザーのメールアドレス)
    itemcd(商品コード)
    quantity(数量)
     */
});

module.exports = router;