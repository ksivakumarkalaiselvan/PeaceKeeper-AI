const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const userRepo = require('../repositories/userRepo');

const protect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized, token missing', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepo.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(res, 'User associated with token no longer exists', 401);
    }

    // Attach user (without password hash)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return ApiResponse.error(res, 'Invalid or expired token', 401);
  }
};

module.exports = { protect };
