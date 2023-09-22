const jwt = require('jsonwebtoken');
const config = require('./config'); 


async function authenticateUser(req, res, next) {
  
  const token = req.headers.authorization || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    const decoded = await jwt.verify(token, config.jwtSecret);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    const user = decoded.user;    
    if (user.role === 'Seller') {
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Seller is not verified.' });
      }
    } else if (user.role === 'MainAdmin') {
      if (!user.isAdmin) {
        return res.status(403).json({ message: 'Main Admin does not have necessary privileges.' });
      }
    } else if (user.role === 'HelperAdmin') {
      
      if (!user.isAdmin) {
        return res.status(403).json({ message: 'Helper Admin does not have necessary privileges.' });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = authenticateUser;
