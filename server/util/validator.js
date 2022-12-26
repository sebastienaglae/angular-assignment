const mongoose = require('mongoose');

const StringRegexValidator = (key, str, regex) => {
    if (typeof str !== 'string') {
        return false;
    }
    if (!regex.test(str)) {
        throw new ValidationError(`Invalid value for ${key}: ${str}`);
    }
    return true;
}

const StringLengthValidator = (key, str, min, max) => {
    if (typeof str !== 'string') {
        return false;
    }
    if (str.length < min) {
        throw new ValidationError(`Invalid value for ${key}: Minimum length is ${min}`);
    }
    if (max && str.length > max) {
        throw new ValidationError(`Invalid value for ${key}: Maximum length is ${max}`);
    }
    return true;
}

const NumberValidator = (key, num, min, max) => {
    if (typeof num !== 'number') {
        return false;
    }
    if (num < min) {
        throw new ValidationError(`Invalid value for ${key}: Minimum value is ${min}`);
    }
    if (max && num > max) {
        throw new ValidationError(`Invalid value for ${key}: Maximum value is ${max}`);
    }
    return true;
}

const EmailValidator = (key, email) => {
    return StringRegexValidator(key, email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
}

const ObjectIdValidator = (key, id) => {
    return CustomValidator(key, id, mongoose.Types.ObjectId.isValid);
}

const DateTimeValidator = (key, date) => {
    return CustomValidator(key, date, (date) => {
        return !isNaN(Date.parse(date));
    });
}

const CustomValidator = (key, value, validator) => {
    if (!validator(value)) {
        throw new ValidationError(`Invalid value for ${key}: ${value}`);
    }
    return true;
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.code = 400;
    }
}

module.exports = {
    StringRegexValidator,
    StringLengthValidator,
    NumberValidator,
    EmailValidator,
    CustomValidator,
    ObjectIdValidator,
    DateTimeValidator,
}