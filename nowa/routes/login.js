const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const { check, validationResult } = require('express-validator');

// Login page
router.get('/', (req, res) => {
  // Check if a user is already logged in
  if (req.session.user) {
    return res.redirect('/'); // Redirect to the Home page if a user is logged in
  }

  res.render('login', { activeTab: 'login' });
});

// Rest of your login route remains the same


// Login form submission
router.post(
  '/',
  [
    check('username')
      .not()
      .isEmpty()
      .withMessage('Username is required'),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.render('login', { errors: errorMessages, activeTab: 'login' });
    } else {
      const { username, password } = req.body;

      try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
          res.render('login', { errors: ['Username or password is incorrect'], activeTab: 'login' });
          return;
        }

        const user = rows[0];

        bcrypt.compare(password, user.password, (bcryptErr, match) => {
          if (match) {
            // Log in the user securely
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password; // Remove the password from the user object
            req.session.user = userWithoutPassword;
            return res.redirect('/');
          } else {
            res.render('login', { errors: ['Username or password is incorrect'], activeTab: 'login' });
          }
        });
      } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
      }
    }
  }
);

module.exports = router;
