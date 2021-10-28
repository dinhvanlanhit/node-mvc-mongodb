'use strict'
const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const { v4: uuidv4 } = require('uuid');
const User = require('../../../models/user/user.model');
const cm = require('../../../utils/common');
const config = require('./../../../../config/config');
exports.register = async (req, res, next) => {
  try {
    let activationKey = uuidv4()+uuidv4()+uuidv4();
    req.body.activationKey =activationKey;
    const user = new User(req.body)
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    let info = savedUser.transform();
    const mail = await cm.sendMail({
       to:req.body.email,
       body:`
       <div style="border: solid 1px #0008ff; padding: 15px; background-color: #eee;border-radius: 5px;">
              <h4>${req.__("Hello")} : ${info.email}</h4>
              <p>${req.__("Click")}
                <a href="${ config.hostname}/api/auth/confirm?key=${activationKey}">link</a> ${req.__("to activate your new account")}.
              </p>
       </div>`
    });
    var rs = cm.rs(true);
    if(mail.status){
      mail.message = req.__("We have sent you a letter, please check the message to authenticate the account");
      rs.results.email= mail;
      rs.results.user = info;
    }else{
      rs.results.user = info;
    }
    return res.json(rs);
  } catch (error) {
    return res.json(cm.rs(false,error.message))
  }
}
exports.login = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.auth(body);
    if(user){
      const token = jwt.sign({sub:{
          _id:user._id,
          name:user.name,
          email:user.email,
        } 
      }, config.secret);
      const data={token:token,user:user};
      return res.json(cm.rs(true,data));
    }else{
      return res.json(cm.rs(false,`${req.__("Login information is incorrect")}`));
    }
  } 
  catch (error){
    return res.json(cm.rs(false,error.message));
  }
}
exports.confirm = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { 'activationKey': req.query.key },
      { 'active': true,'activationKey': null }
    );
    return res.json(cm.rs(true,`${req.__("Successful account activation")}`));
  } catch (error) {
    return res.json(cm.rs(false,error.message));
  }
}
exports.testtoken =  (req,res,next)=>{
  console.log(cm.rs(true,"HELLO"));
  return res.json(cm.rs(true,"HELLO"))
}