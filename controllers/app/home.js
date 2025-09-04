var config = require('../../config');
var common = require('../../common_function/common');
const axios = require("axios");
const redis = require("redis");
let redisClient;

exports.home1 = async (req, res, next) => {
    keyName = req.query.keyname;
    let results;
    let isCached = false;
		/*
        (async () => {
            const redisClient = redis.createClient({
                url: 'redis://:vishnukantmaurya@13.214.238.0:6379'
            });
  
            redisClient.on('error', err => console.log('Redis Client Error', err));
            console.log("Connected to our redis instance!");
            await redisClient.connect();
            try {
                const cacheResults = await redisClient.get(keyName);
                if (cacheResults) {
                    isCached = true;
                    results = JSON.parse(cacheResults);
                } else {
                    results = await homeQuery(keyName);
                    console.log(results);
                    if (results.length === 0) {
                    throw "API returned an empty array";
                    }
                    await redisClient.set(keyName, JSON.stringify(results));
                }
                
                res.send({
                    fromCache: isCached,
                    data: results,
                });
            } catch (error) {
                console.error(error);
                res.status(404).send("Data unavailable");
            }
          
        })(); 
		*/
		results = await homeQuery(keyName);
		res.send({
			fromCache: isCached,
			data: results,
		});
};

async function homeQuery(keyName) {
    
    if(keyName =='homeQuery1') {
        var sqlhome1 = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1  GROUP BY p.id ORDER BY RAND() LIMIT 10 ";
        return new Promise((resolve, reject)=>{
            config.query(sqlhome1,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    }

    if(keyName =='homeQuery2') {
        var sqlhome1 = "SELECT p.*, MAX(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1  GROUP BY p.id ORDER BY RAND() LIMIT 10";
        return new Promise((resolve, reject)=>{
            config.query(sqlhome1,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    }
    
}

exports.index = async (req, res, next) => {
    lang = req.session.lang;
    const homestayfavorites = req.session.homestayfavorites || [];
    
    const apiResponse = await axios.get(
        `https://app.divyaayodhya.com/home1?keyname=homeQuery1`
    );

    const apiResponse2 = await axios.get(
        `https://app.divyaayodhya.com/home1?keyname=homeQuery2`
    );

    homestay = apiResponse.data.data;
    homestays1 = apiResponse2.data.data; 
    
    res.render('app/home/index', { homestay1: homestay, homestay2: homestays1, langtype: lang, pageactive: 'home' });

};

/*
exports.index = (req, res, next) => {
    lang = req.session.lang;
    const homestayfavorites = req.session.homestayfavorites || [];
    //homestay row 1
    var sqlhome1 = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1  GROUP BY p.id ORDER BY RAND() LIMIT 10 ";
    var sqlhome2 = "SELECT p.*, MAX(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1  GROUP BY p.id ORDER BY RAND() LIMIT 10 ";
    config.query(sqlhome1, (error, homestay) => {
        if (error) {
            console.error(error.message);
            return;
        }
        config.query(sqlhome2, (error, homestays1) => {
            if (error) {
                console.error(error.message);
                return;
            }
            homestay.forEach(property => {
                property.isFavorite = homestayfavorites.includes(property.id.toString());
            });
            homestays1.forEach(property => {
                property.isFavorite = homestayfavorites.includes(property.id.toString());
            });
            res.render('app/home/index', { homestay1: homestay, homestay2: homestays1, langtype: lang, pageactive: 'home' });
        });

    });

};
*/

exports.service = (req, res, next) => {
    lang = req.session.lang;
    var page_type = req.query.page_id;
    var visit_type_id = req.query.visit_type;
    const pageSize = 10;
    const currentPage = parseInt(req.query.page) || 1;
    if (visit_type_id) {
        var visit_type_id = visit_type_id;

    }
    else {
        var visit_type_id = '';
    }
    switch (page_type) {
        case '/':
            res.redirect('/');
            break;

        case '1': //About Ayodhya
            res.render('app/servicespages/about_ayodhya', { langtype: lang, pagetitle: 'About Ayodhya', pageactive: 'servicepages' });
            break;

        case '2': //Temple Timings
            res.render('app/servicespages/temple_timings', { langtype: lang, pagetitle: 'Temple Timings', pageactive: 'servicepages' });
            break;

        case '3': //Must Visit
            res.render('app/servicespages/must_visit', { langtype: lang, pagetitle: 'Must Visit Places', pageactive: 'servicepages', visit_type: visit_type_id });
            break;

        case '4': //Orgnaization Structure
            res.render('app/servicespages/org_structure', { langtype: lang, pagetitle: 'Organisation Structure', pageactive: 'servicepages' });
            break;

        case '5': //Locate Utilities
            res.render('app/servicespages/locate_utilities', { langtype: lang, pagetitle: 'Locate Utilities', pageactive: 'servicepages' });
            break;

        case '51': //Locate Utilities My Parking


            var query = "SELECT p.id as pid,p.parking_name,p.parking_address,p.latitude,p.longitude,p.distance,p.capacity,p.primary_image,p.status,p.is_deleted,p.created_at,pm.pm_id as pmid,p.direction, pm.parking_id, pm.secondary_image FROM parking as p LEFT JOIN parking_media as pm ON p.id = pm.parking_id";

            paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {

                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    servicename = paginatedItems;

                }
                var error = req.flash('error');
                var success = req.flash('success');
                res.render('app/servicespages/locate_utilities_parking', { error, success, parkinglist: paginatedItems, currentPage, totalPages: Math.ceil(totalPage / pageSize), pageSize, langtype: lang, pagetitle: 'My Parking', pageactive: 'servicepages' });
            });
            break;

        case '52': //Locate Utilities Toilets List

            var query = "SELECT id, toilet_name, toilet_address, latitude, longitude, primary_image,direction, status, is_deleted, is_created FROM toilets";

            paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {

                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    servicename = paginatedItems;

                }
                var error = req.flash('error');
                var success = req.flash('success');
                res.render('app/servicespages/locate_utilities_toilets', { error, success, toiletlist: paginatedItems, currentPage, totalPages: Math.ceil(totalPage / pageSize), pageSize, langtype: lang, pagetitle: 'All Toilets Near You', pageactive: 'servicepages' });

            });

            break;

        case '53': //Locate Utilities Water ATM
            var query = "SELECT id, water_atm_name, atm_address, latitude, longitude, primary_image, direction, status, is_deleted, is_created FROM water_atm WHERE is_deleted = 0 AND status =1 AND atm_type = 0";

            paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {

                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    paginatedItems = paginatedItems;

                }
                var error = req.flash('error');
                var success = req.flash('success');
                res.render('app/servicespages/locate_utilities_water_atm', { error, success, waterAtmlist: paginatedItems, currentPage, totalPages: Math.ceil(totalPage / pageSize), pageSize, langtype: lang, pagetitle: 'All Water ATM Near You', pageactive: 'servicepages' });

            });

            break;
            
            case '54': //Locate Utilities Health ATM
            var query = "SELECT id, water_atm_name, atm_address, latitude, longitude, primary_image, direction, status, is_deleted, is_created FROM water_atm WHERE is_deleted = 0 AND status =1 AND atm_type = 1";

            paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {

                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    paginatedItems = paginatedItems;

                }
                var error = req.flash('error');
                var success = req.flash('success');
                res.render('app/servicespages/locate_utilities_health_atm', { error, success, healthAtmlist: paginatedItems, currentPage, totalPages: Math.ceil(totalPage / pageSize), pageSize, langtype: lang, pagetitle: 'All Health ATM Near You', pageactive: 'servicepages' });

            });

            break;   

        default: //Default
            res.redirect('/');
            break;

    }
};

