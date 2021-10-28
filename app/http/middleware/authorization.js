'use strict'
const passport = require('passport')
const APIError = require('../../utils/APIError')
const httpStatus = require('http-status')
const bluebird = require('bluebird')
// handleJWT with roles
const handleJWT = (req, res, next, roles) => async (err, user, userInfo) => {
  console.log(res);
  const error = err || userInfo
  const logIn = bluebird.promisify(req.logIn)
  const apiError = new APIError( error ? error.message : 'Unauthorized',httpStatus.UNAUTHORIZED)
  try {
      if (error || !user) throw error
      await logIn(user, { session: false });
      req.user = user
      return next()
  } catch (e) {
      return next(apiError)
  }
}
// exports the middleware
const authorize = () => (req, res, next) =>passport.authenticate('jwt',{ session: false },
handleJWT(req, res, next))(req, res, next)
module.exports = authorize
