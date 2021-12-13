const transporter = require('../../config/transporter')
const config = require('../../config/config')
const jwt = require('jsonwebtoken');
const mongoose =require('mongoose')
const fs = require("fs");
const ejs = require("ejs");
const moment = require('moment');
exports.makeCode=(stringCode="",symbol="",length=5)=>{
    // Lấy độ dài chưa ký hiệu
    let lenghtSymbol = 0;
    if(symbol!==""&&symbol!==null){lenghtSymbol = symbol.length;}
    let codeNumber = 1;
    let zeroString = "";
    let lenghtNumber = 0;
    let codeResult = "";
    if(typeof(length)!="number"){length=5;}
    if(length==0){length=5;}
    // Tạo số không tư con số họ cho mặt đinh là 5
    for(let i = 0;i<length;i++){zeroString+=String(0)}
    // Kiểm tra stringCode có khác "" và null không
    if(stringCode!==""&&stringCode!==null){
        // loại bỏ ký hiệu và ép thành số nguyên
        let stringCD = stringCode.substr(lenghtSymbol, stringCode.length);
        codeNumber = Number(stringCD);
        // lấy độ dài của số nguyên
         // Tăng lên 1
        codeNumber+=1;
        lenghtNumber = Number(codeNumber.toString().length);
        let lenghtZeroString = Number(zeroString.toString().length);
        // console.log("codeNumber",codeNumber);
		// console.log("lenghtZeroString",lenghtZeroString);
        // console.log("lenghtNumber",lenghtNumber);
        // console.log("zeroString",zeroString);
        codeResult=symbol+""+zeroString.substr(0,lenghtZeroString-lenghtNumber)+""+codeNumber;
    }else{
        codeResult=symbol+""+zeroString.substr(0,(zeroString.length-1))+""+codeNumber;
    }
    return codeResult;
};
exports.makeJWT = (user=null)=>{  
    const auth_expiresIn = config.auth.expiresIn;
    const length_expiresIn =  auth_expiresIn.length;
    const stringType = auth_expiresIn.substr(length_expiresIn-1, length_expiresIn);
    const expiresInRoot = Number(auth_expiresIn.substr(0,length_expiresIn-1));
    const expiresInRefresh = (expiresInRoot+expiresInRoot);
    let stringTypeFull = null;
    switch(stringType){
        case 's':
            stringTypeFull = 'seconds';
            break;
        case 'm':
            stringTypeFull = 'minutes'; 
            break;
        case 'h':
            stringTypeFull = 'hours'; 
            break;
        default:
            stringTypeFull = 'days';
            break;
    }
    const datetime = moment(new Date()).add(expiresInRoot,stringTypeFull).format("YYYY-MM-DD HH:mm:ss");
    const expiresIn = new Date(moment(datetime).subtract(2,"minutes") .format("YYYY-MM-DD HH:mm:ss")).getTime();
    let token = jwt.sign({sub:user},config.auth.secret,{expiresIn:expiresInRoot+stringType});
    let refreshToken = jwt.sign({sub:{_id:user._id,token:token}},config.auth.secret+"_refreshToken",{expiresIn:expiresInRefresh+stringType});
    return { 
        expiresInType:stringTypeFull,
        expiresIn,
        token,
        refreshToken,
        user
    }
};
exports.response =(req,res,results,message)=>{
    // console.log(res);
    let json =  {
        statusCode:res.statusCode,
        statusString:res.resType,
        statusNumber:res.resType==="success"?0:1,
        statusBoolean:res.resType==="success"?true:false,
        input:{ 
            lang:res.lang,
            url:`${config.app.hostname}${req.originalUrl}`,
            method:req.method,
        },
        output:{
            // module:module,
            message:(res.resType==="success"?req.__('LANG_00059'): req.__('LANG_00021')),
            data:[],
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
    json.statusMessage = json.output.message;
    return  json;
};
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
    req.makeCode = res.makeCode = function(stringCode="",symbol="",length=5){
        return response.makeCode(stringCode,symbol,length);
    }
    req.JWT =res.JWT = function(payload=null){
        return response.makeJWT(payload);
    }
    req.makeQuerySearch = res.makeQuerySearch = function(){
        return response.makeQuerySearch(req);
    }
    req.makeList = res.makeList = function(data,total=null){
        return response.makeList(data,total);
    }
    req.setDefault = res.setDefault = function(value,df){
        return response.setDefault(value,df);
    }
    next();
};
exports.sendMail = async (mailOptions={}) => {
    mailOptions.template = this.setDefault(mailOptions.template,{});
    mailOptions.from = this.setDefault(config.transporter.from,"Noreply");
    mailOptions.to = this.setDefault(config.transporter.receive,"dinhvanlanh.it@gmail.com");
    mailOptions.subject = this.setDefault(mailOptions.subject,"Send mail");
    mailOptions.html = this.setDefault(mailOptions.body,"Hello");
    try {
        if(typeof(mailOptions.template)=='object'&&Object.keys(mailOptions.template).length>0){
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
    if(value==undefined||value=='undefined'||value==""||value==null){
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

};
exports.convertSkip=(page,limit)=>{
    return page > 0 ? (page-1)*limit : 0;
};
exports.convertSort =(sort)=>{
    if(typeof(sort)=='string'){
        if(sort=="desc"){
            return -1;
        }else{
            return 1;
        }
    }else if(typeof(sort)=='number'){
        return sort;
    }else{
        return  -1;
    }
};
exports.convertSearch =(req,type="$or")=>{
    const search = req.query.search==undefined?{}:req.query.search;
    const company_id = this.setDefault(req.query.company_id,null);
    let query = {};
    if(company_id){
        query['company_id']= mongoose.Types.ObjectId(company_id);
    }
    if(Object.keys(search).length>0&&search.value){
        if(search&&search.value!=""&&search.value!=null){
            if(Array.isArray(search.colum)&&search.colum.length>0){
                let data = [];
                let notFind = ["_id","createdAt","updatedAt"]
                search.colum.forEach((key)=>{
                    let colum = {}
                    if(notFind.includes(key)==false){
                        colum[key] = {'$regex': search.value, '$options': 'i'};
                        data.push(colum);
                    }
                });
                query[type] = data;
            }else{
                query[search.field] ={'$regex': search.value, '$options': 'i'};
            }
            return query;
        }else{
            return query;
        } 
    }
   
    return query;
    
}
exports.makeQuerySearch=(req,option={}) =>{
    const page = this.setDefault(req.query.page,0);
    const limit = this.setDefault(req.query.limit,10);
    const sort_colum = this.setDefault(req.query.sort_colum,null);
    const sort_type = this.setDefault(req.query.sort_type,null);
    let data = {};
    if(page!=0&&limit){ 
        data['skip'] = this.convertSkip(page,limit);
        data['limit'] = limit;
    }else if(page==0&&limit){
        data['skip']=null;
        data['limit']=limit;
    }else{
        data['skip']=null;
        data['limit']=null;
    }
    let sort = {};
    if(sort_colum&&sort_type){
        sort[sort_colum] = this.convertSort(sort_type)
        data['sort'] = sort;
    }else{
        sort['createdAt'] = this.convertSort("desc");
        data['sort'] = sort;
    }
    data['query'] = this.convertSearch(req);
    return data;
}
exports.makeList = (items=[],total=0)=>{
    let result = {items,total};
    return result;
}   
