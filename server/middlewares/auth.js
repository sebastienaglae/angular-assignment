const AuthenticationService = require('../services/authentication');

const middleware = (req, res, next) => {
    // get the Authorization header
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // get the token
        const token = authHeader.substring(7);
        const {id, roles} = AuthenticationService.parseToken(token);

        res.auth = {
            id,
            roles,

            hasRole(role) {
                return roles.includes(role);
            }
        }
    } else {
        res.auth = null;
    }

    next();
}

module.exports = middleware;