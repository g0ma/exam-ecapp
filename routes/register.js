const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('register', '');
});

router.post('/', (req, res) => {

    var loginId = req.body.username;
    var passWord = req.body.passwd;
    let hashed_password = bcrypt.hashSync(passWord, 10);

    //登録情報をDBへINSERT
});


module.exports = router;