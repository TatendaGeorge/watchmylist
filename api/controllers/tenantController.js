import Tenant from '../models/tenantModel.js';

const createTenant = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingTenant = await Tenant.findOne({ email: email });

    if (existingTenant) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const tenant = new Tenant({ name, email, password });
    await tenant.save();
  res.json(tenant);
  } catch (error) {
    console.log(error);
  }
  
};

const getTenants = async (req, res) => {
  const tenants = await Tenant.find();
  res.json(tenants);
};

export { 
  createTenant, 
  getTenants 
};
