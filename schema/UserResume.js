const mongoose = require('mongoose');

const userApplication = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  resume: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  coverLetter: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('resume', userApplication);
