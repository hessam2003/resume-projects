// mainpage.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios');

const ACCOUNTS_PER_PAGE = 10; // Adjust this based on your preference

router.get('/', async (req, res) => {
  try {
    // Check if a user is authenticated and exists in the session
    if (!req.session.user) {
      res.redirect('/login'); // Redirect to login page if not authenticated
      return;
    }

    // Get the page number from the query parameters, default to 1 if not provided
    const currentPage = parseInt(req.query.page, 10) || 1;

    // Fetch user's completed purchases with pagination
    const userId = req.session.user.id;
    const { orders, totalOrders } = await getUserOrdersWithPagination(userId, currentPage);

    orders.forEach((order) => {
      order.formattedDate = formatOrderDate(order.created_at);
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalOrders / ACCOUNTS_PER_PAGE);

    // Fetch account details for each purchased account
    const accountIds = orders.map((order) => order.id);
    const accountsDetails = await getAccountDetailsBulk(accountIds);

    // Render the "My Purchases" page with pagination information
    res.render('myPurchases', {
      activeTab: 'myPurchases',
      orders: orders,
      accountsDetails: accountsDetails,
      totalPages: totalPages,
      currentPage: currentPage,
    });
  } catch (error) {
    // Handle any errors, e.g., by rendering an error page
    console.error('Error fetching user orders:', error);
    res.render('error', { errorMessage: 'An error occurred while fetching user orders.' });
  }
});

// Add this function to your existing code
// Function to format the order date
function formatOrderDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  return formattedDate;
}

// Function to fetch user's completed purchases with pagination
async function getUserOrdersWithPagination(userId, page) {
  try {
    // Calculate the offset to fetch the appropriate range of orders
    const offset = (page - 1) * ACCOUNTS_PER_PAGE;

    // Query the database to fetch a range of user's completed orders
    const ordersQuery = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const [ordersResponse] = await pool.query(ordersQuery, [userId, ACCOUNTS_PER_PAGE, offset]);

    // Query to get the total number of user's completed orders
    const countQuery = 'SELECT COUNT(*) AS total FROM orders WHERE user_id = ?';
    const [countResponse] = await pool.execute(countQuery, [userId]);
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

    // Construct a SQL query to fetch details of multiple order accounts
    const accountQuery = 'SELECT * FROM `order_account` WHERE order_id IN (?)';
    // Execute the query to fetch account details
    const [accountResponse] = await pool.query(accountQuery, [accountIds]);
    return accountResponse;
  } catch (error) {
    throw error;
  }
}


module.exports = router;
