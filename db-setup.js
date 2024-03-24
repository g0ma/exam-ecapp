const mysql = require('mysql2');
// MySQL接続情報
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20240222'
});
function CreateDB() {

    // MySQL接続
    connection.connect(err => {
        if (err) {
            console.error('MySQL接続エラー:', err);
            throw err;
        }
        console.log('MySQLに接続しました');
    });

    var sql = 'CREATE DATABASE IF NOT EXISTS exam_ec DEFAULT CHARACTER SET utf8;';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('データベース作成エラー:', err);
            throw err;
        }
        console.log('データベースが作成されました');
    });

    // テーブル作成
    sql = 'CREATE TABLE IF NOT EXISTS exam_ec.customer' +
        ' (`username` mediumtext, `email` mediumtext, `zip` mediumtext,' +
        ' `address` mediumtext,`passwd` mediumtext) ENGINE=InnoDB DEFAULT CHARSET=utf8;';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('customerテーブル作成エラー:', err);
            throw err;
        }
        console.log('customerテーブルが作成されました');
    });

    sql = 'CREATE TABLE IF NOT EXISTS exam_ec.products' +
        ' (`itemcd` int(11) NOT NULL, `itemname` varchar(255) DEFAULT NULL,' +
        ' `itemprice` decimal(10,2) NOT NULL, `description` mediumtext, `filepath`' +
        ' mediumtext, PRIMARY KEY (`itemcd`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;';

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('productsテーブル作成エラー:', err);
            throw err;
        }
        console.log('productsテーブルが作成されました');
    });

    sql = 'CREATE TABLE IF NOT EXISTS exam_ec.itemcart (' +
        'userid VARCHAR(255) NOT NULL, ' +
        'itemcd VARCHAR(8) NOT NULL, ' +
        'quantity INT NOT NULL ' +
        ') CHARACTER SET utf8; ';
}

module.exports = {
    CreateDB: CreateDB
};

/*
var dbSetup = require('./db-setup');
dbSetup.CreateDB();
 */