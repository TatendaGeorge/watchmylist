import Tenant from '../models/tenantModel.js';

const patientModelMiddleware = async (req, res, next) => {
  try {
    const tenantId = req.user.id;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    req.body.tenant = tenantId;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default patientModelMiddleware;
