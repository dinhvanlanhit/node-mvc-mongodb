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
const common = require('./app/utils/common');
const passportJwt = require('./config/passport');
const appRouter = require('./routes/app/index');
const apiRouter = require('./routes/api/index');
const app = express();
app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())
app.use(function (req, res, next) {
    res.locals.__ = res.__;
    mongoose.connect();
    common.responseCustom(req, res, next);
});
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use('/', appRouter);
app.use('/api', apiRouter);
passport.use('jwt', passportJwt.jwt)
app.use(errorHandler.handleNotFound)
app.use(errorHandler.handleError)
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;