exports.globalsearch = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/search', { langtype: lang, pagetitle: 'search', pageactive: 'search' });

}


exports.search = (req, res, next) => {


    var searchdata = req.query.SearchInput;
    var datas = '';

    if (searchdata != '') {
        var sql = `SELECT p.*, pg.image_path,pg.mark_as_main, ptm.name as property_typesss FROM property as p left JOIN property_gallery as pg ON p.id=pg.property_id LEFT JOIN property_type_master as  ptm ON  p.property_type=ptm.id  WHERE p.status= 1 AND  p.property_name LIKE '%${searchdata}%' OR p.address  LIKE '%${searchdata}%' OR ptm.name  LIKE '%${searchdata}%'   GROUP BY pg.property_id`;

    }
    else {
        datas += '<h3 class="propertynotfound">Property not found...</h3>';
        //res.send(datas);
    }

    config.query(sql, (error, searchdata) => {
        if (error) {
            console.error(error.message);
            return;
        }
        else {
            if (searchdata.length > 0) {
                var number = 1;
                for (let l of searchdata) {
                    stayhomeimageUrl = stayhomeimageUrl;
                    if (l.mark_as_main == 1) {
                        var imagepath = stayhomeimageUrl + l.image_path;

                    }

                    else {
                        var imagepath = stayhomeimageUrl + l.image_path;

                    }

                    datas += '<a href="/homestay?search=' + l.property_name + '"><div class="top-left50"> <h5>' + highlightText(l.property_typesss, searchdata) + '</h5></div><div class="mainsearchdiv">' +
                        '<div class="mainsearchdivimg"><img src="' + imagepath + '"></div><div class="hedmainsearchdivimg"> <h3>' + highlightText(l.property_name, searchdata) + '</h3> <h4><i class="fa fa-map-marker " style="color: #eb6453;"></i>&nbsp; ' + highlightText(l.address, searchdata) + '</h4></div>' +
                        '</div></a>'
                }
            }
            else {
                datas += '<h3 class="propertynotfound">Property not found...</h3>'

            }
        }

        console.log(datas);

        res.send(datas);
    });


}

