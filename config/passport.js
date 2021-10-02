'use strict'
const config = require('./config')
const User = require('../app/models/user.model')
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.sub, (err, user) => {
    if (err) {
      return done(err, null)
    }
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  });
});
exports.jwtOptions = jwtOptions
exports.jwt = jwtStrategy
