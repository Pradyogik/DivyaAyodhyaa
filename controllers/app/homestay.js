var config = require('../../config');
var common = require('../../common_function/common');

exports.index = (req, res, next) => {
    lang = req.session.lang;
    session = req.session;
   
  /*Code for check availability start here*/
    if(!session.availabilityParameters)
       {
           var sanprtObj = '';
           var currentDate     = new Date(); 
           var todayDate       = currentDate.getDate();
           var dateAfterOneDay = currentDate.setDate(currentDate.getDate()+1);
           var dateAfterTwoDay = currentDate.setDate(currentDate.getDate()+2);
           var date1 = new Date(dateAfterOneDay);
           var date2 = new Date(dateAfterTwoDay);
           var checkin_date  = date1.toLocaleDateString('sv'); 
           var checkout_date = date2.toLocaleDateString('sv'); 
           var num_adults = 2;
           var num_child = 0;
           var num_room = 1;

           sanprtObj = {checkInDate:checkin_date,checkOutDate:checkout_date,numAdults:num_adults, numChild:num_child,numRoom:num_room };
           req.session.availabilityParameters = sanprtObj;
        }
        else
        {
          var sanprtObj = session.availabilityParameters;
        }  

        /*Code for check availability end here*/

            let chkinDat        = sanprtObj.checkInDate;
            let chkoutDat       = sanprtObj.checkOutDate;
            let nmAdlt          = sanprtObj.numAdults;
             let requiredRoomVal = parseInt(sanprtObj.numRoom);
   
            const pageSize = 10000;
            const currentPage = parseInt(req.query.page) || 1;
            const error = req.flash('error');
            const success = req.flash('success');

        
            var chkavailablity = "SELECT pr.id,pr.property_id,pr.room_category_id,pr.total_room,pr.number_of_adults_stay,pr.price_per_night,(SELECT sum(rb.number_of_room) FROM room_booking rb WHERE pr.id = rb.room_id AND '"+chkinDat+"' between rb.check_in_date AND rb.check_out_date AND rb.STATUS = 1 ) AS booked_room,(SELECT sum(blkdrm.number_of_room_blocked) FROM room_blocked blkdrm WHERE pr.id = blkdrm.room_id AND '"+chkinDat+"' between blkdrm.from_date AND blkdrm.to_date) AS blocked_room FROM property_rooms pr GROUP BY pr.property_id";

            config.query(chkavailablity, function (error, sanData) {
            if (error) {
                console.error(error.message);
                return;
            }
            else {
                var sanData = sanData;    
                
            }

                let totRoomVal = '';
                let bokdRoomVal = '';
                let blokdRoomVal = '';
                let bokPlusBlkVal = '';
                let availableRoomVal = '';
                let prtIdArr = [];
                let prtIdArrStr = 0;
               sanData.forEach(function(row) {
                    let proIdval    = row.property_id;
                    let totRomVal   = row.total_room;
                    let bokRomVal   = row.booked_room;
                    let blkRomVal   = row.blocked_room;
                    

                  if(totRomVal !== null)
                  {
                     totRoomVal   = parseInt(totRomVal);
                  }
                  else
                  {
                    totRoomVal    = 0;
                  }

                  if(bokRomVal !== null)
                  {
                    bokdRoomVal    = parseInt(bokRomVal);
                  }
                  else
                  {
                    bokdRoomVal    = 0;
                  }
                  if(blkRomVal !== null)
                  {
                    blokdRoomVal    = parseInt(blkRomVal);
                  }
                  else
                  {
                    blokdRoomVal    = 0;
                  }
                 
                  bokPlusBlkVal = bokdRoomVal + blokdRoomVal;
                  availableRoomVal  = totRoomVal - bokPlusBlkVal;
                  if(availableRoomVal >= requiredRoomVal )
                  {
                    prtIdArr.push(proIdval);
                  }
            });
                  
               if(prtIdArr.length > 0)
               {
                 prtIdArrStr = prtIdArr.toString();
               }

               req.session.pidsarrstr = prtIdArrStr;

             console.log(req.session.pidsarrstr);
               
                 // home stay
                  var query = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1 AND p.id IN("+prtIdArrStr+")   GROUP BY p.id";
                  //console.error(query);
            
                paginate(query, currentPage, pageSize, function (paginatedItems, totalPage) {
        
                if (error) {
                    console.error(error.message);
                    return;
                }
                 else {
                    var servicename = paginatedItems;
                   
                                
                }
                 // End home stay

                 // Container
                 var Container = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 3 AND pg.mark_as_main = 1 AND p.id IN("+prtIdArrStr+")   GROUP BY p.id";
                 //console.error(Container);
           
               paginate(Container, currentPage, pageSize, function (Containerlis, totalPage) {
       
               if (error) {
                   console.error(error.message);
                   return;
               }
                else {
                  var conatinerlist = Containerlis;              
               }
                // End Container


                // home Hotel
                var Hotel = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 2 AND pg.mark_as_main = 1 AND p.id IN("+prtIdArrStr+")   GROUP BY p.id";
                //console.error(Hotel);
          
              paginate(Hotel, currentPage, pageSize, function (Hotelss, totalPage) {
      
              if (error) {
                  console.error(error.message);
                  return;
              }
               else {
                 
                  var hotelslist = Hotelss;
                              
              }
               // End Hotel

               // Dormitory
               var Dormitory = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 4  AND pg.mark_as_main = 1 AND p.id IN("+prtIdArrStr+")   GROUP BY p.id";
               //console.error(Dormitory);
         
             paginate(Dormitory, currentPage, pageSize, function (Dormitoryss, totalPage) {
     
             if (error) {
                 console.error(error.message);
                 return;
             }
              else {
                 
                 var dormitorylist = Dormitoryss;
                             
             }
              // End home stay


            var error = req.flash('error');
            var success = req.flash('success');
            res.render('app/homestay/index', { error, success, homestaylist: servicename, conatinerlist: conatinerlist, hotelslist: hotelslist, dormitorylist: dormitorylist, currentPage, totalPages: Math.ceil(totalPage / pageSize), pageSize,pagetitle: 'Book Accomodation', langtype: lang, pageactive: 'home'  });
        
        }); 
        }); 
        }); 
        });    
        });    
    
};


