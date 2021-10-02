const transporter = require('../../config/transporter')
const config = require('../../config/config')
exports.rs=(status,data={})=>{
    let rs= {
        statusNumber:status==true?1:0,
        statusBoolen:status,
        status:status==true?'success':'error',
        icon:status==true?'success':'danger',
    }
    if(typeof data =='string'&&data!=null){
        rs.message = data
    }else{
        rs.results = data;
    }
    return rs;
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
    


