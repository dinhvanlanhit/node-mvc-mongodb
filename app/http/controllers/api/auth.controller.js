'use strict'
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const User = require('../../../models/user/user.model');
const common = require('../../../utils/common');
const config = require('./../../../../config/config');
exports.register = async (req, res, next) => {
  try {
      let payload = req.body;
      payload.activationKey = uuidv4()+uuidv4()+uuidv4();
      const link = `${config.app.hostname}/api/auth/account-verification?activationKey=${payload.activationKey}`;
      const sendMail = await common.sendMail({
        template:{
          path:"mailRegister.ejs",
          data:{
            ConfirmAccount:req.__('Confirm Account'),
            Welcome:req.__('Welcome'),
            title:req.__("Click the link below to activate your account"),
            link:link,
            fullname:payload.fullname
          }
        },
        to:payload.email
      });
      if(sendMail.error){
        const user = new User(payload);
        const savedUser = await user.save();
        return res.success(savedUser);
      }else{
        return res.status(500).error(sendMail,req.__("The server cannot perform your operations at this time"));
      }
  }catch (error) {
      return res.error(error.message);
  }
}
exports.login = async (req, res, next) => {
  try {
    const user = await User.auth(req.body);
    if(user){
      const JWT = res.JWT(user);
      return res.success(JWT);
    }else{
      return res.error(`${req.__("Login information is incorrect")}`);
    }
  } 
  catch (error){
    return res.error(error.message);
  }
}
exports.confirm = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
        { 'activationKey': req.query.key },
        { 'active': true,'activationKey': null }
    );
    return res.success(`${req.__("Successful account activation")}`);
  } catch (error) {
    return res.error(error.message);
  }
}