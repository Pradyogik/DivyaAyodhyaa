var config = require('../../config');
var common = require('../../common_function/common');

exports.book_diya_prashad = (req, res, next) => {
    req.flash('error', 'Diya Prasadam booking is closed');
    return  res.redirect("/");
    lang = req.session.lang;
    const session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }

        const error = req.flash('error');
        const success = req.flash('success');

        res.render('app/bookDiyaPrashad/index',{pagetitle: 'Book Diya Prashad', pageactive: 'home'});
};

exports.book_diya = (req, res, next) => {
    req.flash('error', 'Diya Prasadam booking is closed');
    return  res.redirect("/");

    lang = req.session.lang;
    session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }
 
     if(req.method == 'POST'){
 
         console.log("req.methodi");
         console.log(session);
 
         if((req.body.diya_type == '') || (req.body.name == '') || (req.body.diya_price == '') ||  (req.body.mobile == '')  || (req.body.address == '') || (req.body.state_name == '') || (req.body.city_name == '') || (req.body.pincode == '') )
             {
                 req.flash('error', 'All Fields Required');
                 res.redirect("/book_diya");
 
             }else{
     
                     var dtype = req.body.diya_type;
                     var diya_price = req.body.diya_price;
                     var uid = session.user_id;
                     
                     var name = req.body.name;
                     var mobile = req.body.mobile;
                     var email = req.body.email;
                     var address = req.body.address;
                     var state_name = req.body.state_name;
                     var city_name = req.body.city_name;
                     var pincode = req.body.pincode;
                     var locality = req.body.locality;
                     var created_at    = currentdatetime();
         
                     const timestampss = Date.now();
                     const rand_number = Math.floor(100000 + Math.random() * 900000);
                     const booking_number =  timestampss + rand_number;
         
                     const timestamp = Date.now().toString();
                     const randomString = Math.random().toString(36).substring(2, 8);
                     const order_id =  timestamp + randomString;
         
                     var sql = "INSERT INTO book_diya_prashad(booking_type_id, booking_number, order_id, booking_date, name, mobile, email, state, city, pincode, address, locality, booking_amount, user_id, created_at) VALUES  ('"+dtype+"','"+booking_number+"','"+order_id+"','"+created_at+"','"+name+"','"+mobile+"','"+email+"','"+state_name+"','"+city_name+"','"+pincode+"','"+address+"','"+locality+"','"+diya_price+"','"+uid+"','"+created_at+"')";
         
                     console.log(sql);
                     //return;
         
                     config.query(sql, function (err, result) {
                         
                         if (err) throw err;
                         if(result.affectedRows)
                         {
                            res.redirect('https://divyaayodhya.com/NewAppdiyaPayment/payment/begin/'+ result.insertId)
                         // res.redirect('https://divyaayodhya.com/book_guide/NewAppBookGuidePayment/begin/'+ result.insertId)
                        //  res.redirect('/book_diya')
                        //  req.flash('success', 'Thanks');
                         }
                         else
                         {
                             req.flash('error', 'Something Went Wrong');
                             res.redirect('/book_diya')
                         }
                     });
     
     
                 }
     }else{

         lang = req.session.lang;
         session = req.session;
         const prodcutId = req.params.id;
         
          var query1 = "SELECT * FROM diya_prashad_master where type = '1' AND  id = "+ prodcutId +" AND status = '1' ";
 
        config.query(query1, function (err, dtypes) {
 
             if (err) {
                 console.error(err.message);
                 return;
             }
             else {
                  // Extract name from the result of query1
                 var dType  = dtypes.length > 0 ? dtypes[0].type : ''; // Assuming dtypes[0].type contains the 'type' field
                 var dName  = dtypes.length > 0 ? dtypes[0].name : ''; // Assuming dtypes[0].name contains the 'name' field
                 var dPrice = dtypes.length > 0 ? dtypes[0].price : ''; // Assuming dtypes[0].price contains the 'price' field
         
             }
             var query2 = "SELECT * FROM states where status = '1' ";
             config.query(query2, function (err, state) {
 
                 if (err) {
                     console.error(err.message);
                     return;
                 }
                 else {
                     var state = state;
                     
                 }
               const error = req.flash('error');
               const success = req.flash('success');
               
             res.render('app/bookDiyaPrashad/book_diya',{langtype: lang, error, success, dType:dType,dName:dName,dPrice:dPrice,dtypes:dtypes,statelist:state, pagetitle: 'Book Diya', pageactive: 'home'});
             
             });
         });    
     }
 };






