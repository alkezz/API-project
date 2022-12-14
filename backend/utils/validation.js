const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array()
            .map((error) => `${error.msg}`);

        const err = Error('Validation error');
        err.errors = errors;
        err.status = 400;
        next(err);
    }
    next();
};

const handleSpotValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array()
            .map((error) => `${error.msg}`);

        const err = Error('Validation Error');
        err.status = 400;
        err.errors = errors;
        next(err);
    }
    next();
}

module.exports = {
    handleValidationErrors,
    handleSpotValidationErrors
};
