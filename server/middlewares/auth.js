const AuthenticationService = require('../services/authentication');

const middleware = (req, res, next) => {
    // get the Authorization header
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        // get the token
        const token = authHeader.substring(7);
        const {id, roles} = AuthenticationService.parseToken(token);

        req.auth = {
            id,
            roles,

            hasRole(role) {
                return roles.includes(role);
            }
        }
    } else {
        req.auth = null;
    }

    next();
}

module.exports = middleware;