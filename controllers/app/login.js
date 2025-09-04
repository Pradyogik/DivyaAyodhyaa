var config = require('../../config');
var common = require('../../common_function/common');

exports.login = (req, res, next) => {
    if (req.session.newDivyaAyodhyaApp) {
        res.redirect("/");
    }
    lang = req.session.lang;
    const referralLink = req.headers.referer || '/';
    console.log(referralLink);
    res.render('app/login/login', { langtype: lang, pageactive: 'login', referralLink: referralLink });
};

exports.sendOtp = (req, res, next) => {
    const mno = req.body.mobile.trim();
    const phoneNumber = mno;
    const otp = Math.floor(100000 + Math.random() * 900000);
    //const otp = 111111;
    const referralLink = req.body.referralLink;
    console.log(referralLink);

    // Save referral link in session
    req.session.referralLink = referralLink;

    const msg = "ADAAYO%20-%20Your%20OTP%20for%20login%20is%20" + otp + "%20at%20Divya%20Ayodhya.%20Please%20do%20not%20share%20your%20OTP%20to%20anyone";



    var curr_date = "'" + currentdatetime() + "'";
    var cr_phone = "'" + phoneNumber + "'";
    var cr_otp = "'" + otp + "'";
    // checking mobile number is Exists
    var check = "SELECT mobile FROM app_login WHERE mobile=" + cr_phone;

    config.query(check, function (error, ch) {
        if (error) {
            console.error(error.message);
            return;
        }
        else if (ch.length > 0) {
            // if mobile no exists update otp
            var data = "UPDATE app_login SET otp=" + cr_otp + " WHERE mobile =" + cr_phone;


            config.query(data, function (error, save) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    sendSMS(msg, phoneNumber);
                    res.json({ success: true });

                }

            });
        }

        else {

            res.json({ success: false, message: ' Mobile Number not Registered Please Registred Your mobile' });

        }
    });
};


exports.verifyOtp = (req, res, next) => {
    const { otp, mobile } = req.body;
    console.log(otp);
    // checking otp match
    var otpquery = "SELECT otp FROM app_login WHERE mobile= '" + mobile + "' ";
    console.log(otpquery);

    config.query(otpquery, function (error, checlotp) {
        if (error) {
            console.error(error.message);
            return;
        }
        else {
            if (checlotp[0].otp == otp) {

                var sessionquerys = "SELECT * FROM app_login  WHERE mobile='" + mobile + "' ";
                console.log(sessionquerys);
                config.query(sessionquerys, function (error, sessdatas) {

                    if (error) {
                        console.error(error.message);
                        return;
                    }

                    else {
                        //User_id
                        req.session.user_id = sessdatas[0].id;
                        // User Role
                        req.session.role_id = sessdatas[0].role_id;
                        // User type
                        req.session.newDivyaAyodhyaApp = 'newDivyaAyodhyaApp';
                        //User Login ID
                        req.session.email = sessdatas[0].email;
                        //User role Name
                        req.session.mobile = sessdatas[0].mobile;
                        //User full name
                        req.session.full_name = sessdatas[0].full_name;
                         //User state name
                        req.session.state = sessdatas[0].state_id;
                          //User city name
                        req.session.city_id = sessdatas[0].city_id;
                         //User pincode 
                        req.session.pincode = sessdatas[0].pincode;
                         //User landmark  
                        req.session.landmark = sessdatas[0].landmark;
                        
                        const referralLink = req.session.referralLink || '/';
                        res.json({ success: true, referralLink: referralLink });




                    }

                });


            }
            else {
                res.json({ success: false, message: 'Invalid OTP' });

            }

        }

    });
};

exports.register = (req, res, next) => {
    if (req.session.newDivyaAyodhyaApp) {
        res.redirect("/");
    }
    lang = req.session.lang;
    res.render('app/login/register', { langtype: lang, pageactive: 'register' });
};


exports.RegiaterSendOtp = (req, res, next) => {
    const mno = req.body.mobile.trim();
    const phoneNumber = mno;
    const otp = Math.floor(100000 + Math.random() * 900000);
    //const otp = 111111;
    req.session.otp = otp;

    const msg = "ADAAYO%20-%20Your%20OTP%20for%20login%20is%20" + otp + "%20at%20Divya%20Ayodhya.%20Please%20do%20not%20share%20your%20OTP%20to%20anyone";

    var cr_phone = "'" + phoneNumber + "'";
    var cr_otp = "'" + otp + "'";
    // checking mobile number is Exists
    var check = "SELECT mobile FROM app_login WHERE mobile=" + cr_phone;

    config.query(check, function (error, ch) {
        if (error) {
            console.error(error.message);
            return;
        }
        else if (ch.length > 0) {
            // if mobile no exists 

            res.json({ success: false, message: 'Mobile Number is already Registered Please Login' });
           
        }

        else {
            sendSMS(msg, phoneNumber);
            res.json({ success: true, message: 'OTP Sent Successfully' });

        }
    });
};


exports.RegiaterVerifyOtp = (req, res, next) => {
    const { otp, fullname, email, mobile, address } = req.body;

    const storedOTP = req.session.otp;
    console.log(otp);
    if (otp == storedOTP) {

        const sql = 'INSERT INTO app_login (full_name, email, mobile, address) VALUES (?, ?, ?, ?)';
        const values = [fullname, email, mobile, address];
        config.query(sql, values, (error, results) => {
            if (error) {
                console.error(error.message);
                return;
            } else {
                // OTP matched, remove OTP from session
                    delete req.session.otp;
                    res.json({ success: true, message: 'You have Successfully Registered Please Login to Your Account' });
            }
        });
       
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
  

   
};

exports.logout = (req, res, next) => {
    //User_id
    delete req.session.user_id;
    // User Role
    delete req.session.role_id;
    // User type
    delete req.session.newDivyaAyodhyaApp;
    //User Login ID
    delete req.session.email;
    //User role Name
    delete req.session.mobile;
    //User full name
    delete req.session.full_name;
    res.redirect('/');
};