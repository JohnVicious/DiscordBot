require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);


//Declare bot and login
var discordBot = require('./bot.js');
var bot = new discordBot();
bot.login();


//Declare app
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//Set our bot
app.set('bot', bot);


//Configuring handlebars
app.engine('hbs', hbs({
	extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials')
    ]
}));


//Database options
var options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};


//Creating session store
var sessionStore = new MySQLStore(options); 


//Use our session
app.use(session({
	name: 'discordBot_sessionid',
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    cookie: {
		secure: (process.env.DB_DATABASE === 'true' ? true : false), 
		maxAge: null, 
		httpOnly: false,
		sameSite: (process.env.DB_DATABASE === 'true' ? true : false)
	},
    resave: false,
    saveUninitialized: false
}));


//Use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));


//Create our routes
var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var amongUsRouter = require('./routes/amongus');
app.use('/AmongUs', amongUsRouter);


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

module.exports = app;
