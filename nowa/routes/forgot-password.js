const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Install nodemailer and configure it
const pool = require('../db');

// Configure nodemailer with your SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 587,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },
});

router.get('/', (req, res) => {
  res.render('forgot-password', { activeTab: 'forgot-password' });
});

  
router.post('/', async (req, res) => {
    const { email } = req.body;
  
    const userExists = await doesEmailExist(email);
  
    if (userExists) {
      // Generate a unique reset token
        const resetToken = generateToken();
  
        const resetLink = `https://MisterySmurfs.com/reset-password/${resetToken}`;

        const mailOptions = {
          from: process.env.USER_EMAIL, // Sender's email address
          to: email, // Recipient's email address
          subject: 'MisterySmurfs - Password Reset Request',
          text: `To reset your password, click on the following link: ${resetLink}`,
        };
        // Set expiration date to 1 hour from now (adjust as needed)
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
    
        // Save the reset token and its expiration date to the database
        try {
            const userId = await getUserIdByEmail(email);
            const insertedId = await saveResetTokenToDB(userId, resetToken, expirationDate);
            
            // Send the password reset email
            transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                res.redirect('/forgot-password');
            } else {
                // Redirect to a page confirming that the reset email has been sent
                res.redirect('/forgot-password');
            }
            });
        } catch (error) {
          // Handle the database error
          console.error('Error processing reset token:', error);
          res.redirect('/forgot-password');
        }
    } else {
      // Handle the case where the provided email doesn't exist in your database
      // You can display an error message to the user on the 'forgot-password' page
      const errors = ['Email address not found. Please check your email.'];
      res.render('forgot-password', { errors, activeTab: 'forgot-password' });
    }
  });

// Function to generate a random token
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };
  
  // Function to save the reset token to the database
  const saveResetTokenToDB = async (userId, token, expirationDate) => {
    const insertQuery = 'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
    const insertValues = [userId, token, expirationDate];
  
    try {
      const [rows, fields] = await pool.execute(insertQuery, insertValues);
      return rows.insertId; // Return the ID of the inserted row (optional)
    } catch (error) {
      console.error('Error saving reset token to database:', error);
      throw error; // Handle the error as needed in your application
    }
  };

// Assuming you have a function to check if the email exists in your database
const doesEmailExist = async (email) => {
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE email = ?', [email]);
  
      // The query will return a single row with a "count" column
      const count = rows[0].count;
  
      return count > 0; // Return true if the email exists, otherwise return false
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false; // Handle the error as needed in your application
    }
  };

  const getUserIdByEmail = async (email) => {
    const query = 'SELECT id FROM users WHERE email = ?';
    const values = [email];
  
    try {
      // Execute the SQL query
      const [rows] = await pool.execute(query, values);
  
      // Check if a user with the given email exists
      if (rows.length > 0) {
        return rows[0].id; // Return the user ID
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user ID by email:', error);
      throw error; // Handle the error as needed in your application
    }
  };

module.exports = router;