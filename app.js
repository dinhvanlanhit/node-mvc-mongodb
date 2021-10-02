const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('./database/mongoose')
const i18n = require('./config/i18n.js');
const errorHandler = require('./app/http/middleware/error-handler');
const passportJwt = require('./config/passport');
const appRouter = require('./routes/app/index');
const apiRouter = require('./routes/api/index');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');
app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())
app.use('/', appRouter);
app.use('/api', apiRouter);
app.use(passport.initialize())
passport.use('jwt', passportJwt.jwt)
app.use(errorHandler.handleNotFound)
app.use(errorHandler.handleError)
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
mongoose.connect();
module.exports = app;