/*code start here for search AJAX CALL */

exports.propertySearch = (req, res, next) => {
    
    var pidsStr = req.session.pidsarrstr;
    const searchdata = req.query.SearchInput;
    var pageSize = 12;
    var currentPage = parseInt(req.query.page) || 1;
    var sql = '';
   

    if (searchdata != '') {
        var sql = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1 AND (p.property_name LIKE '%"+searchdata+"%' OR p.address LIKE '%"+searchdata+"%' OR pr.price_per_night LIKE '%"+searchdata+"%') AND p.id IN("+pidsStr+") GROUP BY p.id";

    }
    else {
        var sql = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1 AND p.id IN("+pidsStr+") GROUP BY p.id ";
    }
    
  
    console.log('vishnu sir test');
    console.log(sql);

    paginate(sql, currentPage, pageSize, function (paginatedItems, totalPage) {

        results = paginatedItems;
        console.log(results);

        var totalPages = Math.ceil(totalPage / pageSize);

        var prtsandata = '';

        if (results.length > 0) {
           
             stayhomeimageUrl = stayhomeimageUrl;
            for (let l of results) {

                var propertyId = encrypt(l.id.toString());
                
                prtsandata += '<a href="/stay-ayodhya/property-rooms/'+propertyId+'"><div class="maghny-gd-1 col-lg-3 col-md-4" style="margin-bottom: 25px;">'
                            +'    <div class="maghny-grid">'
                            +'        <figure class="effect-lily">'
                            +'            <img class="img-fluid" src="'+stayhomeimageUrl+ l.image_path+'" alt="">'
                            +'            <figcaption>'
                            +'                <div>'
                            +'                    <h4 class="top-text">'+l.property_name
                            +'                        <ul>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star-o"></span></li>'
                            +'                        </ul>'
                            +'                    </h4>'
                            +'                    <p>Start Price <i class="fa fa-inr"></i>  '+l.start_price+'</p>'
                            +'                </div>'
                            +'            </figcaption>'
                            +'        </figure>'
                            +'        <div class="room-info">'
                            +'            <h3 class="room-title"><a href="/stay-ayodhya/property-rooms/'+propertyId+'">'+l.property_name+'</a></h3>'
                            +'        <ul class="">'
                            +'                <li><span class="fa fa-map-marker"></span>'+l.distance_from_ram_mandir+'</li>'
                            +'            </ul>'
                            +'            <p>'+l.address+'...</p>'
                            +'            <a href="/stay-ayodhya/property-rooms/'+propertyId+'" class="btn mt-3">Ayodhya</a>'
                            +'            <div class="room-info-bottom">'
                            +'                <ul class="room-amenities">'
                            +'                        <li><a href="#url"><span class="fa fa-bed" title="Beds"></span></a></li>'
                            +'                        <li><a href="#url"><span class="fa fa-television" title="Television"></span></a></li>'
                            +'                        <li><a href="#url"><span class="fa fa-bath" title="Private Bathroom"></span></a></li>'
                            +'                        <li><a href="#url"><span class="fas fa-parking" title="Bike Rental"></span></a></li>'
                            +'                    </ul>'
                            +'                <a href="/stay-ayodhya/property-rooms/'+propertyId+'" class="btn view">View Rooms →</a>'
                            +'            </div>'
                            +'        </div>'
                            +'    </div>'
                            +'</div></a>';

            }

           
            prtsandata += '<center>';
            prtsandata += '<ul class="newpagination modal-4">';
            var reamin = totalPages * pageSize;
            if (reamin > pageSize) {
                if (currentPage > 1) {
                    var minusone = 1;
                    prtsandata += '<li><a onclick="getpagenumber('+ Math.ceil(currentPage - minusone) +')" class="prev"><i class="fa fa-chevron-left"></i> Previous</a></li>';
                }
                for (var i = 1; i <= totalPages; i++) {
                    if (i <= 6) {
                        prtsandata += '<li><a onclick="getpagenumber('+ i +')"  class="'+ (i === currentPage ? 'active' : '')+'">' + i + '</a></li>';
                    } 
                    else if (currentPage == i) {
                        prtsandata += '<li><a onclick="getpagenumber('+ i +')"  class="'+ (i === currentPage ? 'active' : '')+'">' + i + '</a></li>';

                        break;
                    }
                }

                if (currentPage >= 5) {
                    if (currentPage != totalPages) {
                        if (currentPage != totalPages - 1) {
                            prtsandata += '<li><a href="javascript:void(0)" class="">...</a></li>';
                        }
                        prtsandata += '<li><a onclick="getpagenumber('+ totalPages +')">' + totalPages + '</a></li>';

                    }
                }


                if (currentPage < totalPages) {
                    var plusone = 1;
                   
                    prtsandata += '<li><a  onclick="getpagenumber('+ Math.ceil(currentPage + plusone) +')" class="next"> Next  <i class="fa fa-chevron-right"></i></a></li>';
                }
                

            }

            prtsandata += '</ul>';
            prtsandata += '</center>';
            
        }

        else {
            var prtsandata = '<center><h5>No Record Found...</h5></center>';

        }
       

        //console.log(prtsandata);

        res.send(prtsandata);


    });
};


