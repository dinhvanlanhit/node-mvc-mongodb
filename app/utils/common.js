const transporter = require('../../config/transporter')
const config = require('../../config/config')
const jwt = require('jsonwebtoken');
const fs = require("fs");
const ejs = require("ejs");
exports.response =(req,res,results,message)=>{
    // console.log(res);
    let json =  {
        statusCode:res.statusCode,
        statusString:res.resType,
        statusNumber:res.resType==="success"?0:1,
        input:{ 
            lang:res.lang,
            url:`${config.app.hostname}${req.originalUrl}`,
            method:req.method,
        },
        output:{
            // module:module,
            message:(res.resType==="success"?req.__('Successfully'):req.__('Please check the error')),
            data:null,
        }
    };
    if(res.resModule!=""&&res.resModule!=null){
        json.output.module = res.resModule;
    }
    if(Object.keys(req.query).length > 0){
        json.input.query=req.query
    }
    if(Object.keys(req.params).length > 0 ){
        json.input.params=req.params
    }
    if(Object.keys(req.body).length > 0 ){
        json.input.body=req.body
    }
    if((results!=null&&typeof(results)=="object")||Array.isArray(results)){
        json.output.data = results;
    }else if(typeof(results)=="string"){
        json.output.message = results;
    }
    if((message!=null&&typeof(message)=="object")||Array.isArray(message)){
        json.output.data = message;
    }else if(typeof(message)=="string"){
        json.output.message = message;
    }
    return  json;
}
exports.makeJWT = (payload=null,expiresIn=null)=>{
    let token = jwt.sign({sub:payload},config.auth.secret,{expiresIn:config.auth.expiresIn});
    if(expiresIn!=null){
        token = jwt.sign({sub:payload},config.auth.secret,{expiresIn:expiresIn});
        expiresIn = expiresIn;
    }else{
        expiresIn = config.auth.expiresIn;
    }
    return {token:token,expiresIn:expiresIn,payload:payload};
}
exports.responseCustom = (req,res,next) =>{
    const response = this;
    let lang = req.headers["lang"];
    if (lang == "vi" || lang == "en"){ 
        req.lang = lang;
        res.lang = lang;
        req.setLocale(lang);
    }else{
        req.lang = req.getLocale();
        res.lang = req.getLocale();
    }
    req.setModule = res.setModule = function(data=null){
        return res.resModule = data;
    }
    req.success = res.success = function(data=null,msg=null){
        res.resType='success';
        return res.json(response.response(req, res,data,msg));
    }
    req.error = res.error = function(data=null,msg=null){
        res.resType='error';
        return res.json(response.response(req, res,data,msg));
    }
    req.JWT =res.JWT = function(payload=null,expiresIn=null){
        return response.makeJWT(payload,expiresIn);
    }
    next();
}
exports.sendMail = async (mailOptions={}) => {
    mailOptions.template = this.setDefault(mailOptions.template,null);
    mailOptions.from = this.setDefault(config.transporter.from,"Noreply");
    mailOptions.to = this.setDefault(config.transporter.receive,"dinhvanlanh.it@gmail.com");
    mailOptions.subject = this.setDefault(mailOptions.subject,"Send mail");
    mailOptions.html = this.setDefault(mailOptions.body,"Hello");
    try {
        if(Object.keys(mailOptions.template).length>0){
            delete  mailOptions.body;
            if(mailOptions.template.path){
                mailOptions.template['path'] = __dirname+"/templates/"+mailOptions.template.path;
            }
            if(mailOptions.template.data==undefined){
                mailOptions.template['data'] = {}
            }
            mailOptions.html = await  ejs.renderFile(mailOptions.template.path,mailOptions.template.data,{async: true});
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("mailOptions : ",mailOptions);
        return {type:"sendMail", message: info.messageId, error: true };
    } catch (error) {
        console.log("sendMail Error : ",error.message);
        return { type:"sendMail", message: error.message, error: false};
    }
    
};
exports.randomNumberString = (l) =>{
    let length = 6;
    if(typeof(l)=='number'){
        if(l<=0){
            length = 6;
        }else{
            length = l
        }
    }
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *charactersLength));
   }
   return result;

}
exports.setDefault = (value,df)=>{
    if(value==undefined||value==""||value==null){
        value = df;
    }
    if(typeof df=="number"){
        return Number(value);
    }else if(typeof df== 'boolean'){
        return Boolean(value);
    }
    else if(typeof df== 'string'){
        return String(value);
    }
    else{
        return value;
    }

}



