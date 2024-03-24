const express = require('express');
const bcrypt = require('bcrypt');
var dbCon = require('../DBConInfo');
const router = express.Router();

// 情報入力フォームの表示
router.get('/', (req, res) => {
    res.render('register', {title: '会員情報を登録'});
});


// 入力された情報を基にアカウント情報をDBへ登録
router.post('/', (req, res) => {
    const { username, email, passwd, zipCode, address } = req.body;
    let hashed_password = bcrypt.hashSync(passwd, 10);
    const con = dbCon.Select_Db();

    //登録情報をDBへINSERT
    const sql = `INSERT INTO customer (username, email, zip, address, passwd)
     VALUES (?, ?, ?, ?, ?)`;
     con.query(sql, [username, email, zipCode, address, hashed_password], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('会員登録エラー');
            return;
        }
    });
    // 登録後にログインページへ遷移
    res.writeHead(301, { Location: '/login' });
    res.end();
});


module.exports = router;