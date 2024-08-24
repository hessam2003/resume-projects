const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const pool = require('../db');

// Route to render the reset-password page
router.get('/:resetToken', async (req, res) => {
  const resetToken = req.params.resetToken;
  // Validate the reset token
  const isValidToken = await validateResetToken(resetToken);

  if (isValidToken) {
    // Render the reset-password page with the resetToken
    res.render('reset-password', { resetToken, activeTab: 'reset-password' });
  } else {
    // Handle invalid token (e.g., expired or not found)
  }
});

// Route to handle the reset-password form submission
router.post(
  '/',
  [
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6, max: 30 })
      .withMessage('Password must be between 6 and 30 characters long'),
  ],
  async (req, res) => {
    const { resetToken, password } = req.body;
    // Validate the reset token
    const isValidToken = await validateResetToken(resetToken);

    // Validate the password using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Handle validation errors (e.g., redirect to the reset-password page with error messages)
      return res.render('reset-password', { resetToken, activeTab: 'reset-password'});
    }

    if (isValidToken) {
      // Reset the user's password in the database
      try {
        const userId = await getUserIdByResetToken(resetToken);
        await updatePassword(userId, password);

        // Redirect to a page confirming the password reset
        res.redirect('/login');
      } catch (error) {
        // Handle the database error
        console.error('Error updating user password:', error);
      }
    } else {
      // Handle invalid token (e.g., expired or not found)
    }
  }
);

const getUserIdByResetToken = async (resetToken) => {
  const query = 'SELECT user_id FROM password_reset_tokens WHERE token = ?';
  const values = [resetToken];

  try {
    const [rows] = await pool.execute(query, values);

    // Check if a valid token exists
    if (rows.length > 0) {
      return rows[0].user_id;
    } else {
      throw new Error('Invalid reset token');
    }
  } catch (error) {
    console.error('Error getting user ID by reset token:', error);
    throw error; // Handle the error as needed in your application
  }
};

// Function to update user password
const updatePassword = async (userId, password) => {
  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
  const updateValues = [hashedPassword, userId];

  try {
    await pool.execute(updateQuery, updateValues);
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error; // Handle the error as needed in your application
  }
};

const validateResetToken = async (resetToken) => {
  const query = 'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()';
  const values = [resetToken];

  try {
    const [rows] = await pool.execute(query, values);

    // Check if a valid token exists
    return rows.length > 0;
  } catch (error) {
    console.error('Error validating reset token:', error);
    return false; // Handle the error as needed in your application
  }
};

module.exports = router;