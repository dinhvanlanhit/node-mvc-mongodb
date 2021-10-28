
const express = require('express')
const router = express.Router()
const auth = require('../../app/http/middleware/authorization');
const authController = require('../../app/http/controllers/api/auth.controller');
const {loginValidator,registerValidator} = require('../../app/http/validators/auth/authValidator')
// Routers
router.post('/login',loginValidator,authController.login);
router.post('/register',registerValidator,authController.register);
router.get('/confirm',authController.confirm);
router.get('/testtoken',auth(),authController.testtoken);
module.exports = router
