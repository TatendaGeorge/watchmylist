import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  saIdNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    street: { type: String },
    suburb: { type: String },
    city: { type: String },
    province: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  medicalHistory: {
    allergies: [{ type: String }],
    conditions: [{ type: String }],
    medications: [{ type: String }],
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  deleteStatus: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
