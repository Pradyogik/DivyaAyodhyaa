var express 	= require('express');
var router 		= express.Router();
var bookGuide 	    = require('../../controllers/app/bookGuide');

router.get('/book_guide', bookGuide.book_guide);
router.get('/getBookGuideValue', bookGuide.getBookGuideValueass);
router.get('/getpricebyslot', bookGuide.getpricebyslot);
router.post('/createGuideBooking', bookGuide.createGuideBooking);

module.exports = router;