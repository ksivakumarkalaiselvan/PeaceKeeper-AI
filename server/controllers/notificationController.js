const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const notificationRepo = require('../repositories/notificationRepo');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationRepo.find(n => n.userId === req.user.id || n.userId === 'all');
  return ApiResponse.success(res, 'User notifications list', { notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const updated = await notificationRepo.markAsRead(req.params.id);
  if (!updated) {
    return ApiResponse.error(res, 'Notification not found', 404);
  }
  return ApiResponse.success(res, 'Notification marked as read', { notification: updated });
});

const markAllRead = asyncHandler(async (req, res) => {
  await notificationRepo.markAllAsReadForUser(req.user.id);
  return ApiResponse.success(res, 'All notifications marked as read');
});

module.exports = { getNotifications, markRead, markAllRead };
