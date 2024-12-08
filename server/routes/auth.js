const express = require('express');
const UserService = require('../services/user.js');
const { requireUser } = require('./middleware/auth.js');
const logger = require('../utils/log.js');

const router = express.Router();
const log = logger('api/routes/authRoutes');

router.post('/login', async (req, res) => {
  console.log("Received login request:", req.body);
  const sendError = msg => res.status(400).json({ error: msg });
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError('Email and password are required');
  }

  try {
    const user = await UserService.authenticateWithPassword(email, password);
    console.log("Authentication result:", user ? "Success" : "Failed");

    if (user) {
      console.log("User authenticated:", user);
      return res.json({ token: user.token });
    } else {
      console.log("Authentication failed for email:", email);
      return sendError('Email or password is incorrect');
    }
  } catch (error) {
    console.error("Login error:", error);
    return sendError('An error occurred during login');
  }
});

router.post('/register', async (req, res) => {
  console.log("Received registration request:", req.body);
  try {
    const { email, password } = req.body;
    const user = await UserService.createUser({ email, password });
    console.log("User registered successfully:", user);
    return res.status(201).json({ message: 'User registered successfully', user: user });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(400).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

router.all('/api/auth/logout', async (req, res) => {
  if (req.user) {
    await UserService.regenerateToken(req.user);
  }
  return res.status(204).send();
});

router.get('/me', requireUser, async (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = router;