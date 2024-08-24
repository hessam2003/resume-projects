const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../db');

// Function to check if user has any orders placed
async function checkIfUserHasOrders(userId) {
  try {
    // Query to check if the user has any orders
    const [rows] = await pool.execute('SELECT COUNT(*) AS orderCount FROM orders WHERE user_id = ?', [userId]);

    // Extracting the order count for the user
    const orderCount = rows[0].orderCount || 0;

    return orderCount > 0;
  } catch (error) {
    console.error('Error checking user orders:', error);
    throw error;
  }
}


// Function to get reviews for a user
async function getUserReviews() {
  try {
    const [rows] = await pool.execute(`
      SELECT reviews.*, users.username 
      FROM reviews 
      INNER JOIN users ON reviews.user_id = users.id
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}


router.get('/', async (req, res) => {
  try {
    // Check if user is logged in
    const isLoggedIn = req.session.user.id;
    var hasOrders = false;
    if (isLoggedIn)
      hasOrders = await checkIfUserHasOrders(isLoggedIn);

    // Get reviews for all users
    const userReviews = await getUserReviews();

    // Render the 'reviews' page with the retrieved data and login status
    res.render('reviews', { activeTab: 'reviews', reviews: userReviews, isLoggedIn: isLoggedIn, canAddReview: hasOrders });
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/add', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      // If user is not logged in, send a 401 Unauthorized response
      return res.status(401).send('Unauthorized');
    }

    const reviewContent = req.body.reviewContent;
    const rating = req.body.rating;
    const userId = req.session.user.id;

    // Check if user has any orders placed
    const hasOrders = await checkIfUserHasOrders(userId);
    
    if (hasOrders) {
      await pool.execute('INSERT INTO reviews (user_id, content, stars) VALUES (?, ?, ?)', [userId, reviewContent, rating]);
      res.status(201).send('Review added successfully');
    } else {
      res.status(403).send('User has not placed any orders yet');
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;