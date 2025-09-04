var express 	= require('express');
var router 		= express.Router();

router.use('/', require('./app/homeRoute'));
router.use('/', require('./app/loginRoute'));
router.use('/', require('./app/homestayRoute'));
router.use('/', require('./app/bookGuideRoute'));
router.use('/', require('./app/bookDiyaPrashadRoute'));
module.exports = router; 