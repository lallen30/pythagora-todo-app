// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const todoRoutes = require('./routes/todos');
const { authenticateWithToken } = require('./routes/middleware/auth');
const cors = require("cors");

// Check for DATABASE_URL in the .env file
if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL not set in .env file");
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error("Error: SESSION_SECRET variable in .env missing.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Authentication routes
app.use(authenticateWithToken);
app.use(authRoutes);

const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('MongoDB is connected');
    })
    .catch(err => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
      console.error(`Connection string used: ${process.env.DATABASE_URL}`);
      console.error(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Todo Routes
app.use('/api/todos', todoRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});