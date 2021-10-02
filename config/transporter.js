const nodemailer = require('nodemailer')
const config = require('./config')
// console.log(config.transporter);
const transporter = nodemailer.createTransport({
  // service: config.transporter.service,
  host:config.transporter.host,
  port:config.transporter.port,
  secure:config.transporter.secure,
  auth: {
    user: config.transporter.email,
    pass: config.transporter.password
  }
})

module.exports = transporter
