const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import your database connection
const axios = require('axios'); // Import the 'axios' library
const crypto = require('crypto');
const rateLimit = require('express-rate-limit'); // Import the rate-limiting middleware

// Create a rate limiter for the "add to cart" route
const filterLimiter = rateLimit({
  windowMs: 1000, // 1 second in milliseconds
  max: 1, // Allow 1 "add to cart" request within 1 second
  message: 'You have exceeded the rate limit for adding items to the cart. Please wait and try again.',
});

// Define a route for the SmurfAccounts page
router.get('/', async (req, res) => {
  try {
    const nonce = crypto.randomBytes(16).toString('base64');
    
    // Set the CSP header for this response with the nonce
    res.setHeader('Content-Security-Policy', `script-src 'self' code.jquery.com cdn.jsdelivr.net cdnjs.cloudflare.com 'nonce-${nonce}'; style-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com; object-src 'none'; base-uri 'self'; frame-src 'self';`);

    // Render the 'SmurfAccounts' page, passing data to it
    res.render('SmurfAccounts', {
      activeTab: 'SmurfAccounts',
      nonce: nonce,
      showNegoNoMercy: true // Ustawienie wartości na true, jeśli chcesz, aby NegoNoMercy był widoczny
    });
  } catch (error) {
    // Handle any errors, e.g., by rendering an error page
    res.render('error', { errorMessage: 'An error occurred while fetching smurf accounts.' });
  }
});

// Define a route for fetching the filtered and sorted accounts (AJAX)
router.get('/filtered-accounts', filterLimiter, async (req, res) => {
  try {
    if (req.rateLimit.remaining < 0) {
      // Handle rate limit exceeded gracefully
      return res.status(429).send('Rate limit exceeded. Please wait and try again later.');
    }

    // Send back only the HTML for the accounts section as a partial response
    res.render('partials/smurfs', (err, html) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while rendering the accounts section.' });
      } else {
        res.status(200).send(html);
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching smurf accounts.' });
  }
});

// Export the router
module.exports = router;
