var config = require('../../config');
var common = require('../../common_function/common');

exports.book_guide = (req, res, next) => {
    lang = req.session.lang;
    session = req.session;
   
    var query1 = "SELECT * FROM guide_booking_type  WHERE status=1";
    config.query(query1, function (err, btype) {

        if (err) {
            console.error(err.message);
            return;
        }
        else {
              var types = btype;
            
         }

         var query2 = "SELECT * FROM guide_pickup_point_master  WHERE status=1";
         config.query(query2, function (err, btypes) {
     
             if (err) {
                 console.error(err.message);
                 return;
             }
             else {
                   var pickuotypes = btypes;
                 
              }
              const error = req.flash('error');
              const success = req.flash('success');
    
              res.render('app/bookGuide/index',{langtype: lang, error, success, book_type : types, pickuppoint: pickuotypes,pagetitle: 'Book Your Guide', pageactive: 'home'});
             
     
     });
    });
};


exports.createGuideBooking = (req, res, next) => {
    const lang = req.session.lang;
    const session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }

            
        if((req.body.booking_type == '') || (req.body.booking_date == '') || (req.body.start_point == '') || (req.body.slot == '') || (req.body.booking_fee == '') ||  (req.body.name == '') || (req.body.mobile == '') || (req.body.email == '') || (req.body.address == '') )
        {
            req.flash('error', 'All Fields Required');
            res.redirect("/book_guide");
        }
        else{

            var btype = req.body.booking_type;
            var bdate = req.body.booking_date;
            var spoint = req.body.start_point;
            var slot = req.body.slot;
            var bfee = req.body.booking_fee;
            var uid = session.user_id;
            var name = req.body.name;
            var mobile = req.body.mobile;
            var email = req.body.email;
            var address = req.body.address;
            var created_at    = currentdatetime();

            const timestampss = Date.now();
            const rand_number = Math.floor(100000 + Math.random() * 900000);
            const booking_number =  timestampss + rand_number;

            const timestamp = Date.now().toString();
            const randomString = Math.random().toString(36).substring(2, 8);
            const order_id =  timestamp + randomString;

            var sql = "INSERT INTO guide_booking (booking_number,order_id,booking_type_id, booking_date, slot_id, pickup_point_id, user_id, booking_amount, name, mobile, email, address, created_at) VALUES ('"+booking_number+"','"+order_id+"','"+btype+"','"+bdate+"','"+slot+"','"+spoint+"','"+uid+"','"+bfee+"','"+name+"','"+mobile+"','"+email+"','"+address+"','"+created_at+"')";
            config.query(sql, function (err, result) {
                
                if (err) throw err;
                if(result.affectedRows)
                {
                   res.redirect('https://divyaayodhya.com/book_guide/NewAppBookGuidePayment/begin/'+ result.insertId)
                }
                else
                {
                    req.flash('error', 'Something Went Wrong');
                    res.redirect('/book_guide')
                }
            });


        }
           
};


exports.getBookGuideValueass = (req, res, next) => {
    var booking_type = req.query.booking_type;
    console.log(booking_type);
    session = req.session;
    
    var query1 = "SELECT * FROM guide_slot  WHERE status=1 AND guide_booking_type =" +booking_type;
    config.query(query1, function (error, slot) {

        if (error) {
            console.error(error.message);
            return;
        }
        else {
            var datas ='<option value="">---Select Slot---</option>';

            if(slot.length > 0)
            { 
                
            for (let s of slot)
            {
             
			 datas += '<option value="'+ s.id +'">'+ s.slot_view +'</option>'
											
			} 
           }
           else{
             datas += 'No Slots'

           }
            
        }
        console.log(datas);
        res.send(datas);
    });

   
};

exports.getpricebyslot = (req, res, next) => {
    var slot_id = req.query.slot_id;
    console.log(slot_id);
    session = req.session;
    
    var query1 = "SELECT * FROM guide_slot  WHERE  id=" +slot_id;
    config.query(query1, function (error, slotprice) {

        if (error) {
            console.error(error.message);
            return;
        }
        else {
            console.log(slotprice[0].slot_price);
        res.send(slotprice[0].slot_price);
           
            
        }
        
    });

   
};