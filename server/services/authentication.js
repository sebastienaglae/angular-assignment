const { User } = require('../models/db');
const jwt = require("jsonwebtoken");

class AuthenticationService {
    _passwordHashKey;
    _tokenSignatureKey;

    constructor() {
        this._passwordHashKey = process.env.PASSWORD_HASH_KEY;
        this._tokenSignatureKey = process.env.TOKEN_SIGNATURE_KEY;
    }

    async login(username, password) {
        const passwordHash = this.hashPassword(password);
        const user = await User.findOne({ username, passwordHash });
        if (!user) {
            throw new AuthenticationError('Invalid username or password');
        }

        return this.generateToken(user);
    }

    async register(username, password, email) {
        const passwordHash = this.hashPassword(password);
        const user = new User({
            username,
            passwordHash,
            email
        });
        await user.save();
    }

    hashPassword(password) {
        const hash = crypto.createHmac('sha512', this._hashKey);
        return hash.update(password).digest('hex');
    }

    generateToken(user) {
        const token = jwt.sign({
            id: user._id,
            roles: user.roles
        }, this._tokenSignatureKey, { expiresIn: '24d' });
        return token;
    }

    parseToken(token) {
        return jwt.verify(token, this._tokenSignatureKey) || {};
    }
}

class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.code = 401;
    }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;