// Mock Mailer Service
const logger = require('../utils/logger');

const sendEmail = async ({ to, subject, html, text }) => {
  logger.info(`[MOCK EMAIL SENT] To: ${to} | Subject: ${subject}`);
  return { success: true, messageId: `mock-msg-${Date.now()}` };
};

module.exports = { sendEmail };