exports.loadmoreproperty = (req, res, next) => {
   
    var pidsStr = req.session.pidsarrstr;
    const searchdata = '';
    const start = req.body.start;
    var pageSize = 12;
    var currentPage = start;
    var sql = '';

   
   var sql = "SELECT p.*, MIN(pr.price_per_night) AS start_price, pg.image_path, c.city_name FROM property AS p LEFT JOIN property_rooms AS pr ON p.id = pr.property_id LEFT JOIN cities AS c ON c.id = p.city_id LEFT JOIN property_gallery AS pg ON p.id = pg.property_id WHERE p.status = 1 AND p.is_deleted = 0 AND p.property_type = 1 AND pg.mark_as_main = 1 AND p.id IN("+pidsStr+") GROUP BY p.id limit "+start+" , 12";
    console.log(sql);

    config.query(sql, function (error, paginatedItems) {

        results = paginatedItems;
        //console.log(results);

       

        var prtsandata = '';

        if (results.length > 0) {
           
             stayhomeimageUrl = stayhomeimageUrl;
            for (let l of results) {

                var propertyId = encrypt(l.id.toString());
                
                prtsandata += '<a href="/stay-ayodhya/property-rooms/'+propertyId+'" ><div class="maghny-gd-1 col-lg-3 col-md-4" style="margin-bottom: 25px;">'
                            +'    <div class="maghny-grid">'
                            +'        <figure class="effect-lily">'
                            +'            <img class="img-fluid" src="'+stayhomeimageUrl+ l.image_path+'" alt="">'
                            +'            <figcaption>'
                            +'                <div>'
                            +'                    <h4 class="top-text">'+l.property_name
                            +'                        <ul>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star"></span></li>'
                            +'                            <li> <span class="fa fa-star-o"></span></li>'
                            +'                        </ul>'
                            +'                    </h4>'
                            +'                    <p>Start Price <i class="fa fa-inr"></i>  '+l.start_price+'</p>'
                            +'                </div>'
                            +'            </figcaption>'
                            +'        </figure>'
                            +'        <div class="room-info">'
                            +'            <h3 class="room-title"><a href="/stay-ayodhya/property-rooms/'+propertyId+'">'+l.property_name+'</a></h3>'
                            +'        <ul class="">'
                            +'                <li><span class="fa fa-map-marker"></span>'+l.distance_from_ram_mandir+'</li>'
                            +'            </ul>'
                            +'            <p>'+l.address+'...</p>'
                            +'            <a href="/stay-ayodhya/property-rooms/'+propertyId+'" class="btn mt-3">Ayodhya</a>'
                            +'            <div class="room-info-bottom">'
                            +'                <ul class="room-amenities">'
                            +'                        <li><a href="#url"><span class="fa fa-bed" title="Beds"></span></a></li>'
                            +'                        <li><a href="#url"><span class="fa fa-television" title="Television"></span></a></li>'
                            +'                        <li><a href="#url"><span class="fa fa-bath" title="Private Bathroom"></span></a></li>'
                            +'                        <li><a href="#url"><span class="fas fa-parking" title="Bike Rental"></span></a></li>'
                            +'                    </ul>'
                            +'                <a href="/stay-ayodhya/property-rooms/'+propertyId+'" class="btn view">View Rooms →</a>'
                            +'            </div>'
                            +'        </div>'
                            +'    </div>'
                            +'</div></a>';

            }
            
        }
        else 
        {
            var prtsandata = '<center><h5>No Record Found...</h5></center>';
        }

        //console.log(prtsandata);

        res.send(prtsandata);


    });
};
exports.checkproperty = (req, res, next) => {

    session = req.session;
    var postdata = req.body;
    if(!postdata)
       {
           res.redirect('/homestay');
       }
       else
        {
           const moment = require('moment');
           const parsedDate1    = moment(postdata.checkin, 'DD-MM-YYYY');
           const formattedDate1 = parsedDate1.format('YYYY-MM-DD');
           const parsedDate2    = moment(postdata.checkout, 'DD-MM-YYYY');
           const formattedDate2 = parsedDate2.format('YYYY-MM-DD');
           var adults           = postdata.adults;
           var child            = postdata.child;
           var num_room         = postdata.num_room;

           sanprtObj = {checkInDate:formattedDate1,checkOutDate:formattedDate2,numAdults:adults, numChild:child,numRoom:num_room };
           req.session.availabilityParameters = sanprtObj;
           setTimeout(() => {  res.redirect('/homestay'); }, 3000);
       }
   
};


