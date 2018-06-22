const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const admin = require('./admin')
const {mongoose,User} = require('./schema/models')
const authRouter = require('./routes/auth');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'client/build')));
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/', authRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const day = 1000 * 60 * 60 * 24;
/*create ADMIN*/
const user = new User();
user.email = admin['email'];
user.password = admin['password'];
user.name = "Admin";
user.kind = "admin";
user.contact = admin['contact'];
user.status = 'Verified';
user.address = admin["address"];
user.save().then((a)=>{
    a.owner = a._id;
    a.save();
}).catch((e)=>{
    console.log('admin message: '+e.message);
});
/*End Admin*/
/*Clean unverified user*/
setInterval(function(){
    console.log('clean');
    User.find({}).then((users)=>{
       for(const a of users){
           if( new Date() - a._id.getTimestamp()>= day && a.status=="NotVerified") {
               User.findByIdAndRemove(a);
               console.log('deleted '+a);
           }
       }
    });
},day);
/*Clean unverified user end*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({error: "Server Error"});
    // res.render('error');
});

module.exports = app;
