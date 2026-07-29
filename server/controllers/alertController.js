const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const alertRepo = require('../repositories/alertRepo');
const activityRepo = require('../repositories/activityRepo');
const { sendEmail } = require('../config/mailer');

const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await alertRepo.find();
  return ApiResponse.success(res, 'Alerts list', { alerts });
});

const createAlert = asyncHandler(async (req, res) => {
  const { level, title, message, relatedReport, region } = req.body;

  if (!title || !message) {
    return ApiResponse.error(res, 'Title and message are required', 400);
  }

  const newAlert = await alertRepo.create({
    level: level || 'Medium',
    title,
    message,
    relatedReport: relatedReport || '',
    region: region || 'Global',
    emailSent: level === 'Critical' || level === 'High',
    acknowledged: false
  });

  if (newAlert.emailSent) {
    await sendEmail({
      to: 'command-desk@peacekeeper.ai',
      subject: `[${newAlert.level.toUpperCase()} ALERT] ${title}`,
      text: message
    });
  }

  await activityRepo.logActivity(req.user.id, 'CREATE_ALERT', 'ALERT', newAlert.id, `Triggered ${newAlert.level} alert: ${title}`);

  return ApiResponse.success(res, 'Alert created', { alert: newAlert }, 201);
});

const acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await alertRepo.findById(req.params.id);
  if (!alert) {
    return ApiResponse.error(res, 'Alert not found', 404);
  }

  const updated = await alertRepo.updateById(req.params.id, { acknowledged: true });
  await activityRepo.logActivity(req.user.id, 'ACK_ALERT', 'ALERT', updated.id, `Acknowledged alert ${updated.id}`);

  return ApiResponse.success(res, 'Alert acknowledged', { alert: updated });
});

const deleteAlert = asyncHandler(async (req, res) => {
  const deleted = await alertRepo.deleteById(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 'Alert not found', 404);
  }

  await activityRepo.logActivity(req.user.id, 'DELETE_ALERT', 'ALERT', req.params.id, `Deleted alert ${req.params.id}`);

  return ApiResponse.success(res, 'Alert deleted');
});

module.exports = { getAlerts, createAlert, acknowledgeAlert, deleteAlert };
