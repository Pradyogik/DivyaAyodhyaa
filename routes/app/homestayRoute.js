var express 	= require('express');
var router 		= express.Router();
var homestay 	    = require('../../controllers/app/homestay');
var homestaypayment 	    = require('../../controllers/app/homestaypayment');

router.get('/homestay', homestay.index);
router.get('/property-search', homestay.propertySearch);
router.post('/loadmoreproperty', homestay.loadmoreproperty);
router.post('/chkproperty', homestay.checkproperty);
router.get('/stay-ayodhya/property-rooms/:id', homestay.roomlist);
router.get('/stay-ayodhya/booking/:id/:pro_id', homestay.booking);
router.get('/stay-ayodhya/check-room-availability', homestay.checkRoomAvailability);
router.post('/stay-ayodhya/check-room-availability', homestay.checkRoomAvailability);
router.post('/stay-ayodhya/postbooking', homestay.postbooking);

//payment
router.get('/stay-ayodhya/payment/begin/:id', homestaypayment.begin);


module.exports = router;