exports.book_diyaold = (req, res, next) => {

    lang = req.session.lang;
    session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }

    if(req.method == 'POST'){
 
        console.log("req.methodi");
        console.log(req.method);

    }else{
        console.log("req.methode");
        console.log(req.method);
        const prodcutId = req.params.id;
        console.log("prodcutId");
        console.log(prodcutId);

        
       
    }



    
    // var query1 = "SELECT * FROM diya_prashad_master where type = '1' AND status = '1' ";
    //     config.query(query1, function (err, dtypes) {

    //         if (err) {
    //             console.error(err.message);
    //             return;
    //         }
    //         else {
    //             var dtypes = dtypes;
                
    //         }
    //         var query2 = "SELECT * FROM states where status = '1' ";
    //         config.query(query2, function (err, state) {

    //             if (err) {
    //                 console.error(err.message);
    //                 return;
    //             }
    //             else {
    //                 var state = state;
                    
    //             }
    //         const error = req.flash('error');
    //         const success = req.flash('success');

    //         res.render('app/bookDiyaPrashad/book_diya',{langtype: lang, error, success, dtypes: dtypes,statelist:state, pagetitle: 'Book Diya', pageactive: 'home'});
            
    //     });
    // });    
};

 
exports.getcitylist = (req, res, next) => {
    var state_id = req.query.state_id;
    console.log(state_id);
    session = req.session;
    
    var query1 = "SELECT * FROM cities  WHERE state_id=" +state_id;

    config.query(query1, function (error, citylist) {

        if (error) {
            console.error(error.message);
            return;
        }
        else {
            var response = citylist;
            return res.status(200).json(response);
        }
        
    });
};

exports.createDiyaBooking = (req, res, next) => {
    const lang = req.session.lang;
    const session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }
            
        if((req.body.diya_type == '') || (req.body.name == '') || (req.body.diya_price == '') ||  (req.body.mobile == '')  || (req.body.address == '') || (req.body.state_name == '') || (req.body.city_name == '') || (req.body.pincode == '') )
        {
            req.flash('error', 'All Fields Required');
            res.redirect("/book_diya");
        }
        else{

            var dtype = req.body.diya_type;
            var diya_price = req.body.diya_price;
            var uid = session.user_id;
            var name = req.body.name;
            var mobile = req.body.mobile;
            var email = req.body.email;
            var address = req.body.address;
            var state_name = req.body.state_name;
            var city_name = req.body.city_name;
            var pincode = req.body.pincode;
            var locality = req.body.locality;
            var created_at    = currentdatetime();

            const timestampss = Date.now();
            const rand_number = Math.floor(100000 + Math.random() * 900000);
            const booking_number =  timestampss + rand_number;

            const timestamp = Date.now().toString();
            const randomString = Math.random().toString(36).substring(2, 8);
            const order_id =  timestamp + randomString;

            var sql = "INSERT INTO book_diya_prashad(booking_type_id, booking_number, order_id, booking_date, name, mobile, email, state, city, pincode, address, locality, booking_amount, user_id, created_at) VALUES  ('"+dtype+"','"+booking_number+"','"+order_id+"','"+created_at+"','"+name+"','"+mobile+"','"+email+"','"+state_name+"','"+city_name+"','"+pincode+"','"+address+"','"+locality+"','"+diya_price+"','"+uid+"','"+created_at+"')";

            // console.log(sql);
            // return;

            config.query(sql, function (err, result) {
                
                if (err) throw err;
                if(result.affectedRows)
                {
                  // res.redirect('https://divyaayodhya.com/book_guide/NewAppBookGuidePayment/begin/'+ result.insertId)
                  res.redirect('/book_diya')
                  req.flash('success', 'Thanks');
                }
                else
                {
                    req.flash('error', 'Something Went Wrong');
                    res.redirect('/book_diya')
                }
            });


        }
           
};