exports.roomlist = (req, res, next) => {
    lang = req.session.lang;
    session = req.session;
    var id = decrypt(req.params.id);
    if(!id)
    {
        redirect('/homestay');

    }
    const pageSize = 6;
            const currentPage = parseInt(req.query.page) || 1;
            const error = req.flash('error');
            const success = req.flash('success');

            var query = "SELECT pr.*, rg.room_image, rtm.name as room_category_name, ps.property_name,btm.name as bedtype FROM property_rooms as pr LEFT JOIN room_gallery as rg ON pr.id = rg.room_id LEFT JOIN room_type_master as rtm ON rtm.id = pr.room_category_id LEFT JOIN property as ps ON pr.property_id = ps.id LEFT JOIN bed_type_master as btm ON btm.id = pr.type_of_bed WHERE pr.property_id =" +id+ " AND pr.status = 1 GROUP BY pr.id";

            console.log("query");
            console.log(query);
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
            res.render('app/homestay/room_listing', { error, success, hotellist: paginatedItems, currentPage, totalPages: Math.ceil(totalPage / pageSize), pageSize,pagetitle: 'Book Accomodation', langtype: lang, pageactive: 'home'  });
        
        });    
    
};


exports.booking = (req, res, next) => {
    lang = req.session.lang;
    session = req.session;
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
       }

    var room_id = decrypt(req.params.id);
    var property_id = decrypt(req.params.pro_id);
    console.log(room_id);
    console.log(property_id); 
    if((!room_id) && (!property_id))
    {
        res.redirect('/homestay');

    }

      var query = "SELECT pr.*,p.property_name,rtm.name as room_category_name FROM property_rooms as pr LEFT JOIN property as p ON p.id=pr.property_id LEFT JOIN room_type_master as rtm ON rtm.id = pr.room_category_id WHERE pr.id="+room_id; 
       config.query(query, function (error, data) {
        if (error) {
            console.error(error.message);
            return;
        }
        else {
               servicedetail = data;
             }
        console.log(servicedetail);
        var error = req.flash('error');
        var success = req.flash('success');
        res.render('app/homestay/booking-page', { error, success, hotellist: servicedetail,pagetitle: 'Booking', langtype: lang, pageactive: 'home'  });

    });
        
};


