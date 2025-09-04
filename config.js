var mysql = require('mysql');

var config = mysql.createConnection({
  host: "database-1.chciq0eeey32.ap-south-1.rds.amazonaws.com",
  user: "divyaayodhya",
  password: "Jaihind$$321##",
  database: "divyaayodhya",
  multipleStatements: true
});

config.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = config;