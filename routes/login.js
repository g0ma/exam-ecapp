const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
require('dotenv').config();
const env = process.env;
const secretKey = "ここに読み込む";

// TODO env add hashcode

router.get('/', (req, res, next) => {
    res.render('login', '');
});

router.post('/', function (req, res, next) {
    bcrypt.compare(passWord, hashedpw, function (err, r) {
        if (r) {
            console.log('auth ok');
            // 動作確認用に全ユーザーログインOK
            const payload = { user: req.body.username };
            const option = { expiresIn: '1h' };
            const token = jwt.sign(payload, secretKey, option);

            res.cookie('name', loginId);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true
            });
            res.render('index', { title: "ログインしました" });
        } else {
            console.log('auth ng');
        }
    });
});

module.exports = router;