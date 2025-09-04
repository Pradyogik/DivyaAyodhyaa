var express 	= require('express');
var router 		= express.Router();
var home 	    = require('../../controllers/app/home');

router.get('/', home.index);
router.get('/home1',home.home1);

router.get('/servicespages', home.service);
router.get('/globalsearch', home.globalsearch);
router.get('/search', home.search);
router.get('/notification', home.notification);
router.get('/favourite', home.favourite);
router.get('/booking', home.booking);
router.get('/profile', home.profile);
router.get('/yourorders', home.yourorders);
router.get('/refundcan', home.refundcan);
router.get('/termcon', home.termcon);
router.get('/privacypolicy', home.privacypolicy);
router.get('/faq', home.faq);
router.get('/contactus', home.contactus);
router.get('/sendfeedback', home.sendfeedback);
router.post('/sendfeedback', home.sendfeedback);
router.post('/homestaysave-favourite', home.homestaysavefavourite);
router.post('/homestayremove-favourite', home.homestayRemovefavourite);
router.get('/tour-package-booking-history', home.tourPackageBookingHistory);
router.get('/cabs-booking-history', home.cabsBookingHistory);
router.get('/guide-booking-history', home.guideBookingHistory);
router.get('/diya-booking-history', home.diyaBookingHistory);
router.get('/update-profile', home.updateProfile);
router.post('/update-profile', home.updateProfile);



module.exports = router;

