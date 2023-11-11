import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Tenant from '../models/tenantModel.js';

// Function to authenticate a tenant or user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if the provided email is for a tenant or user
    let tenant = await Tenant.findOne({ email: email, deleteStatus: 0 });
    let user = null;
    let authUser = null;

    if (!tenant) {
      user = await User.findOne({ email: email, deleteStatus: 0 });
      if (!user) {
        return res.status(404).json({ message: 'Account does not exist.' });
      }
    }

    // Check if the password is correct for the tenant or user
    if(tenant) {
      authUser =  {
        _id: tenant._id,
        email: tenant.email,
        name: tenant.name
      };
      if(tenant.password != password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
    }

    if(user) {
      authUser =  {
        _id: user._id,
        email: user.email,
        name: user.name, 
      };
      if(user.password != password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
    }

    // Generate and return the JWT token for the authenticated tenant or user
    const payload = { id: authUser._id, email: authUser.email, name: authUser.name};
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' });
    res.cookie("token", token);
    console.log(token);
    return res.status(200).json( {api_token: token} );
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

const verifyToken = (req, res) => {
  // Get the token from the request headers or cookies
  const token = req.body.api_token;

  if (!token) {
    // Token is not provided
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Token is valid, you can access the decoded user data
    const user = { 
      id: decoded.id, 
      email: decoded.email, 
      name: decoded.name
    };

    // Perform any necessary operations with the user data

    // Send a response
    res.status(200).json({ id: user.id });
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: 'Token is invalid' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { tenant } = req.body;

    const existingTenant = await Tenant.findById(tenant._id);
    const existingUser = await User.findOne({ email: email, tenant: tenant._id });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({ name, email, password, tenant: tenant._id });

    await user.save();
    tenant.users.push(user._id);
    existingTenant.users.push(user._id);
    await existingTenant.save();
    
    res.json(user); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { tenant } = req;
    const user = await User.findOne({ _id: req.params.id, tenant: tenant._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { userModel } = req;
    const { tenant } = req;
    const users = await userModel.find({ tenant: '645cd813d4afcb0eee0dc19f', deleteStatus: 0 });
    console.log(users);
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { tenant } = req;
    const user = await User.findOne({ _id: req.params.id, tenant: tenant._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { tenant } = req;
    const user = await User.updateOne({ _id: req.params.id, tenant: tenant._id }, { deleteStatus: 1 });

    if (user.nModified === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  login,
  verifyToken,
  createUser,
  getUserById,
  getUsers,
  updateUserById,
  deleteUserById
}