// DB接続情報
const mysql = require('mysql2');
// 環境情報の読み込み
require('dotenv').config();
const env = process.env;

// MySQLの接続情報
function Select_Db() {
    const connection = mysql.createConnection({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE
    });
    return connection;
}

module.exports = {
    Select_Db: Select_Db
};