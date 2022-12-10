require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs=require('express-handlebars')
const HBS=hbs.create({})
var db=require('./config/connection')
var session=require('express-session')
//its used to store session in hosting db
const { CyclicSessionStore } = require("@cyclic.sh/session-store");
var Handlebars=require('handlebars')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();
var fileUpload=require('express-fileupload');
const { dirname } = require('path');





//its used to remove cache of browser when clicking back button
app.use(function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   next();
 });
 


//handlebars custom helpers
 Handlebars.registerHelper("inc", function(value, options){
     return parseInt(value) + 1;
 });

 Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname + '/views/layout/', partialDir:__dirname + '/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

//its used to store session in hosting db
const options = {
  table: {
    name: process.env.CYCLIC_DB,
  },
  keepExpired:false,
  touchInterval: 30000,//30 second
  tt1:86400000 //one day
};

app.use(
  session({
    store: new CyclicSessionStore(options),
    secret:'key',
    resave:false,
    cookie:{maxAge:6000000,sameSite:'none'},
    saveUninitialized:false,
    

  })
);

// app.use(session({
//   secret:'key',
  
//  cookie: { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 48, sameSite: 'none' }
  
// }))

app.use('/', userRouter);
app.use('/admin', adminRouter);


db.connect((err)=>{
  if(err) console.log('connection error'+err);
  else console.log('database connected');
  app.listen(process.env.PORT,()=>{
    
    console.log('listening for request');
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
