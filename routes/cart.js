const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51OjLLCCquV7OPeZpqxsUa5CcDkSHaV5B1Ec9uOGcc0EyB2AuvbFim94V5kWljF17zHP42gElTRtZoCxTjhoiegzK009FIzI7Rk');
const YOUR_DOMAIN = 'http://localhost:3000';

router.get('/', (req, res, next) => {
    res.render('cart', '');
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