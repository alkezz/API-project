const express = require('express')
const router = express.Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
        const { user } = req;
        if (user) {
            return res.json({
                id: user.toSafeObject().id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: user.toSafeObject().email,
                username: user.toSafeObject().username

            });
        } else {
            res.json(null)
        }
    }
);

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required.'),
    handleValidationErrors
];

// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            // const err = new Error('Login failed');
            // err.status = 401;
            // err.title = 'Login failed';
            // err.errors = ['The provided credentials were invalid.'];
            // return next(err);
            return res.status(401).json({
                message: 'Invalid credentialis',
                statusCode: 401
            })
        }

        const a = await setTokenCookie(res, user);
        user.setDataValue('token', a)
        return res.status(200).json(
            user
        );
    }
);

router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

module.exports = router;
