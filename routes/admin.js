const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
var dbCon = require('../DBConInfo');
const router = express.Router();


const con = dbCon.Select_Db();

// 商品画像アップロード用の情報
const storage = multer.diskStorage({
    destination: './public/files/',
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        // ファイル名は重複がないようUUIDで生成
        cb(null, `${uuid.v4()}.${ext}`);
    }
});
const upload = multer({ storage });

// 管理者メニューの表示
router.get('/', (req, res, next) => {
    res.render('admin', {title: '管理メニュー'});
});

// 商品一覧の表示
router.get('/product-manage', (req, res, next) => {
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
        res.render('product-manage', items);
    });
});

router.get('/product-manage/add', (req, res) => {
    res.render('product-manage-add', { title: '商品情報を追加' });
});

// 商品情報の追加
router.post('/product-manage/add', upload.single('image'), (req, res) => {
    const { itemcd, itemName, itemPrice, Description } = req.body;
    const image = '/files/' + req.file.filename;
    console.log(image + 'のアップロードが完了しました。');
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
    res.writeHead(301, { Location: '/admin/product-manage' });
    res.end();

});

// 商品情報の削除
router.post('/product-manage/delete', function (req, res) {
    const cd = req.body.delcd;
    const sql = 'DELETE FROM products WHERE itemcd = ?';
    con.query(sql, cd, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send('削除エラー');
        }
    });
    res.writeHead(301, { Location: '/admin/product-manage' });
    res.end();
});

// ユーザーアカウントの一覧表示
router.get('/customer-manage', function (req, res, next) {
  const sql = 'SELECT username, email, zip, address FROM customer;';
  con.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    res.render('customer-manage', { title: 'アカウント一覧', customer: results });
  });
});

// ユーザーアカウントの削除
router.post('/customer-manage/delete', function (req, res) {
    const cd = req.body.delcd;
    const sql = 'DELETE FROM customer WHERE email = ?';
    con.query(sql, cd, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send('削除エラー');
        }
    });
    res.writeHead(301, { Location: '/admin/customer-manage' });
    res.end();
});

module.exports = router;