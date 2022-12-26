const {Account} = require('../models/db');
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
        const account = await Account.findOne({ username, passwordHash });
        if (!account) {
            throw new AuthenticationError('Invalid username or password');
        }

        return this.generateToken(account);
    }

    async register(username, password, email) {
        const passwordHash = this.hashPassword(password);
        const account = new Account({
            username,
            passwordHash,
            email
        });

        try {
            await account.save();
            return account._id;
        } catch (error) {
            if (error.code === 11000) {
                throw new RegistrationError('Username or email already in use');
            }
            throw error;
        }
    }

    hashPassword(password) {
        const hash = crypto.createHmac('sha512', this._passwordHashKey);
        return hash.update(password).digest('hex');
    }

    generateToken(account) {
        const token = jwt.sign({
            id: account._id,
            roles: account.roles
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

class RegistrationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RegistrationError';
        this.code = 401;
    }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;
global.crypto = require('crypto');
