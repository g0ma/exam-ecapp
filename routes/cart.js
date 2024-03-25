const express = require('express');
const router = express.Router();
var chkAuth = require('../checkAuth');
var dbCon = require('../DBConInfo');
require('dotenv').config();
const env = process.env;
const stripe = require('stripe')(env.STRIPE_API);

const con = dbCon.Select_Db();

// DBからカート情報を取得してカートに入っている商品を表示する
router.get('/', (req, res) => {
  const sql = 'SELECT c.userid, c.itemcd, p.itemname, p.itemprice, p.filepath' +
    ' FROM itemcart c ' +
    'INNER JOIN products p ON c.itemcd = p.itemcd ' +
    'WHERE c.userid = ?;';
  const loginUser = chkAuth.LoginChk(req.cookies.token);
  con.query(sql, loginUser.email, (err, results) => {
    if (err) {
      return res.render('login', { message: 'カート取得エラー：DBエラー' + '\n' + err.message });
    }
    let totalAmount = 0;
    results.forEach((row) => {
      totalAmount += Math.round(row.itemprice);
    });
    const items = {
      title: "ショッピングカート",
      info: 'こんにちは！' + loginUser.name + 'さん',
      userid: loginUser.email,
      content: results,
      amount: totalAmount
    };
    res.render('cart', items);
  });
});

// カートから選択した商品を削除する
router.post('/delete', (req, res) => {
  const loginUser = chkAuth.LoginChk(req.cookies.token);
  const itemcd = req.body.itemcd;
  const sql = 'DELETE FROM itemcart WHERE userid = ? AND itemcd = ?;';

  con.query(sql, [loginUser.email, itemcd], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('削除エラー');
    }
  });
  res.writeHead(301, { Location: '/cart' });
  res.end();
});

// checkout→カート情報を基にStripeで決済を行う
router.post('/checkout', async (req, res) => {
  try {
    // stripeへAPI経由で決済に必要な情報を送信
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: '商品代金',
            },
            unit_amount: req.body.totalamount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',

      success_url: 'http://localhost:3000/cart/complete',
      cancel_url: 'http://localhost:3000/cart'
      // success_url: 'https://ec.halu.ink/complete',
      // cancel_url: 'https://ec.halu.ink/cart'
    });
    res.redirect(303, session.url);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/complete', (req, res) => {
  const loginUser = chkAuth.LoginChk(req.cookies.token);
  var con = dbCon.Select_Db();

  // 注文履歴に記録→削除にする
  const sql = 'DELETE FROM itemcart WHERE userid = ?';
  con.query(sql, loginUser.email, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('削除エラー');
    }
  });
  res.writeHead(301, { Location: '/thanks' });
  res.end();
});

module.exports = router;

/* TODO: 商品ごとのparamでStripeに渡せるように
const loginUser = chkAuth.LoginChk(req.cookies.token);  var items;
con.query(sql, loginUser.email, async (err, results) => {
if (err) {
  return res.render('login', { message: 'カート取得エラー：DBエラー' + '\n' + err.message });
}
items = results.map(row => {
  return {
    price_data: {
      currency: 'jpy',
      product_data: {
        name: row.itemname,
      },
      unit_amount: Math.round(row.itemprice),
    },
    quantity: 1,
  };
});
const param = {
  line_items: JSON.stringify(items),
  mode: 'payment',
  success_url: 'http://localhost:3000/',
  cancel_url: 'http://localhost:3000/cart'

};
console.log(param);
try {
  const session = await stripe.checkout.sessions.create(param);
  res.redirect(303, session.url);
} catch (e) {
  res.status(500).send(e);
}
});
*/