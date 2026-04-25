// Auth0 middleware for Express backend
// Reuse the express-jwt/jwks-rsa middleware implementation
const authMiddleware = require('./authMiddleware');

module.exports = authMiddleware;
