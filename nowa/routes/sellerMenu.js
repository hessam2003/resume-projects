// mainpage.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit'); // Import the rate-limiting middleware
const CartLimiter = rateLimit({
    windowMs: 750, // 1 second in milliseconds
    max: 1, // Allow 1 "add to cart" request within 1 second
    message: 'You have exceeded the rate limit. Please wait and try again.',
  });
const ACCOUNTS_PER_PAGE = 10; // Adjust this based on your preference

router.get('/', async (req, res) => {
  try {
    // Check if a user is authenticated and exists in the session
    if (!req.session.user) {
      res.redirect('/login'); // Redirect to login page if not authenticated
      return;
    }

    if (!req.session.user.seller) {
      res.status(403).send('Forbidden'); // Return a forbidden status if not a seller
      return;
  }

    // Get the page number from the query parameters, default to 1 if not provided
    const currentPage = parseInt(req.query.page, 10) || 1;

    // Fetch user's completed purchases with pagination
    const { orders, totalOrders } = await getAllOrdersWithPagination(currentPage);

    orders.forEach((order) => {
      order.formattedDate = formatOrderDate(order.created_at);
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalOrders / ACCOUNTS_PER_PAGE);

    // Fetch account details for each purchased account
    const accountIds = orders.map((order) => order.id);
    const accountsDetails = await getAccountDetailsBulk(accountIds);

    const nonce = crypto.randomBytes(16).toString('base64');
    
        // Set the CSP header for this response with the nonce
    res.setHeader('Content-Security-Policy', `script-src 'self' code.jquery.com cdn.jsdelivr.net cdnjs.cloudflare.com 'nonce-${nonce}'; style-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com; object-src 'none'; base-uri 'self'; frame-src 'self';`);
    // Render the "My Purchases" page with pagination information
    res.render('sellerMenu', {
      activeTab: 'sellerMenu',
      orders: orders,
      accountsDetails: accountsDetails,
      totalPages: totalPages,
      currentPage: currentPage,
      nonce: nonce,
    });
  } catch (error) {
    // Handle any errors, e.g., by rendering an error page
    console.error('Error fetching user orders:', error);
    res.render('error', { errorMessage: 'An error occurred while fetching user orders.' });
  }
});

// POST endpoint for claiming an order
router.post('/claimOrder/:orderId', CartLimiter, async (req, res) => {
    if (req.rateLimit.remaining < 0) {
      // Handle rate limit exceeded gracefully
      return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
    }
  
    // Check if a user is authenticated and exists in the session
    if (!req.session.user) {
      res.status(401).send('Unauthorized'); // Return an unauthorized status
      return;
    }
  
    const userId = req.session.user.username; // Get the user's ID
    const orderId = req.params.orderId; // Extract the order ID from the request parameters
  
    // Check if the order is already claimed
    const checkOrderQuery = 'SELECT seller FROM orders WHERE id = ?';
    try {
      const [rows] = await pool.execute(checkOrderQuery, [orderId]);
  
      if (rows.length === 0) {
        // If the order doesn't exist, return a not found status
        return res.status(404).send('Order not found');
      }
  
      if (rows[0].seller) {
        // If the order is already claimed, return a conflict status
        return res.status(409).send('Order is already claimed');
      }
  
      // Update the order's seller field with the current user or any logic you have
      const updateOrderQuery = 'UPDATE orders SET seller = ? WHERE id = ?';
      try {
        await pool.execute(updateOrderQuery, [userId, orderId]);
        res.status(200).send('Order claimed successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Failed to claim order');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error claiming order');
    }
  });
  
  // POST endpoint for cancelling an order
  router.post('/cancelOrder/:orderId', CartLimiter, async (req, res) => {
    if (req.rateLimit.remaining < 0) {
      // Handle rate limit exceeded gracefully
      return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
    }
  
    // Check if a user is authenticated and exists in the session
    if (!req.session.user) {
      res.status(401).send('Unauthorized'); // Return an unauthorized status
      return;
    }
  
    const orderId = req.params.orderId; // Extract the order ID from the request parameters
  
    // Update the order status to cancelled or remove it from the database as per your logic
    const cancelOrderQuery = 'UPDATE orders SET seller = NULL WHERE id = ?';
    try {
      await pool.execute(cancelOrderQuery, [orderId]);
      res.status(200).send('Order cancelled successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to cancel order');
    }
  });

  router.post('/completeOrder/:orderId', CartLimiter, async (req, res) => {
    if (req.rateLimit.remaining < 0) {
      // Handle rate limit exceeded gracefully
      return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
    }
  
    // Check if a user is authenticated and exists in the session
    if (!req.session.user) {
      res.status(401).send('Unauthorized'); // Return an unauthorized status
      return;
    }
  
    const orderId = req.params.orderId; // Extract the order ID from the request parameters
  
    // Update the order status to cancelled or remove it from the database as per your logic
    const completeOrderQuery = 'UPDATE orders SET order_status = ? WHERE id = ?';

    try {
      await pool.execute(completeOrderQuery, ["Complete", orderId]);
      res.status(200).send('Order completed successfully');
    } catch (error) {
      console.error("Error completing order:", error);
      res.status(500).send('Failed to complete order');
    }
  });

  router.post('/cancelOrderCompletion/:orderId', CartLimiter, async (req, res) => {
    if (req.rateLimit.remaining < 0) {
      // Handle rate limit exceeded gracefully
      return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
    }
  
    // Check if a user is authenticated and exists in the session
    if (!req.session.user) {
      res.status(401).send('Unauthorized'); // Return an unauthorized status
      return;
    }
  
    const orderId = req.params.orderId; // Extract the order ID from the request parameters
  
    // Update the order status to cancelled or remove it from the database as per your logic
    const completeOrderQuery = 'UPDATE orders SET order_status = ? WHERE id = ?';

    try {
      await pool.execute(completeOrderQuery, ["pending", orderId]);
      res.status(200).send('Order canceled successfully');
    } catch (error) {
      console.error("Error completing order:", error);
      res.status(500).send('Failed to cancel order');
    }
  });

// Add this function to your existing code
// Function to format the order date
function formatOrderDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  return formattedDate;
}

// Function to fetch all completed purchases with pagination
async function getAllOrdersWithPagination(page) {
    try {
      // Calculate the offset to fetch the appropriate range of orders
      const offset = (page - 1) * ACCOUNTS_PER_PAGE;
  
      // Query the database to fetch a range of completed orders without a seller
      const ordersQuery = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?';
      const [ordersResponse] = await pool.query(ordersQuery, [ACCOUNTS_PER_PAGE, offset]);
  
      // Query to get the total number of completed orders without a seller
      const countQuery = 'SELECT COUNT(*) AS total FROM orders';
      const [countResponse] = await pool.execute(countQuery);
      const totalOrders = countResponse[0].total;
  
      // Return the orders data and total number of orders
      return { orders: ordersResponse, totalOrders: totalOrders };
    } catch (error) {
      throw error;
    }
  }
  
  

// Function to fetch details for a specific account
async function getAccountDetailsBulk(accountIds) {
  try {
    // If there are no accountIds, return an empty array
    if (accountIds.length === 0) {
      return [];
    }

    // Construct a SQL query to fetch details of multiple order accounts and their corresponding kingdoms
    const accountQuery = `
      SELECT oa.*, p.kingdom, p.name
      FROM order_account oa
      JOIN products p ON oa.account_id = p.id
      WHERE oa.order_id IN (?)
    `;
    // Execute the query to fetch account details along with kingdoms
    const [accountResponse] = await pool.query(accountQuery, [accountIds]);
    return accountResponse;
  } catch (error) {
    throw error;
  }
}



module.exports = router;