exports.checkRoomAvailability = (req, res, next) => {

    lang = req.session.lang;
    session = req.session;
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
       }

    if(req.method == 'POST')
    {
        var postdata = req.body;
        var room_id     = postdata.room_id;
        var property_id = postdata.property_id;
        if((!room_id) && (!property_id))
            {
                res.redirect('/homestay');
            }

        if((req.body.name == '') || (req.body.mobile == '') || (req.body.email == '') || (req.body.address == '') || (req.body.checkin == '') || (req.body.checkout == '') || (req.body.adults == '') )
        {
            req.flash('error', 'All Fields Required');
            res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
        }
        const moment = require('moment');
        
        const parsedDate1 = moment(postdata.checkin, 'DD-MM-YYYY');
        const formattedDate1 = parsedDate1.format('YYYY-MM-DD');

        const parsedDate2 = moment(postdata.checkout, 'DD-MM-YYYY');
        const formattedDate2 = parsedDate2.format('YYYY-MM-DD');

        var date1 = new Date(formattedDate1);
        var date2 = new Date(formattedDate2);
        if(date1 >= date2)
        {
            req.flash('error', 'Check-In Date Less than Check-Out Date Please Try Again');
            res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));  
        }
        
        var userNam = postdata.name;
        var userMobil = postdata.mobile;
        var numOfPerson = parseInt(postdata.adults);
        var num_room    = parseInt(postdata.num_room);

        var query = "SELECT pr.id,pr.property_id,pr.room_category_id,pr.total_room,pr.number_of_adults_stay,pr.price_per_night,(SELECT sum(rb.number_of_room) FROM room_booking rb WHERE pr.id = rb.room_id AND '"+formattedDate1+"' between rb.check_in_date AND rb.check_out_date AND rb.STATUS = 1 ) AS booked_room,(SELECT sum(blkdrm.number_of_room_blocked) FROM room_blocked blkdrm WHERE pr.id = blkdrm.room_id AND '"+formattedDate1+"' between blkdrm.from_date AND blkdrm.to_date) AS blocked_room,(SELECT room_image FROM room_gallery rg WHERE pr.id = rg.room_id AND rg.mark_as_main=1 ) AS room_image,(SELECT name FROM room_type_master rtm WHERE pr.room_category_id = rtm.id ) AS room_category_name FROM property_rooms pr WHERE pr.id ="+room_id;

            config.query(query, function (error, data) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    servicedetail = data;               
                }
                console.error(servicedetail);
                var availableRoom = '';
                var personCapacity = '';
                var totroom = 0;
                var bokdRoom = 0;
                var blokdRoom = 0;
                var otRom = 0;
                var bokRom = 0;
                var blkRom = 0;
                var bokPlusBlk = 0;
                var sanpreetObj = '';
               if(servicedetail.length > 0)
                {
                  totRom = servicedetail[0].total_room;
                  bokRom = servicedetail[0].booked_room;
                  blkRom = servicedetail[0].blocked_room;
                 
                  if(totRom !== null)
                  {
                     totroom   = parseInt(totRom);
                  }

                  if(bokRom !== null)
                  {
                    bokdRoom    = parseInt(bokRom);
                  }
                  if(blkRom !== null)
                  {
                    blokdRoom    = parseInt(blkRom);
                  }
                 
                  bokPlusBlk = bokdRoom + blokdRoom;
                  availableRoom  = totroom - bokPlusBlk;
                  personCapacity = parseInt(servicedetail[0].number_of_adults_stay);
                  pricePerNigt   = parseInt(servicedetail[0].price_per_night);
                  
                    
                  if(personCapacity >= numOfPerson)
                  {
                    var requiredRoom = 1;
                  }
                  else
                  {
                    var sanVal  = numOfPerson / personCapacity;
                    var preetVal  = Math.ceil(sanVal);
                    var requiredRoom = preetVal; 
                  }

                  if(num_room > requiredRoom)
                  {
                    requiredRoom = num_room;
                  }

                  if(availableRoom >= requiredRoom )
                  {
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    var gstAmt = 0;
                    var otherAmt = 0;
                    var roomAmt  = pricePerNigt * requiredRoom * numberOfNights;
                    var totAmt   = roomAmt + gstAmt + otherAmt;

                    var sanpreetObj = {gstAmt:gstAmt,otherAmt:otherAmt,numberOfNights:numberOfNights, requiredRoom:requiredRoom,numOfPerson:numOfPerson, pricePerNigt:pricePerNigt,roomAmt:roomAmt, totAmt:totAmt,room_id:room_id,property_id:property_id };
                    console.log(sanpreetObj);

                    var error = req.flash('error');
                    var success = req.flash('success');
                    res.render('app/homestay/booking-confirm-detail-page', { error, success, hotellist: servicedetail,postdetail: postdata,sanpreetObj:sanpreetObj,pagetitle: 'Booking Preview', langtype: lang, pageactive: 'home' });
                  }
                  else
                  {
                    req.flash('error', 'As per the number of staying persons requirement the room is not available.Please choose another room.');
                    res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
                  }

                  
                }
                else
                {
                  req.flash('error', 'Some thing went wrong,please try again latter.');
                  res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
                }

        });

    }
    else
    {
        res.redirect('/homestay');
    }
   
};



