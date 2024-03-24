const express = require('express');
var dbCon = require('../DBConInfo');
var chkAuth = require('../checkAuth');
const router = express.Router();

// 選択された商品の情報を表示する
router.get('/', (req, res) => {
    const loginUser = chkAuth.LoginChk(req.cookies.token);
    var cd = req.query.pid;
    var con = dbCon.Select_Db();
    const sql = 'SELECT * FROM products WHERE itemcd = ?;';
    con.query(sql, [cd], (err, row) => {
        if (err) {
            console.log('DB ACCESS ERROR');
            return;
        }
        const items = {
            title: `${row[0].itemname} - 商品情報`,
            isLoggedin: chkAuth.chkLoggedin(loginUser.name),
            info: 'こんにちは！' + loginUser.name + 'さん',
            result: row[0]
        };

        res.render('products', items);
    });
});

// 表示中の商品をカートに追加する
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
});

module.exports = router;