const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
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

// ファイルアップロード用の情報
const storage = multer.diskStorage({
    destination: './public/files/',
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        // ファイル名は重複がないようUUIDで生成
        cb(null, `${uuid.v4()}.${ext}`);
    }
});
const upload = multer({ storage });


router.get('/', (req, res, next) => {
    res.render('admin', '');
});

router.get('/product-manage', (req, res, next) => {
    var con = dbInfo();
    const sql = 'SELECT * FROM products;';
    con.query(sql, (err, results) => {
        if (err) {
            console.log('DB ACCESS ERROR');
            return;
        }
        var items = {
            title: '商品一覧',
            content: results
        }
        con.end();
        res.render('product-manage', items);
    });
});

router.get('/product-manage/add', (req, res, next) => {
    res.render('product-manage-add', { title: '商品情報を追加' });
});

// 要求された商品情報追加の処理 wip
router.post('/product-manage/add', upload.single('image'), (req, res) => {
    const { itemcd, itemName, itemPrice, Description } = req.body;
    const image = '/files/' + req.file.filename;
    console.log(image + 'のアップロードが完了しました。');
    var con = dbInfo();
    // 商品情報 INSERT
    const sql = `
    INSERT INTO products (itemcd, itemname, itemprice, description, filepath)
    VALUES (?, ?, ?, ?, ?)`;

    con.query(sql, [itemcd, itemName, itemPrice, Description, image], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('商品登録エラー');
            return;
        }
    });
    con.end();
    res.writeHead(301, { Location: '/admin/product-manage' });
    res.end();

});

module.exports = router;