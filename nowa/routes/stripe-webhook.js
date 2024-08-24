const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();
const endpointSecret = (process.env.WEBHOOK_SECRET_KEY);
const pool = require('../db');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 587,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

router.post('/stripe-webhook', bodyParser.raw({type: 'application/json'}), async (request, res) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object; 
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const itemIdsAsString = checkoutSessionCompleted.metadata.accountIds;
      const accountAmountsAsString = checkoutSessionCompleted.metadata.accountAmounts;
      const username = checkoutSessionCompleted.metadata.username;
      const discord = checkoutSessionCompleted.metadata.discord;
      const coords = checkoutSessionCompleted.metadata.coords;
      const totalPrice = checkoutSessionCompleted.amount_total;
      const userId = checkoutSessionCompleted.client_reference_id;
      const email = checkoutSessionCompleted.customer_details.email;
      if (!userId) {
        res.status(400).json({ message: 'User ID is missing in the session or payment data' });
        return;
      }
      
      if (itemIdsAsString) {
        try {
          await handleCompletedPayment(itemIdsAsString, accountAmountsAsString, userId, totalPrice, email, username, discord, coords, res);
        } catch (error) {
          console.error('Error handling successful payment:', error);
          res.status(500).json({ error: 'An error occurred while processing the order' });
        }
      } else {
        res.status(200).json({ message: 'No line items in the payment event' });
      }
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      break;
    // ... handle other event types
    default:
  }
  
  res.status(200).end();
  });
  
  const handleCompletedPayment = async (itemIdsAsString, accountAmountsAsString, userId, totalPrice, email, username, discord, coords, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const itemIdsArray = itemIdsAsString.split(',').map(itemId => parseInt(itemId, 10));
        const accountAmounts = JSON.parse(accountAmountsAsString);

        const price = totalPrice / 100;
        // Insert order into the order table
        const insertOrderQuery = 'INSERT INTO orders (user_id, order_status, username, discord, coords, price) VALUES (?, ?, ?, ?, ?, ?)';
        const [orderResult] = await connection.execute(insertOrderQuery, [userId, "pending", username, discord, coords, price]);
        const orderId = orderResult.insertId;

        for (const itemId of itemIdsArray) {
            const amount = accountAmounts[itemId];

            // Insert order account details into the order_account table
            const insertOrderAccountQuery = 'INSERT INTO order_account (order_id, account_id, amount) VALUES (?, ?, ?)';
            await connection.execute(insertOrderAccountQuery, [orderId, itemId, amount]);
        }

        // Clear user's cart
        const clearCartQuery = 'DELETE FROM cart WHERE user_id = ?';
        await connection.execute(clearCartQuery, [userId]);

        await connection.commit();
        connection.release();

        res.status(200).json({ message: 'Order submitted successfully' });
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};


  
  


module.exports = router;