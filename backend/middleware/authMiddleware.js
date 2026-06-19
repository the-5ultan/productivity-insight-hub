const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(`[Auth Middleware] Incoming Request URL: ${req.originalUrl || req.url}`);
    console.log(`[Auth Middleware] Authorization Header: ${authHeader ? (authHeader.startsWith('Bearer ') ? 'Bearer ' + authHeader.split(' ')[1].substring(0, 15) + '...' : authHeader) : 'Missing'}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`[Auth Middleware] Rejected: Authentication required (Header missing or not Bearer)`);
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
      console.log(`[Auth Middleware] JWT Verified successfully for User ID: ${decoded.id}`);
    } catch (jwtErr) {
      console.log(`[Auth Middleware] Rejected: JWT Verification failed - ${jwtErr.message}`);
      return res.status(401).json({ success: false, message: `Invalid or expired token: ${jwtErr.message}` });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log(`[Auth Middleware] Rejected: User ID ${decoded.id} not found in database`);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.accountStatus === 'suspended') {
      console.log(`[Auth Middleware] Rejected: User ID ${decoded.id} is suspended`);
      return res.status(401).json({ success: false, message: 'Invalid or suspended account' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`[Auth Middleware] Unexpected Error:`, error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
