const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const userRepo = require('../repositories/userRepo');
const activityRepo = require('../repositories/activityRepo');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Please provide name, email, and password', 400);
  }

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    return ApiResponse.error(res, 'Email already registered', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await userRepo.create({
    name,
    email,
    passwordHash,
    role: role === 'Admin' ? 'Admin' : 'Observer',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00F0FF&color=0B132B`,
    notificationPrefs: JSON.stringify({ emailAlerts: true, pushAlerts: false })
  });

  await activityRepo.logActivity(newUser.id, 'USER_REGISTER', 'USER', newUser.id, `User registered as ${newUser.role}`);

  const token = generateToken(newUser.id);
  const { passwordHash: _, ...safeUser } = newUser;

  return ApiResponse.success(res, 'Registration successful', { user: safeUser, token }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 'Please provide email and password', 400);
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  await activityRepo.logActivity(user.id, 'USER_LOGIN', 'USER', user.id, `User logged in`);

  const token = generateToken(user.id);
  const { passwordHash: _, ...safeUser } = user;

  return ApiResponse.success(res, 'Login successful', { user: safeUser, token });
});

const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'Current user profile', { user: req.user });
});

module.exports = { register, login, getMe };
