const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const env = process.env;
const secretKey = env.CK_SECKEY;
const router = express.Router();

// MySQLの接続情報
const con = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE
});

router.get('/', (req, res) => {
    res.render('login', '');
});

router.post('/', (req, res) => {
    const sql = 'SELECT * FROM customer WHERE email = ?;';
    con.query(sql, [req.body.email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(401).send('ログインエラー：DBエラー');
        }

        // ユーザーが見つからなかった場合
        if (results == '') {
            return res.status(401).send('ログインエラー：ユーザーが見つかりません');
        }

        // 入力されたパスワードとDBのパスワードを比較
        bcrypt.compare(req.body.password, results[0].passwd, (err, result) => {
            // パスワード不一致の場合
            if (err) {
                return res.status(401).send('ログインエラー：認証エラー');
            }

            if (!result) {
                return res.status(401).send('ログインエラー：パスワードが間違っています');
            }

            console.log('認証成功:' + results[0].username);
            const payload = { user: results[0].username };
            const option = { expiresIn: '12h' };
            const token = jwt.sign(payload, secretKey, option);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true
            });
            res.writeHead(301, { Location: '/' });
            res.end();
        });
    });
});
module.exports = router;