// Function to highlight matched text
function highlightText(text, query) {
    if (!text) {
        return '';
    }
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlightText11">$1</span>');
}

exports.notification = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/notification', { langtype: lang, pagetitle: 'Notification', pageactive: 'notification' });

}
exports.favourite = (req, res, next) => {

    lang = req.session.lang;
    const homestayfavorites = req.session.homestayfavorites || [];
    // Convert the array to a comma-separated string
    const favoriteIds = homestayfavorites.map(id => `'${id}'`).join(',');
    //homestay row 1
    if (favoriteIds) {
        var homefavsql = `SELECT p.*, pg.image_path,pg.mark_as_main, ptm.name as property_typesss FROM property as p left JOIN property_gallery as pg ON p.id=pg.property_id LEFT JOIN property_type_master as  ptm ON  p.property_type=ptm.id  WHERE p.id IN(${favoriteIds}) GROUP BY p.id  ORDER BY FIELD(p.id, ${favoriteIds}) DESC `;
        console.log(homefavsql);
        config.query(homefavsql, (error, homestayfavdata) => {
            if (error) {
                console.error(error.message);
                return;
            }
            res.render('app/home/favourite', { homestayFavorite: homestayfavdata, langtype: lang, pagetitle: 'Favourite', pageactive: 'favourite' });
        });
    }
    else {
        res.render('app/home/favourite', { homestayFavorite: [], langtype: lang, pagetitle: 'Favourite', pageactive: 'favourite' });

    }


}
exports.booking = (req, res, next) => {
    lang = req.session.lang;
    session = req.session;
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
    }
    var today = '"' + currentdate() + '"';
    var hotelbooking = `SELECT rb.*,p.property_name,p.contact_person_mobile,p.address,rtm.name as room_title,rg.room_image,pg.image_path FROM room_booking as rb LEFT JOIN property as p ON rb.property_id=p.id LEFT JOIN property_rooms as pr ON pr.id=rb.room_id LEFT JOIN room_type_master as rtm ON pr.room_category_id=rtm.id LEFT JOIN room_gallery as rg ON pr.id=rg.room_id LEFT JOIN property_gallery as pg ON p.id=pg.property_id WHERE rb.transaction_status = 1 AND rb.check_in_date >= ${today} AND  rb.user_id=${session.user_id} AND rg.mark_as_main=1 AND pg.mark_as_main=1 ORDER BY rb.check_in_date; `;
    console.log(hotelbooking);
    config.query(hotelbooking, (error, hotelbookinglist) => {
        if (error) {
            console.error(error.message);
            return;
        }
        res.render('app/home/bookings', { hotelbooking: hotelbookinglist, langtype: lang, pagetitle: 'Bookings', pageactive: 'booking' });

    });


}
exports.profile = (req, res, next) => {
    session = req.session
    console.log(session);
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
    }
    lang = req.session.lang;
    var profiledetail = `SELECT * FROM app_login WHERE id=${session.user_id}`;
    config.query(profiledetail, (error, profiledetaildata) => {
        if (error) {
            console.error(error.message);
            return;
        }
        else
        {
            res.render('app/home/profile', {profiledata: profiledetaildata,  langtype: lang, pagetitle: 'Profile', pageactive: 'profile' });

        }
    });
 

}

