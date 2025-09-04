var express 	= require('express');
var router 		= express.Router();
var login 	    = require('../../controllers/app/login');

router.get('/login', login.login);
router.post('/send-otp', login.sendOtp);
router.post('/verify-otp', login.verifyOtp);
router.get('/register', login.register);
router.post('/register-send-otp', login.RegiaterSendOtp);
router.post('/register-verify-otp', login.RegiaterVerifyOtp);
router.get('/logout', login.logout);


module.exports = router;

