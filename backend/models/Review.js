const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Keep existing UUID
  doctorName: { type: String, required: true },
  speciality: String,
  hospital: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  remarks: { type: String, required: true },
  patientName: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
