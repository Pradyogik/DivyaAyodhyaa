var config = require('../../config');
var common = require('../../common_function/common');

exports.begin = (req, res, next) => {
    lang = req.session.lang;
    session = req.session;
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
       }
	
    var paymentid = decrypt(req.params.id);
    var paymentinfo = "SELECT m.* FROM room_booking as m  WHERE m.id=" + paymentid;

    config.query(paymentinfo, function (error, payino) {
        if (error) {
            console.error(error.message);
            return;
        }
        else {

            var payemtndatas = payino;
            res.send('<center><h4>Waiting for Payment Getway..</h4></center>');return;
            res.render('frontend/stayhome/payment/payment-page', { paymentdata:payemtndatas });
            
        }
    });
};