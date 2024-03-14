const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const router = express.Router();

// 環境情報の読み込み
require('dotenv').config();
const env = process.env;

// MySQLの接続情報
function dbInfo() {
    const connection = mysql.createConnection({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE
    });
    return connection;
}

router.get('/', (req, res, next) => {
    res.render('register', '');
});

router.post('/', (req, res) => {
    const { username, email, passwd, zipCode, address } = req.body;
    let hashed_password = bcrypt.hashSync(passwd, 10);

    var con = dbInfo();
    //登録情報をDBへINSERT
    const sql = `
    INSERT INTO customer (username, email, zip, address, passwd)
     VALUES (?, ?, ?, ?, ?)`;

    con.query(sql, [username, email, zipCode, address, hashed_password], (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send('会員登録エラー');
            return;
        }
    });
    con.end();

    res.writeHead(301, { Location: '/login' });
    res.end();
});


module.exports = router;