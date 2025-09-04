var express 	= require('express');
var router 		= express.Router();
var bookDiyaPrashad	       = require('../../controllers/app/bookDiyaPrashad');


router.get('/book_diya_prashad', bookDiyaPrashad.book_diya_prashad);
router.get('/book_diya/:id?', bookDiyaPrashad.book_diya);
router.post('/book_diya/', bookDiyaPrashad.book_diya);
router.get('/getcitylist', bookDiyaPrashad.getcitylist);

router.post('/createDiyaBooking', bookDiyaPrashad.createDiyaBooking);
router.get('/book_prashad', bookDiyaPrashad.book_prashad);
router.get('/getpricebyprashad', bookDiyaPrashad.getpricebyprashad);
router.post('/createPrashadBooking', bookDiyaPrashad.createPrashadBooking);






module.exports = router;