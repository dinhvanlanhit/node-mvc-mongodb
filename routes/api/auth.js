
const express = require('express')
const router = express.Router()
const auth = require('../../app/http/middleware/authorization');
const authController = require('../../app/http/controllers/api/auth.controller');
const {loginValidator,registerValidator,accountVerificationValidator} = require('../../app/http/validators/auth/authValidator')
router.post('/login',loginValidator,authController.login);
router.post('/register',authController.register);
router.get('/account-verification',accountVerificationValidator,authController.confirm);
module.exports = router
