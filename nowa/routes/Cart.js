const express = require('express');
const router = express.Router();
const pool = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit'); // Import the rate-limiting middleware

// Create a rate limiter for the "add to cart" route
const CartLimiter = rateLimit({
  windowMs: 750, // 1 second in milliseconds
  max: 1, // Allow 1 "add to cart" request within 1 second
  message: 'You have exceeded the rate limit. Please wait and try again.',
});

// Modify your route to use the function
router.get('/', async (req, res) => {
    try {
        // Check if a user is authenticated and exists in the session
        if (!req.session.user) {
            res.redirect('/login'); // Redirect to login page if not authenticated
            return;
        }

        const nonce = crypto.randomBytes(16).toString('base64');
    
        // Set the CSP header for this response with the nonce
        res.setHeader('Content-Security-Policy', `script-src 'self' code.jquery.com cdn.jsdelivr.net cdnjs.cloudflare.com 'nonce-${nonce}'; style-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com; object-src 'none'; base-uri 'self'; frame-src 'self';`);

        res.render('Cart', {
            activeTab: 'Cart',
            nonce: nonce,
        });
    } catch (error) {
        // Handle any errors, e.g., by rendering an error page
        res.render('error', { errorMessage: 'An error occurred while fetching cart items.' });
    }
});

