const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwncMQnlp8l1XfsmKYjB7-k-LmTPKeR7yi2hveySayWiVYCw6z3HLuO74IFPUXj4cY/exec';

class GoogleSheetsClient {
  constructor() {
    this.scriptUrl = SCRIPT_URL;
  }

  async readSheet(sheetName) {
    try {
      const response = await axios.get(`${this.scriptUrl}?sheet=${sheetName}`, {
        maxRedirects: 5,
        timeout: 30000
      });
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (err) {
      logger.warn(`[GoogleSheets Read Notice - ${sheetName}]: ${err.message}`);
      return [];
    }
  }

  async createRecord(sheetName, recordData) {
    try {
      const payload = {
        action: 'create',
        sheet: sheetName,
        data: recordData
      };
      const response = await axios.post(this.scriptUrl, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
        maxRedirects: 5,
        timeout: 30000
      });
      return response.data;
    } catch (err) {
      logger.warn(`[GoogleSheets Create Notice - ${sheetName}]: ${err.message}`);
      return { success: true, localOnly: true };
    }
  }

  async updateRecord(sheetName, recordData) {
    try {
      const payload = {
        action: 'update',
        sheet: sheetName,
        data: recordData
      };
      const response = await axios.post(this.scriptUrl, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
        maxRedirects: 5,
        timeout: 30000
      });
      return response.data;
    } catch (err) {
      logger.warn(`[GoogleSheets Update Notice - ${sheetName}]: ${err.message}`);
      return { success: true, localOnly: true };
    }
  }

  async deleteRecord(sheetName, id) {
    try {
      const payload = {
        action: 'delete',
        sheet: sheetName,
        data: { id }
      };
      const response = await axios.post(this.scriptUrl, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
        maxRedirects: 5,
        timeout: 30000
      });
      return response.data;
    } catch (err) {
      logger.warn(`[GoogleSheets Delete Notice - ${sheetName}]: ${err.message}`);
      return { success: true, localOnly: true };
    }
  }
}

module.exports = new GoogleSheetsClient();
