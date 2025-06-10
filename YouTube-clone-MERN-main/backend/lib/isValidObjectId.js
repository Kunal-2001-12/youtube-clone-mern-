// Utility to check for valid MongoDB ObjectId
const mongoose = require('mongoose');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = isValidObjectId;
