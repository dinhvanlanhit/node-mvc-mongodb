const transporter = require('../../config/transporter')
const config = require('../../config/config')
exports.makeJSON = (res,boolen)=>{
    return {
        statusCode:res.status,
        statusString:boolen,
        tatusNumber:boolen=='success'?0:1,
        results:null,
        message:null
    };
}
exports.returnSuccess=(req,res,results,message)=>{
    let json = makeJSON(res,'success');
    if(typeof(results)=="object"){
        json.results = results;
    }else if(typeof(results)=="string"){
        json.message = results;
    }
    if(typeof(message)=="object"){
        json.results = message;
    }else if(typeof(message)=="string"){
        json.message = message;
    }
    return  json;
}
exports.returnError=(req,res,results,message)=>{
    let json = makeJSON(res,'success');
    if(typeof(results)=="object"){
        json.results = results;
    }else if(typeof(results)=="string"){
        json.message = results;
    }
    if(typeof(message)=="object"){
        json.results = message;
    }else if(typeof(message)=="string"){
        json.message = message;
    }
    return  json;
}
exports.sendMail = async (obj={})=>{
    if(obj.from==undefined){
        obj.from="noreply"; 
    }
    if(obj.to==undefined){
        obj.to="";
        
    }
    if(obj.subject==undefined){
        obj.subject="Send mail";
        
    }
    if(obj.body==undefined){
        obj.body="Hello";
        
    }
    const mailOptions = {
        from: obj.from,
        to:obj.to,
        subject: obj.subject,
        html: obj.body
    }
    console.log(mailOptions);
    try {
        const info =  await transporter.sendMail(mailOptions);
        return {message:info.messageId,status:true};
    } catch (error) {
        return {message:error.message,status:false};
    }
   
}
    


