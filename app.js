/*======================================
Include file section
========================================*/
var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
const session       = require('express-session');
var flash 	        = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
global.stayhomeimageUrl = 'https://ayodhay.s3.ap-south-1.amazonaws.com/divyaayodhya';
var upload  = require('express-fileupload');


var app = express();


const options = {
  host: "database-1.chciq0eeey32.ap-south-1.rds.amazonaws.com",
  user: "divyaayodhya",
  password: "Jaihind$$321##",
  database: "divyaayodhya",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'id',
      expires: 'expires',
      data: 'data'
    }
  }
};



const store = new MySQLStore(options);
/*=============================================
Session maintain for a day
==============================================*/

const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(session({
    secret: "divyaayodyaapp@$12547!*%&$####@@@!!!",
    saveUninitialized:true,
    cookie: { maxAge: null },
    resave: false,
    //store: store
}));

app.use(cookieParser());
app.use(upload());
app.use(flash());
/*======== End Session Maintain ==============*/
/*=========Template Engin Section=============*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*===========================================*/


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// Load language files
const languages = {
  en: require('./languages/en.json'),
  hi: require('./languages/hi.json')
};


// Middleware to set the language
app.use((req, res, next) => {
  if (!req.session.lang) {
    req.session.lang = 'en'; // default language
  }
  res.locals.lang = languages[req.session.lang];
  next();
});

// Route to change language
app.get('/lang/:lang', (req, res) => {
  const lang = req.params.lang;
  if (languages[lang]) {
    req.session.lang = lang;
  }
  res.redirect('/');
});




/*==============================================
Router Section
===============================================*/
var appRoute  = require('./routes/appRoute');

app.use('/', appRoute);

/*============= END Router=====================*/



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(5002,'0.0.0.0',function(){
	console.log('Server is running port:5002');
});

module.exports = app;