exports.yourorders = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/your_orders', { langtype: lang, pagetitle: 'Your Orders', pageactive: 'yourorders' });

}

exports.refundcan = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/refund_cancellation', { langtype: lang, pagetitle: ' Refund & Cancellation Policy ', pageactive: 'refundcan' });

}

exports.privacypolicy = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/privacy_policy', { langtype: lang, pagetitle: 'Privacy Policy', pageactive: 'privacypolicy' });

}

exports.faq = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/faq', { langtype: lang, pagetitle: 'FAQ', pageactive: 'faq' });

}


exports.termcon = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/term_condition', { langtype: lang, pagetitle: 'Terms & Conditions', pageactive: 'termcon' });

}
exports.contactus = (req, res, next) => {
    lang = req.session.lang;
    res.render('app/home/contact_us', { langtype: lang, pagetitle: 'Contact Us', pageactive: 'contactus' });

}
exports.sendfeedback = (req, res, next) => {
    const lang = req.session.lang;
    const session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }

    if (req.method === 'POST') {
        const { emoji, deliveryRating, productRating, customerRating, comment } = req.body;

        // Validate the received data
        if (!emoji || !deliveryRating || !productRating || !customerRating || !comment) {
            return res.json({ success: false, message: 'All fields are required.' });
        }

        const user_id = session.user_id;
        const created_date = currentdatetime(); // Properly formatted current datetime

        const sql = 'INSERT INTO app_feedback (user_id, rate_emoji, delivery_time, product_quality, customer_service, comment, created_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [user_id, emoji, deliveryRating, productRating, customerRating, comment, created_date];

        config.query(sql, values, (error, results) => {
            if (error) {
                console.error(error.message);
                return res.json({ success: false, message: 'An error occurred while submitting your feedback. Please try again.' });
            } else {
                return res.json({ success: true, message: 'Thank you! You have successfully submitted your feedback.' });
            }
        });
    } else {

        var today = '"' + currentdate() + '"';
        var checkingdeedback = `SELECT * FROM app_feedback WHERE user_id=${session.user_id};`;
        console.log(checkingdeedback);
        config.query(checkingdeedback, (error, checkingdeedbackresult) => {
            if (error) {
                console.error(error.message);
                return;
            }
            else
            {
                res.render('app/home/send_feedback', { langtype: lang, isfeedback: checkingdeedbackresult, pagetitle: 'Send Feedback', pageactive: 'sendfeedback' });

            }
        
       
    });
    }
};


exports.updateProfile = (req, res, next) => {
    const lang = req.session.lang;
    const session = req.session;
    
    if (!req.session.newDivyaAyodhyaApp) {
        return res.redirect("/login");
    }

    if (req.method === 'POST') {
       const { first_name, mobile, email, state_name, city_name, address, pincode, locality} = req.body;

        console.log("req.body");
        console.log(req.body);

        // Validate the received data
        if (!first_name || !mobile || !email || !address) {
            return res.json({ success: false, message: 'All fields are required.' });
        }
    
        const user_id = req.session.user_id; // Assuming you have session middleware handling user sessions
        
    
        const sql = 'UPDATE app_login SET full_name = ?, email = ?, state_id = ?, city_id = ?, address = ?, pincode = ?, landmark = ? WHERE id = ?';
        const values = [first_name, email, state_name, city_name, address, pincode, locality, user_id];
    
        config.query(sql, values, (error, results) => {
            if (error) {
                console.error(error.message);
                return res.json({ success: false, message: 'An error occurred while updating your profile. Please try again.' });
            } else {
                return res.json({ success: true, message: 'You have successfully updated your profile.' });
            }
        });
    } else {

        var today = '"' + currentdate() + '"';
        var profiledata = `SELECT * FROM app_login WHERE id=${session.user_id}`;
        var query2 = "SELECT * FROM states where status = '1' ORDER BY state_name ASC";
        config.query(query2, function (err, state) {

            if (err) {
                console.error(err.message);
                return;
            }
            else {
                var state = state;
                
            }
            config.query(profiledata, (error, profiledetails) => {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else
                {
                    res.render('app/home/update-profile', { langtype: lang, profile: profiledetails,statelist:state,pagetitle: 'View Profile', pageactive: 'profile' });

                }
            
        
                });
        });
    }
};


