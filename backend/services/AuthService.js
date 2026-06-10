const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

class AuthService {
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    return this.generateToken(user);
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async googleAuth(profile) {
    let user = await User.findOne({ where: { google_id: profile.id } });
    if (!user) {
      user = await User.findOne({ where: { email: profile.emails[0].value } });
      if (user) {
        user.google_id = profile.id;
        await user.save();
      } else {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          google_id: profile.id,
          role: 'user'
        });
      }
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, user: payload };
  }
}

module.exports = new AuthService();
