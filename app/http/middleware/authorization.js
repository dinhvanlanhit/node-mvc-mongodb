'use strict'

const User = require('../../models/user.model')
const passport = require('passport')
const APIError = require('../../utils/APIError')
const httpStatus = require('http-status')
const bluebird = require('bluebird')
// handleJWT with roles
const handleJWT = (req, res, next, roles) => async (err, us, info) => {
  const error = err || info
  console.log(us);
  const logIn = bluebird.promisify(req.logIn)
  const apiError = new APIError(
    error ? error.message : 'Unauthorized',
    httpStatus.UNAUTHORIZED
  )
  try {
    if (error || !us) throw error
    await logIn(us, { session: false })
  } catch (e) {
    return next(apiError)
  }
  // if (!roles.includes(us.role)) {
  //   return next(new APIError('Forbidden', httpStatus.FORBIDDEN))
  // }
  req.us = us
  return next()
}
// exports the middleware
const authorize = (roles = User.roles) => (req, res, next) =>passport.authenticate('jwt',{ session: false },
handleJWT(req, res, next, roles))(req, res, next)
module.exports = authorize
