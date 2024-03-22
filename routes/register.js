const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
var dbCon = require('../DBConInfo');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('register', '');
});

const con = dbCon.Select_Db();

router.post('/', (req, res) => {
    const { username, email, passwd, zipCode, address } = req.body;
    let hashed_password = bcrypt.hashSync(passwd, 10);

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
    con.end();
    res.writeHead(301, { Location: '/login' });
    res.end();
});


module.exports = router;