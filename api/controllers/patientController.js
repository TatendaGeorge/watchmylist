import Patient from '../models/patientModel.js';

// Get all patients for a specific tenant
const getAllPatients = async (req, res) => {
  try {
    const tenantId = req.body.tenant;

    const patients = await Patient.find({ tenant: tenantId, deleteStatus: 0 });

    return res.json(patients);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new patient for a specific tenant
const createPatient = async (req, res) => {
  try {
    const tenantId = req.body.tenant;

    const newPatient = new Patient({
      name: req.body.name,
      surname: req.body.surname,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      saIdNumber: req.body.saIdNumber,
      email: req.body.email,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        province: req.body.address.province,
        postalCode: req.body.address.postalCode,
        country: req.body.address.country
      },
      phoneNumber: req.body.phoneNumber,
      tenant: tenantId, 
    });

    const patient = await newPatient.save();

    return res.json(patient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific patient by ID for a specific tenant
const getPatientById = async (req, res) => {
  try {
    const tenantId = req.body.tenant;
    const patientId = req.params.id;

    const patient = await Patient.findOne({ _id: patientId, tenant: tenantId, deleteStatus: 0 });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.json(patient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a specific patient by ID for a specific tenant
const updatePatient = async (req, res) => {
  try {
    const tenantId = req.body.tenant;
    const patientId = req.params.id;

    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: patientId, tenant: tenantId, deleteStatus: 0 },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.json(updatedPatient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a specific patient by ID
const deletePatient = async (req, res) => {
    try {
      const tenantId = req.body.tenant;
      const patientId = req.params.id;
  
      const deletedPatient = await Patient.findOneAndUpdate(
        { _id: patientId, tenant: tenantId, deleteStatus: 0 },
        { $set: { deleteStatus: 1 } },
        { new: true }
      );
  
      if (!deletedPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      return res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
export {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
  