// Start Prashad Booking section

exports.book_prashad = (req, res, next) => {

    lang = req.session.lang;
    session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }
    
    var query1 = "SELECT * FROM diya_prashad_master  WHERE type ='2' AND status = '1'";
        config.query(query1, function (err, ptypes) {

            if (err) {
                console.error(err.message);
                return;
            }
            else {
                var ptypes = ptypes;
                
            }
            var query2 = "SELECT * FROM states where status = '1' ";
            config.query(query2, function (err, state) {

                if (err) {
                    console.error(err.message);
                    return;
                }
                else {
                    var state = state;
                    
                }
            const error = req.flash('error');
            const success = req.flash('success');

            res.render('app/bookDiyaPrashad/book_prashad',{langtype: lang, error, success, ptypes: ptypes,statelist:state, pagetitle: 'Book Prashad', pageactive: 'home'});
            
        });
    });    
};


exports.getpricebyprashad = (req, res, next) => {
    var prashad_type = req.query.prashad_type;
    console.log(prashad_type);
    session = req.session;
    
    var query1 = "SELECT * FROM diya_prashad_master  WHERE type ='2' AND  id="+prashad_type;

    config.query(query1, function (error, prashadprice) {

        if (error) {
            console.error(error.message);
            return;
        }
        else {
            console.log(prashadprice[0].price);
            return res.status(200).json(prashadprice[0].price);
        }
        
    });
};

exports.createPrashadBooking = (req, res, next) => {
    const lang = req.session.lang;
    const session = req.session;
    console.log(session);
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }
            
        if((req.body.prashad_type == '') || (req.body.name == '') || (req.body.prashad_price == '') ||  (req.body.mobile == '')  || (req.body.address == '') || (req.body.state_name == '') || (req.body.city_name == '') || (req.body.pincode == '') )
        {
            req.flash('error', 'All Fields Required');
            res.redirect("/book_prashad");
        }
        else{

            var ptype = req.body.prashad_type;
            var prashad_price = req.body.prashad_price;
            var uid = session.user_id;
            var name = req.body.name;
            var mobile = req.body.mobile;
            var email = req.body.email;
            var address = req.body.address;
            var state_name = req.body.state_name;
            var city_name = req.body.city_name;
            var pincode = req.body.pincode;
            var locality = req.body.locality;
            var created_at    = currentdatetime();

            const timestampss = Date.now();
            const rand_number = Math.floor(100000 + Math.random() * 900000);
            const booking_number =  timestampss + rand_number;

            const timestamp = Date.now().toString();
            const randomString = Math.random().toString(36).substring(2, 8);
            const order_id =  timestamp + randomString;

            var sql = "INSERT INTO book_diya_prashad(booking_type_id, booking_number, order_id, booking_date, name, mobile, email, state, city, pincode, address, locality, booking_amount, user_id, created_at) VALUES  ('"+ptype+"','"+booking_number+"','"+order_id+"','"+created_at+"','"+name+"','"+mobile+"','"+email+"','"+state_name+"','"+city_name+"','"+pincode+"','"+address+"','"+locality+"','"+prashad_price+"','"+uid+"','"+created_at+"')";

            config.query(sql, function (err, result) {
                
                if (err) throw err;
                if(result.affectedRows)
                {
                   res.redirect('/diyaPayment/payment/begin/'+ result.insertId)
                //   res.redirect('/book_prashad')
                //   req.flash('success', 'Thanks');
                }
                else
                {
                    req.flash('error', 'Something Went Wrong');
                    res.redirect('/book_prashad')
                }
            });


        }
           
};