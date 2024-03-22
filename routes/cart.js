const express = require('express');
const router = express.Router();
var chkAuth = require('../checkAuth');
var dbCon = require('../DBConInfo');
require('dotenv').config();
const env = process.env;
const stripe = require('stripe')(env.STRIPE_API);
const YOUR_DOMAIN = 'http://localhost:3000';

const con = dbCon.Select_Db();

// DBからカート情報を取得してカートに入っている商品を表示する
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM ';

  con.query(sql, (err, results) => {
    if (err) {
      return res.render('login', { message: 'カート取得エラー：DBエラー' });
    }
    res.render('cart', { title: "ショッピングカート", 'content': results });
  });
});

// checkout→カート情報を基にStripeで決済を行う
router.post('/checkout', async function (req, res) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: '波乗りジョニー',
          },
          unit_amount: 1820,
        },
        quantity: 2,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/',
    cancel_url: 'http://localhost:3000/cart',
  });

  res.redirect(303, session.url);
});
module.exports = router;