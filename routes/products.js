const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

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

router.get('/', (req, res, next) => {
    var cd = req.query.pid;
    var con = Select_Db();
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

    module.exports = router;