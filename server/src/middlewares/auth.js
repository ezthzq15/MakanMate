const jwt = require('jsonwebtoken');

/**
 * Middleware to securely extract and verify JWT tokens.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token is malformed' });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token is missing' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_key';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    // Attach user payload to request
    req.user = decoded; // Contains { userID, userEmail, userRole } based on our payload
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

/**
 * Higher-order middleware mapping allowed roles.
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // verifyToken MUST run before this so req.user exists
    if (!req.user || !allowedRoles.includes(req.user.userRole)) {
      return res.status(403).json({ error: `Forbidden: Requires one of roles: ${allowedRoles.join(', ')}` });
    }
    next();
  };
};

/**
 * Common shortcut middleware for Admin routes.
 */
const isAdmin = requireRole('admin');

/**
 * Common shortcut middleware for StallManager routes.
 */
const isStallManager = requireRole('StallManager');

/**
 * Combined access for Admin OR StallManager.
 */
const isAdminOrManager = requireRole('admin', 'StallManager');

/**
 * Middleware that extracts user info if present, but DOES NOT block if missing.
 * Used for guest discovery logic.
 */
const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return next();

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return next();

  const token = parts[1];
  const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_key';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    // Even if token is invalid, let guest experience continue
    next();
  }
};

module.exports = { verifyToken, optionalVerifyToken, requireRole, isAdmin, isStallManager, isAdminOrManager };
