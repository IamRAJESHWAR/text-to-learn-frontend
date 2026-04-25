const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sub: { type: String, required: true, unique: true }, // Auth0 sub
  email: { type: String, required: true },
  name: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
