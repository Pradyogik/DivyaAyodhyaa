const crypto = require('crypto');
const axios = require('axios');
const https = require('https');
const fs = require('fs');


var config      = require('./../config');

// Replace 'your-secret-key' with your own secret key
let ENCRYPTION_KEY = 'your-secret-key';

// Pad or truncate the key to ensure it has a length of 32 bytes
while (ENCRYPTION_KEY.length < 32) {
    ENCRYPTION_KEY += '0';
}

const IV_LENGTH = 16;
// Function to encrypt data
global.encrypt = function (id) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    const encrypted = cipher.update(id.toString(), 'utf-8', 'hex') + cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Function to decrypt data
global.decrypt = function (encryptedId) {
    const [iv, encrypted] = encryptedId.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
    const decrypted = decipher.update(encrypted, 'hex', 'utf-8') + decipher.final('utf-8');
    return decrypted;
}


global.paginate = function(query, pageNumber, pageSize, callback) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    config.query(query, function (error, results) {
        if (error) throw error;

        const paginatedData = results.slice(startIndex, endIndex);
        callback(paginatedData, results.length);
    });
    
}


global.procedurePaginate = function(query, pageNumber, pageSize, callback) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    config.query(query, function (error, queryResult) {
        if (error) throw error;
        results = queryResult[0];
        const paginatedData = results.slice(startIndex, endIndex);
        callback(paginatedData, results.length);
    });
    
}

//This function use for only date formate d-m-Y
global.formatDatedmy = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
}



/*
==================================================
current date time function
==================================================  
*/


global.currentdatetime = function () {
    const moment = require('moment-timezone');

// Set the time zone to Asia/Kolkata
const asiaKolkataTime = moment.tz('Asia/Kolkata');

// Get the current time in the Asia/Kolkata time zone
const currentTime = asiaKolkataTime.format('YYYY-MM-DD HH:mm:ss');
    return (currentTime);

}

/*
==================================================
current date  function
==================================================  
*/
global.currentdate = function () {
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    // prints date in YYYY-MM-DD format
    return (year + "-" + month + "-" + date);

}


//This function use for only date Time formate d-m-Y H:i:s
global.formatDatedmyhis = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    // current hours
    let hours = d.getHours();

    // current minutes
    let minutes = d.getMinutes();

    // current seconds
    let seconds = d.getSeconds();

    // prints date in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return (day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds);

    //return [day, month, year].join('-');
}



/*
==================================================
Manage Date  function
==================================================  
*/
global.managedate = function (days) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate()  +days);
    return (currentDate);
}


//This function use for only date formate Y-m-d
global.formatDateymd = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/*
==================================================
send SMS
==================================================  
*/
global.sendSMS = function (msg, mobile) {
    
   
    otpUrl = " https://webpostservice.com/sendsms_v2.0/sendsms.php?apikey=YXlvZGh5YWRhOlhFSk9JRktC&type=TEXT&mobile=" + mobile + "&sender=ADAAYO&message=" + msg;
    console.log(otpUrl);
    var options = {
        url: otpUrl
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
    axios(options, callback);
}

global.limitStringWithDot = function(inputString, maxLength) {
    if (inputString.length <= maxLength) {
        return inputString;
    } else {
        return inputString.substring(0, maxLength - 3) + '...';
    }
}


/// sesion by App
global.manageSessionByApp = function (req, res, category_id, user_id) {
    var category_id = category_id;
    var user_id = '"'+ user_id +'"';
    var sessionquerys = "SELECT * FROM app_login  WHERE id="+user_id;
    console.log(sessionquerys);
    config.query(sessionquerys, function (error, sessdatas) {

        if (error) {
            console.error(error.message);
            return;
        }

        else if (sessdatas.length > 0) {

             //User_id
             req.session.user_id = sessdatas[0].id;
             // User Role
             req.session.role_id = sessdatas[0].role_id;
             // User type
             req.session.stayhomeayodhya = 'stayhomeayodhya';
             // Session Type App or WEB
             req.session.user_type = 'app';
             //User Login ID
             req.session.email = sessdatas[0].email;
             //User role Name
             req.session.mobile = sessdatas[0].mobile;
             //User full name
             req.session.fullname = sessdatas[0].full_name;
             if(category_id == 8)
             {
                res.redirect('/sourvenir');

             }
             else{
               
                res.redirect('/stay-ayodhya');

             }
          

        }


        else {

           
            if(category_id == 8)
             {
                res.redirect('/sourvenir');

             }
             else{
               
                res.redirect('/stay-ayodhya');

             }
           
         }

});
}


global.paymentreverify = async function(orderNo) 
{
    const workingKey = '098D07AA2F26085CB075DC91552C48DD'; // Shared by CCAVENUES
    const accessCode = 'AVDL66LB55CG77LDGC';

    const merchantJsonData = {
        order_no: orderNo
    };

    const merchantData = JSON.stringify(merchantJsonData);
    const encryptedData = paymentEncrypt(merchantData, workingKey);
    const finalData = `enc_request=${encryptedData}&access_code=${accessCode}&command=orderStatusTracker&request_type=JSON&response_type=JSON&version=1.2`;

    try {
        const response = await  axios.post('https://api.ccavenue.com/apis/servlet/DoWebTrans', finalData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const information = response.data.split('&');
       
        
        let status;
        for (let i = 0; i < information.length; i++) {
            const infoValue = information[i].split('=');
            if (infoValue[0] === 'enc_response') {
                status = paymentDecrypt(infoValue[1], workingKey);
                break;
            }
        }
       

        return JSON.parse(status);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


function paymentEncrypt (plainText, workingKey) {
	var m = crypto.createHash('md5');
    	m.update(workingKey);
		
   	var key = m.digest('VishnuKant');
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
		iv.toString('hex').slice(0, 32);
		
	var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
	var encoded = cipher.update(plainText,'utf8','hex');
	encoded += cipher.final('hex');
    	return encoded;
};


function paymentDecrypt (encText, workingKey) {
	var m = crypto.createHash('md5');
    	m.update(workingKey);
		
	var key = m.digest('VishnuKant');
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
	var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    	var decoded = decipher.update(encText,'hex','utf8');
	decoded += decipher.final('utf8');
    	return decoded;
};

// Function to encode an ID to a fixed-length string
global.sortEncodeId = function(id) {
    // Convert ID to base64
    const base64Id = Buffer.from(id.toString()).toString('base64');
    // Take first 4 characters
    return base64Id.substr(0, 4);
}

// Function to decode a string back to the original ID
global.sortDecodeId = function(encodedId) {
    // Pad the encoded ID to make it a multiple of 4
    const paddedEncodedId = encodedId.padEnd(4, '=');
    // Convert from base64
    return Buffer.from(paddedEncodedId, 'base64').toString();
}


global.fileupload = function (path, filename, filepost, callback) {
    var filePermission = 777;
    fs.access(path, (error) => {
        if (error) {
            fs.mkdirSync(path, { recursive: true }, { mode: filePermission }, (error) => {
                if (error) {
                    console.error(error.message);
                    return;
                }
            });
        }


        var filemovepath = path;
        var insertfileName = filename;
        filepost.mv(filemovepath + '/' + insertfileName, function (error) {
            if (error) {
                console.error(error.message);
                return;
            }

        });

    });

    var fullpath = path + '/' + filename;
    var fullpathwithfilename = fullpath.slice(0);
    callback(fullpathwithfilename);

}

global.truncateString = function(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    }
    return str;
}