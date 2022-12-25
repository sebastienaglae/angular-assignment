const middleware = (error, req, res, next) => {
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: { name: error.name, message: error.message } });
};

module.exports = middleware;