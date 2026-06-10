const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async googleCallback(req, res) {
    try {
      const result = await AuthService.googleAuth(req.user);
      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL}/auth-callback?token=${result.token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=${error.message}`);
    }
  }

  async getCurrentUser(req, res) {
    res.json(req.user);
  }
}

module.exports = new AuthController();