exports.postbooking = (req, res, next) => {

    lang = req.session.lang;
    session = req.session;
    if (!req.session.newDivyaAyodhyaApp) {
        res.redirect("/login");
       }

     var postdata = req.body;
     if(!postdata)
        {
            res.redirect('/homestay');
        }
    else
     {
       //console.log(postdata); return;
       const moment = require('moment');
        
       const parsedDate1 = moment(postdata.checkin, 'DD-MM-YYYY');
       const formattedDate1 = parsedDate1.format('YYYY-MM-DD');

       const parsedDate2 = moment(postdata.checkout, 'DD-MM-YYYY');
       const formattedDate2 = parsedDate2.format('YYYY-MM-DD');
       var date1 = new Date(formattedDate1);
       var date2 = new Date(formattedDate2);

        var formData = req.body;
        var room_id = formData.room_id;
        var property_id = formData.property_id;
        var user_id = session.user_id;
        var name = formData.name;
        var mobile = formData.mobile;
        var email = formData.email;
        var address = formData.address;
        var checkin = formattedDate1;
        var checkout = formattedDate2;
        var adults = formData.adults;
        var numOfPerson = formData.adults;
        var child = formData.child;
        var num_room = formData.number_of_room;

        var query = "SELECT pr.id,pr.property_id,pr.room_category_id,pr.total_room,pr.number_of_adults_stay,pr.price_per_night,(SELECT sum(rb.number_of_room) FROM room_booking rb WHERE pr.id = rb.room_id AND '"+formattedDate1+"' between rb.check_in_date AND rb.check_out_date AND rb.STATUS = 1 ) AS booked_room,(SELECT sum(blkdrm.number_of_room_blocked) FROM room_blocked blkdrm WHERE pr.id = blkdrm.room_id AND '"+formattedDate1+"' between blkdrm.from_date AND blkdrm.to_date) AS blocked_room,(SELECT room_image FROM room_gallery rg WHERE pr.id = rg.room_id AND rg.mark_as_main=1 ) AS room_image,(SELECT name FROM room_type_master rtm WHERE pr.room_category_id = rtm.id ) AS room_category_name FROM property_rooms pr WHERE pr.id ="+room_id;

            config.query(query, function (error, data) {
                if (error) {
                    console.error(error.message);
                    return;
                }
                else {
                    servicedetail = data;               
                }
                console.error(servicedetail);
                
               if(servicedetail.length == 0)
                {
                  req.flash('error', 'Some thing went wrong,please try again latter.');
                  res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
                }
                
                    var availableRoom = '';
                    var personCapacity = '';
                    var totroom = 0;
                    var bokdRoom = 0;
                    var blokdRoom = 0;
                    var otRom = 0;
                    var bokRom = 0;
                    var blkRom = 0;
                    var bokPlusBlk = 0;
                    var sanpreetObj = '';
                  totRom = servicedetail[0].total_room;
                  bokRom = servicedetail[0].booked_room;
                  blkRom = servicedetail[0].blocked_room;
                 
                  if(totRom !== null)
                  {
                     totroom   = parseInt(totRom);
                  }

                  if(bokRom !== null)
                  {
                    bokdRoom    = parseInt(bokRom);
                  }
                  if(blkRom !== null)
                  {
                    blokdRoom    = parseInt(blkRom);
                  }
                 
                  bokPlusBlk = bokdRoom + blokdRoom;
                  availableRoom  = totroom - bokPlusBlk;
                  personCapacity = parseInt(servicedetail[0].number_of_adults_stay);
                  pricePerNigt   = parseInt(servicedetail[0].price_per_night);
                  
                    
                  if(personCapacity >= numOfPerson)
                  {
                    var requiredRoom = 1;
                  }
                  else
                  {
                    var sanVal  = numOfPerson / personCapacity;
                    var preetVal  = Math.ceil(sanVal);
                    var requiredRoom = preetVal; 
                  }

                  if(num_room > requiredRoom)
                  {
                    requiredRoom = num_room;
                  }

                  if(availableRoom < requiredRoom )
                  {
                    req.flash('error', 'As per the number of staying persons requirement the room is not available.Please choose another room.');
                    res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
                   }
                  
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var gstAmt = 0;
            var otherAmt = 0;
            var roomAmt  = pricePerNigt * requiredRoom * numberOfNights;
            var totAmt   = roomAmt + gstAmt + otherAmt;

            var number_of_room  = requiredRoom;
            var price_per_night = pricePerNigt;
            var roomAmt  = pricePerNigt * requiredRoom * numberOfNights;
            var totAmt   = roomAmt + gstAmt + otherAmt;
            var created_date    = currentdatetime();
            var total_guest     = parseInt(adults) + parseInt(child);
            
            const bookingMode = 1;
            const timestampss = Date.now();
            const rand_number = Math.floor(100000 + Math.random() * 900000);
            const booking_number =  timestampss + rand_number;
            const timestamp = Date.now().toString();
            const randomString = Math.random().toString(36).substring(2, 8);
            const orderId =  timestamp + randomString;

        var sanquery = "INSERT INTO room_booking (user_id,property_id,room_id,order_id,booking_number,visitor_name,visitor_email,visitor_phone,visitor_address,number_of_adults,number_of_child,number_of_room,check_in_date,check_out_date,price_per_night,total_payable_amount,created_date,total_guest,gst,other_taxes,total_night,booking_mode) VALUES ?";
        var sanArr = [
            [session.user_id,property_id,room_id,orderId,booking_number,name,email,mobile,address,adults,child,number_of_room,checkin,checkout,price_per_night,totAmt,created_date,total_guest,gstAmt,otherAmt,numberOfNights,bookingMode]
        ];
        console.log(sanArr);
        //process.exit(0);
        var bookingId;
        config.query(sanquery,[sanArr],function(error,result){
            console.log(result);
            if (error) 
            {
                console.error(error.message);
                req.flash('error', 'Some thing went wrong,please try again latter.');
                res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
            }
            

                var redirctid = result.insertId;
                var bookingId = result.insertId;
                console.log(bookingId);

                var bookDtailQry = "INSERT INTO room_booking_payment_details (room_booking_id,payment_mode,payment_medium,pay_amount) VALUES ?";
                    var sanDetailArr = [
                        [bookingId,1,1,totAmt]
                    ];

             config.query(bookDtailQry,[sanDetailArr],function(error,result){
                console.log(result);
                if (error) 
                {
                    console.error(error.message);
                    req.flash('error', 'Something went wrong while booking details info gathering.');
                    res.redirect("/stay-ayodhya/booking/" + encrypt(room_id) + '/' + encrypt(property_id));
                }


                //req.flash('success', 'Booking has been created successfully.');
                res.redirect("https://divyaayodhya.com/stay-ayodhya/NewAppPayment/begin/" + redirctid);


              });
            
       
        });  
        });  

    }
    
           

   
};