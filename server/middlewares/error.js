const middleware = (err, req, res, next) => {
    try {
        next();
    } catch (error) {
        console.error(error);
        const errorCode = error.code || 500;
        res.status(errorCode).json({ error: { name: error.name, message: error.message } });
    }
};

module.exports = middleware;