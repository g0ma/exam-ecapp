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
    res.render('login', { message: 'ログイン情報を入力' });
});

router.post('/', (req, res) => {
    const sql = 'SELECT * FROM customer WHERE email = ?;';
    con.query(sql, [req.body.email], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login', { message: 'ログインエラー：DBエラー' });
        }

        // ユーザーが見つからなかった場合
        if (results.length === 0) {
            return res.render('login', { message: '認証に失敗しました メールアドレスまたはパスワードに誤りがあります' });
        }

        // 入力されたパスワードとDBのパスワードを比較
        bcrypt.compare(req.body.password, results[0].passwd, (err, result) => {
            // パスワード不一致の場合
            if (err) {
                return res.render('login', { message: '認証に失敗しました サーバーエラー' });
            }

            if (!result) {
                return res.render('login', { message: '認証に失敗しました メールアドレスまたはパスワードに誤りがあります' });
            }

            console.log('認証成功:' + results[0].email);
            const payload = {
                user: results[0].username,
                email: results[0].email
            };
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