const express = require('express');
const path = require('path');
const router = express.Router();

// Route for the home page
router.get('/', (req, res) => {
  res.render('home', { message: 'Hello, World!' });
});

// Route for the SideDrawer page
router.get('/sideDrawer', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/sideDrawer/SideDrawer.html'));
});

// Route for the Home page (when clicked from SideDrawer)
router.get('/home', (req, res) => {
  res.render('home', { message: 'Welcome to the Home page!' });
});

module.exports = router;
