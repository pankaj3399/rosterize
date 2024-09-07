const {login, register, forgotPassword, resetPassword} = require('../controllers/Auth');

const router = require('express').Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;