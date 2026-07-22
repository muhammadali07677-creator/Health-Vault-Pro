const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: String,
  duration: String,
  timing: [String]
}, { _id: false });

const MedicalHistorySchema = new mongoose.Schema({
  id: { type: String, required: true }, // Keep existing UUID
  diseaseId: { type: String, required: true },
  disease: String,
  diagnosis: String,
  treatment: String,
  doctorName: String,
  hospitalName: String,
  visitDate: String,
  date: { type: Date, default: Date.now },
  medicines: [MedicineSchema],
  prescribedTests: [String],
  reportName: String,
  reportDate: String,
  prescriptionAttachment: String,
  reportAttachment: String
}, { _id: false });

const TestReportSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Keep existing UUID
  fileName: String,
  filePath: String,
  uploadDate: { type: Date, default: Date.now },
  referringDoctor: String,
  diseaseCause: String
}, { _id: false });

const DiseaseNodeSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Keep existing UUID
  disease: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const PatientSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // CNIC acts as Primary Key (_id)
  name: { type: String, required: true },
  password: { type: String, required: true }, // Hashed
  age: String,
  gender: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
  diseaseNodes: [DiseaseNodeSchema],
  medicalHistory: [MedicalHistorySchema],
  testReports: [TestReportSchema]
});

module.exports = mongoose.model('Patient', PatientSchema);
