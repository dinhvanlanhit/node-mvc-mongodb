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
            ConfirmAccount:req.__('LANG_00026'),
            Welcome:req.__('LANG_00025'),
            title:req.__("LANG_00023"),
            link:link,
            fullname:payload.fullname
          }
        },
        to:payload.email
      });
      if(sendMail.error){
        const user = new User(payload);
        const savedUser = await user.save();
        return res.success(savedUser,req.__("LANG_00015"));
      }else{
        return res.status(500).error(sendMail,req.__("LANG_00056"));
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
      return res.error(`${req.__("LANG_00008")}`);
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
    return res.success(`${req.__("LANG_00020")}`);
  } catch (error) {
    return res.error(error.message);
  }
}
exports.forgotPassword = async (req, res, next) => {
  const payload = req.body;
  const minutes = 5;
  let remember_value = payload.company_code+"-"+uuidv4()+uuidv4()+uuidv4()+uuidv4()+uuidv4()
  let remember_datetime = moment(new Date()).format("YYYY-MM-DD HH:mm");
  remember_datetime = moment(remember_datetime).add(minutes, "minutes") .format("YYYY-MM-DD HH:mm");
  const url = `${payload.url}?remember_value=${remember_value}`;
  try {
      const sendMail = await common.sendMail({
          to:payload.email,
          subject: req.__("Forgot Password"),
          body: `
              <div style="border: solid 3px #b5b5b5; padding: 15px;background-color: #fff;border-radius: 10px;">
                  <h1>${req.__("LANG_00016")} : ${payload.email}</h1>
                  <p><b>${req.__mf(
                      "LANG_00028",
                      { minutes: minutes }
                  )}</b></p>
                  <p>${req.__("LANG_00029")}:</p>
                  <p><b>${req.__("LANG_00034")} : <a href="${url}">${url}</a></b></p>
              </div>`,
      });
      if(sendMail.error){
            const result = await User.findOneAndUpdate(
                { email:payload.email,company_code:payload.company_code},{
                    $set: {
                        remember_value: remember_value,
                        remember_datetime: remember_datetime,
                    },
                },
                { new: true }
            ).exec();
            return res.success(req.__("LANG_00057"));
      } else {
            return res.error(sendMail.message);
      }
  } catch (error) {
      return res.error(error.message);
  }
};
exports.checkRememberValue = async (req, res, next) => {
    return res.success();
};
exports.changePassword=async (req, res, next) => {
  try {
    const result = await User.findOneAndUpdate(
      { remember_value: req.body.remember_value },
      {
          $set: {
              remember_value: null,
              remember_datetime: null,
              password: req.body.new_password,
          },
      },
      { new: true }
    ).exec();
    if(result){
        return res.success(`${req.__("LANG_00036")}`);
    }else{
        return res.error(`${req.__("LANG_00005")}`);
    }
  } catch (error) {
    return res.error(error.message);
  }
}