router.get('/get-cart', async (req, res) => {
    try {
      // Check if a user is authenticated and exists in the session
      if (!req.session.user) {
          res.status(401).send('Unauthorized'); // Return an unauthorized status
          return;
      }

      // Fetch account details for items in the cart
      const userId = req.session.user.id;
      const cartItemIds = await getCartItemIdsForUser(userId); // Replace with your function to get cart item IDs
      const accountsInCart = await getAccountsInCart(cartItemIds, userId);
      const cartItems = accountsInCart.accountsInCart;
      const totalPrice = accountsInCart.totalPrice;
      const totalAmount = accountsInCart.totalAmount;

      // Send back only the HTML for the accounts section as a partial response
      res.render('partials/cartItems', { cartItems, totalPrice, totalAmount }, (err, html) => {
        if (err) {
          res.status(500).json({ error: 'An error occurred while rendering the cart items.' });
        } else {
          res.status(200).send(html);
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching cart items.' });
    }
});


// Add an item to the cart
router.post('/add-to-cart', CartLimiter, async (req, res) => {

  if (req.rateLimit.remaining < 0) {
    // Handle rate limit exceeded gracefully
    return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
  }
  // Check if a user is authenticated and exists in the session
  if (!req.session.user) {
    res.status(401).send('Unauthorized'); // Return an unauthorized status
    return;
  }

  const userId = req.session.user.id; // Get the user's ID
  const accountId = req.body.itemId; // Extract the account ID from the request body

  // Check if the account is already in the cart
  const checkCartItemQuery = 'SELECT * FROM cart WHERE user_id = ? AND account_id = ?';
  try {
    const [existingRows, existingFields] = await pool.execute(checkCartItemQuery, [userId, accountId]);

    if (existingRows.length > 0) {
      // If the account already exists in the cart, increment the amount by 100
      const updateCartQuery = 'UPDATE cart SET amount = amount + 100 WHERE user_id = ? AND account_id = ?';
      try {
        await pool.execute(updateCartQuery, [userId, accountId]);
        res.status(200).send('Amount updated in the cart');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating amount in the cart');
      }
    } else {
      // If the account is not in the cart, add it with the initial amount of 100
      const addToCartQuery = 'INSERT INTO cart (user_id, account_id, amount) VALUES (?, ?, 100)';
      try {
        await pool.execute(addToCartQuery, [userId, accountId]);
        res.status(200).send('Account added to the cart');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error adding account to the cart');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking for existing items in the cart');
  }
});

router.post('/add-to-cart100', CartLimiter, async (req, res) => {
  try {
      // Check if rate limit exceeded
      if (req.rateLimit.remaining < 0) {
          return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
      }

      // Check if user is authenticated
      if (!req.session.user) {
          return res.status(401).send('Unauthorized');
      }

      const userId = req.session.user.id;
      const itemId = req.body.itemId;

      // Validate itemId
      if (!itemId) {
          return res.status(400).send('Item ID is required.');
      }

      // Update the amount in the 'cart' table by adding 100
      const updateAmountQuery = 'UPDATE cart SET amount = amount + 100 WHERE user_id = ? AND account_id = ?';
      await pool.execute(updateAmountQuery, [userId, itemId]);

      // Send success response
      res.status(200).send('Amount increased in the cart.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// Remove an item from the cart
router.delete('/remove-from-cart', CartLimiter, async (req, res) => {

  if (req.rateLimit.remaining < 0) {
      // Handle rate limit exceeded gracefully
      return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
  }
  // Check if a user is authenticated and exists in the session
  if (!req.session.user) {
      res.status(401).send('Unauthorized'); // Return an unauthorized status
      return;
  }

  const userId = req.session.user.id; // Get the user's ID
  const itemId = req.body.itemId;

  // Check if the item is in the cart before attempting removal
  const checkCartItemQuery = 'SELECT * FROM cart WHERE user_id = ? AND account_id = ?';
  try {
      const [existingRows, existingFields] = await pool.execute(checkCartItemQuery, [userId, itemId]);

      if (existingRows.length === 0) {
          res.status(404).send('Item not found in the cart'); // Return a not found status
          return;
      }

      // Remove the item from the 'cart' table
      const removeFromCartQuery = 'DELETE FROM cart WHERE user_id = ? AND account_id = ? LIMIT 1'; // Add LIMIT 1 here
      try {
          const [result, fields] = await pool.execute(removeFromCartQuery, [userId, itemId]);

          res.status(200).send('Item removed from the cart');
      } catch (error) {
          console.error(error);
          // Handle errors
          res.status(500).send('Error removing item from the cart');
      }
  } catch (error) {
      console.error(error);
      // Handle errors
      res.status(500).send('Error checking for existing items in the cart');
  }
});

router.delete('/remove-from-cart100', CartLimiter, async (req, res) => {
  try {
      // Check if rate limit exceeded
      if (req.rateLimit.remaining < 0) {
          return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
      }

      // Check if user is authenticated
      if (!req.session.user) {
          return res.status(401).send('Unauthorized');
      }

      const userId = req.session.user.id;
      const itemId = req.body.itemId;

      // Validate itemId
      if (!itemId) {
          return res.status(400).send('Item ID is required.');
      }

      // Check if the item is in the cart
      const checkCartItemQuery = 'SELECT amount FROM cart WHERE user_id = ? AND account_id = ?';
      const [existingRows] = await pool.execute(checkCartItemQuery, [userId, itemId]);

      if (existingRows.length === 0) {
          return res.status(404).send('Item not found in the cart.');
      }

      const currentAmount = existingRows[0].amount;

      // Check if decrementing by 100 will result in amount going below 100
      if (currentAmount <= 100) {
          return res.status(400).send('Amount cannot go below 100.');
      }

      // Update the amount in the 'cart' table by decreasing 100
      const updateAmountQuery = 'UPDATE cart SET amount = GREATEST(amount - 100, 100) WHERE user_id = ? AND account_id = ?';
      await pool.execute(updateAmountQuery, [userId, itemId]);

      // Send success response
      res.status(200).send('Amount decreased in the cart.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


  
router.post('/submit-order', CartLimiter, async (req, res) => {
  if (req.rateLimit.remaining < 0) {
    return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
  }

  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.session.user.id;
    const username = req.body.username; 
    const discord = req.body.discord;
    const coords = req.body.coords;

    // Retrieve the items from the user's cart
    const getCartItemsQuery = 'SELECT account_id FROM cart WHERE user_id = ?';
    const [cartItemsRows, cartItemsFields] = await pool.execute(getCartItemsQuery, [userId]);

    if (cartItemsRows.length === 0) {
      return res.status(400).json({ error: 'No items in the cart to submit an order' });
    }

    const itemIds = cartItemsRows.map((item) => item.account_id);

    // Get a database connection
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const lineItems = [];
      const accountAmounts = {}; // Object to store account IDs and their corresponding amounts
  
      for (const itemId of itemIds) {
        const totalItemsPriceQuery = `
            SELECT p.price, c.amount
            FROM products p
            JOIN cart c ON p.id = c.account_id
            WHERE p.id = ? AND c.user_id = ?
        `;
        const [totalPriceRows, totalPriceFields] = await pool.execute(totalItemsPriceQuery, [itemId, userId]);
        
        totalPriceRows.forEach((row) => {
            const price = parseFloat(row.price);
            const amount = parseInt(row.amount) / 100;
            
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Your Product Name', // You can customize this
                        metadata: { itemId },
                    },
                    unit_amount: price * 100, // Convert price to cents
                },
                quantity: amount,
            });
    
            // Store the amount for each account ID
            accountAmounts[itemId] = amount;
        });
    }
    
  
      const itemIdsAsString = itemIds.join(',');
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      const expirationTime = currentTimestamp + 1800; // 30 minutes in the future
      
      const session = await stripe.checkout.sessions.create({
        client_reference_id: userId,
        payment_method_types: ['card', 'paypal', 'ideal', 'bancontact', 'eps', 'giropay', 'klarna', 'p24'],
        line_items: lineItems,
        metadata: {
          accountIds: itemIdsAsString,
          accountAmounts: JSON.stringify(accountAmounts),
          username: username,
          discord: discord,
          coords: coords,
        },
        mode: 'payment',
        success_url: `https://rssempire.com/myPurchases`,
        cancel_url: `https://rssempire.com/Cart`,
        expires_at: expirationTime,
      });

      // Commit the transaction and release the connection
      await connection.commit();
      connection.release();

      res.redirect(303, session.url);
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Error in submit-order route:', error);
      return res.status(500).json({ error: 'An error occurred while processing the order' });
    }
  } catch (error) {
    console.error('Error in submit-order route:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});


// Define a function to fetch cart items
async function getCartItemIdsForUser(userId) {
  try {
      // Query the database to fetch the cart item IDs for the user
      const cartItemIdsQuery = 'SELECT account_id FROM cart WHERE user_id = ?';
      const [cartItemIdsResponse] = await pool.execute(cartItemIdsQuery, [userId]);

      // Extract the account IDs from the response
      const cartItemIds = cartItemIdsResponse.map(item => item.account_id);
      return cartItemIds;
  } catch (error) {
      throw error;
  }
}

async function getAccountsInCart(accountIds, userId) {
  try {
      if (!Array.isArray(accountIds) || accountIds.length === 0) {
          return {
              accountsInCart: [],
              totalPrice: 0, // Initialize total price to 0
              totalAmount: 0, // Initialize total amount to 0
          };
      }

      const placeholders = accountIds.map(() => '?').join(',');
      const unionQueries = accountIds.map(() => `
          SELECT p.id, p.price, p.kingdom, c.amount
          FROM products p
          JOIN cart c ON p.id = c.account_id
          WHERE p.id = ? AND c.user_id = ?
      `).join(' UNION ALL ');

      const cartQuery = `
          ${unionQueries}
      `;

      const params = accountIds.reduce((acc, id) => {
          acc.push(id, userId);
          return acc;
      }, []);

      const [accountsResponse] = await pool.query(cartQuery, params);
      const accountsInCart = accountsResponse;

      let totalPrice = 0;
      let totalAmount = 0;

      // Iterate through the accounts and process price and amount data
      for (const account of accountsInCart) {
          const accountPrice = parseFloat(account.price);
          const accountAmount = parseInt(account.amount);
          const accountTotalPrice = accountPrice * (accountAmount / 100);
          totalPrice += accountTotalPrice;
          totalAmount += accountAmount;
          account.totalPrice = accountTotalPrice; // Add total price of account to the account object
      }

      return {
          accountsInCart,
          totalPrice: totalPrice, // Include the total price in the return object
          totalAmount: totalAmount, // Include the total amount in the return object
      };
  } catch (error) {
      throw error;
  }
}









module.exports = router;
