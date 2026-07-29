const ApiResponse = require('../utils/apiResponse');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, `Forbidden: ${req.user?.role || 'User'} role is not permitted to perform this operation.`, 439 || 403);
    }
    next();
  };
};

module.exports = { restrictTo };
