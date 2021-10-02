require('dotenv').config() // load .env file
module.exports = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET,
  hostname: process.env.HOSTNAME,
  mongo: {
      uri: process.env.MONGOURI,
      testURI: process.env.MONGOTESTURI
  },
  transporter: {
    service: process.env.TRANSPORTER_SERVICE,
    email: process.env.TRANSPORTER_EMAIL,
    password: process.env.TRANSPORTER_PASSWORD,
    port: process.env.TRANSPORTER_PORT,
    host: process.env.TRANSPORTER_HOST,
    secure: process.env.TRANSPORTER_SECURE=='false'?false:true,
    email_receive: process.env.TRANSPORTER_MAIL_RECEIVE,
  }
}
