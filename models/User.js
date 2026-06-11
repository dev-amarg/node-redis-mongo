const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
