const middleware = (error, req, res, next) => {
    let httpCode = 500;
    if (error.code && typeof error.code === 'number' && error.code >= 400 && error.code < 600) {
        httpCode = error.code;
    }
    res.status(httpCode).json({ error: { name: error.name, message: error.message } });
};

module.exports = middleware;