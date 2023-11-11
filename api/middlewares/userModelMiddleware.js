import Tenant from '../models/tenantModel.js';
import User from '../models/userModel.js';

const userModelMiddleware = async (req, res, next) => {
  const tenantId  = '645e1757d2edc61748f5e81a';
  const tenant = await Tenant.findOne({ _id: tenantId, deleteStatus: 0 });

  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found' });
  }
  req.tenant = tenant;
  req.userModel = User;
  next();
};

export default userModelMiddleware;
