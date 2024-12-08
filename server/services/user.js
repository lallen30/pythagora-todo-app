const { randomUUID } = require('crypto');

const User = require('../models/user.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw `Database error while listing users: ${err}`;
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      throw `Database error while getting the user by their ID: ${err}`;
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      throw `Database error while getting the user by their email: ${err}`;
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw `Database error while updating user ${id}: ${err}`;
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      throw `Database error while deleting user ${id}: ${err}`;
    }
  }

  static async authenticateWithPassword(email, password) {
    console.log("Authenticating user:", email);
    if (!email) throw 'Email is required';
    if (!password) throw 'Password is required';

    try {
      const user = await User.findOne({email}).exec();
      console.log("User found:", user ? "Yes" : "No");
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);
      console.log("Password valid:", passwordValid);
      if (!passwordValid) return null;

      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      console.log("User authenticated successfully:", updatedUser);
      return updatedUser;
    } catch (err) {
      console.error(`Database error while authenticating user ${email} with password:`, err);
      throw err;
    }
  }

  static async authenticateWithToken(token) {
    try {
      return User.findOne({ token }).exec();
    } catch (err) {
      throw `Database error while authenticating user with token: ${err}`;
    }
  }

  static async regenerateToken(user) {
    user.token = randomUUID(); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw `Database error while generating user token: ${err}`;
    }
  }

  static async createUser(userData) {
    console.log("Creating user with data:", userData);
    if (!userData.email) throw 'Email is required';
    if (!userData.password) throw 'Password is required';

    const existingUser = await UserService.getByEmail(userData.email);
    if (existingUser) throw 'User with this email already exists';

    const hash = await generatePasswordHash(userData.password);

    try {
      const user = new User({
        email: userData.email,
        password: hash,
        name: userData.name || '',
        token: randomUUID(),
      });

      await user.save();
      console.log("User created successfully:", user);
      return user;
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  static async setPassword(user, password) {
    if (!password) throw 'Password is required';
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw `Database error while setting user password: ${err}`;
    }
  }
}

module.exports = UserService;