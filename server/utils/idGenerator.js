const { v4: uuidv4 } = require('uuid');

const generateId = (prefix = 'id') => {
  return `${prefix}_${uuidv4().substring(0, 8)}`;
};

module.exports = { generateId };