exports.homestaysavefavourite = (req, res, next) => {

    const property_id = req.body.property_id;
    // Initialize the homestayfavorites array if it doesn't exist
    if (!req.session.homestayfavorites) {
        req.session.homestayfavorites = [];
    }

    // Check if the Property is already in the favorites list
    if (!req.session.homestayfavorites.includes(property_id)) {
        req.session.homestayfavorites.push(property_id);
        res.json({ success: true, message: 'Added in Favourite List ' });

    }
    else {
        res.json({ success: false, message: 'Already Added in Favourite List' });

    }


}

exports.homestayRemovefavourite = (req, res, next) => {

    const property_id = req.body.property_id;
    // Initialize the homestayfavorites array if it doesn't exist
    if (!req.session.homestayfavorites) {
        req.session.homestayfavorites = [];
    }

    // Remove the product from the homestayfavorites list
    req.session.homestayfavorites = req.session.homestayfavorites.filter(id => id !== property_id);
    res.json({ success: true, message: 'Removed Successfully ' });


}




exports.tourPackageBookingHistory = (req, res, next) => {

    lang = req.session.lang;
    session = req.session
    console.log(session);
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
    }
    res.render('app/bookingHistory/tourPackageBookingHistory', { langtype: lang, pagetitle: 'Bookings', pageactive: 'booking' });

}

exports.cabsBookingHistory = (req, res, next) => {

    lang = req.session.lang;
    session = req.session
    console.log(session);
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
    }
    res.render('app/bookingHistory/cabsBookingHistory', { langtype: lang, pagetitle: 'Bookings', pageactive: 'booking' });

}

exports.guideBookingHistory = (req, res, next) => {

    lang = req.session.lang;
    session = req.session
    console.log(session);
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
    }

    var guidequery = `select g.*,gbt.booking_type,gppm.name as pickup_point_name,s.slot_view,s.slot_price,s.from_slot,s.to_slot from guide_booking as g LEFT JOIN guide_booking_type as gbt ON gbt.id=g.booking_type_id LEFT JOIN guide_pickup_point_master as gppm ON gppm.id=g.pickup_point_id LEFT JOIN guide_slot as s ON s.id=g.slot_id WHERE g.transaction_status = 1 AND g.user_id=${session.user_id};`;
    config.query(guidequery, (error, guidequeryresult) => {
        if (error) {
            console.error(error.message);
            return;
        }
        else
        {
            res.render('app/bookingHistory/guideBookingHistory', { langtype: lang, guidedata: guidequeryresult, pagetitle: 'Bookings', pageactive: 'booking' });

        }
    });

}



exports.diyaBookingHistory = (req, res, next) => {

    lang = req.session.lang;
    session = req.session
    console.log(session);
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
    }

  var query = `SELECT b.*, s.state_name, c.city_name FROM book_diya_prashad as b LEFT JOIN states as s ON s.id = b.state LEFT JOIN cities as c ON c.id = b.city  WHERE b.payment_mode = 'online' AND b.user_id=${session.user_id} ORDER BY b.id DESC`; 


    config.query(query, (error, queryresult) => {
        if (error) {
            console.error(error.message);
            return;
        }
        else
        {
            res.render('app/bookingHistory/diyaBookingHistory', { langtype: lang, list: queryresult, pagetitle: 'Bookings', pageactive: 'booking' });

        }
    });

}
