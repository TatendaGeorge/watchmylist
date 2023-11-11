import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  // console.log(req.query.api_token);
  const token = req.query.api_token;
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
