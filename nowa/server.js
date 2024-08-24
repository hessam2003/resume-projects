const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'db.env'});
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet'); // Adds security headers
const session = require('express-session');
const stripeWebhook = require('./routes/stripe-webhook');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const userMiddleware = require('./middleware/userMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Set view engine and views path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('trust proxy', 1);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(stripeWebhook);

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: sessionMiddleware, // Use the MySQL session store
  cookie: {
    maxAge: 345600000, // 1 day in milliseconds
  },
}));

app.use(userMiddleware); // User middleware
app.use(helmet()); // Enhance security with Helmet middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: [
        "'self'",
        "code.jquery.com",
        "cdn.jsdelivr.net",
        "cdnjs.cloudflare.com",
        "unpkg.com"
      ],
      styleSrc: [
        "'self'",
        "cdn.jsdelivr.net",
        "cdnjs.cloudflare.com",
        "fonts.googleapis.com",
        "unpkg.com",
        "fonts.gstatic.com",
        "https://fonts.googleapis.com",
        "https://unpkg.com"
      ],
      fontSrc: ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"]
    }
  })
);

app.use(express.static(path.join(__dirname, 'public')));


const homeRoute = require('./routes/Home');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const forgotRoute = require('./routes/forgot-password');
const resetRoute = require('./routes/reset-password');
const logoutRoute = require('./routes/logout');
const faqRoute = require('./routes/FAQ');
const reviewsRoute = require('./routes/reviews');
const smurfAccountsRoute = require('./routes/Resources');
const Resources3399 = require('./routes/Resources3399');
const cartRoute = require('./routes/Cart');
const myPurchases = require('./routes/myPurchases');
const sellerMenu = require('./routes/sellerMenu');

app.use('/', homeRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/forgot-password', forgotRoute);
app.use('/reset-password', resetRoute);
app.use('/logout', logoutRoute);
app.use('/FAQ', faqRoute);
app.use('/Resources', smurfAccountsRoute);
app.use('/Resources3399', Resources3399);
app.use('/Cart', cartRoute);
app.use('/myPurchases', myPurchases);
app.use('/reviews', reviewsRoute);
app.use('/sellerMenu', sellerMenu);
app.use('/Cart', cartRoute);
// Error handling middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


