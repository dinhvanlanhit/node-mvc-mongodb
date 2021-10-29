require("dotenv").config(); // load .env file
module.exports = {
    app:{
      port: process.env.PORT,
      app: process.env.APP,
      defaultLocale: process.env.APP_LANG,
      env: process.env.NODE_ENV,
      hostname: process.env.HOSTNAME,
    },
    auth:{
      secret: process.env.APP_SECRET,
      expiresIn:process.env.APP_EXPIRESIN,
    },
    mongo: {
        uri: process.env.MONGOURI,
        testURI: process.env.MONGOTESTURI,
    },
    transporter: {
        service: process.env.TRANSPORTER_SERVICE,
        port: process.env.TRANSPORTER_PORT,
        host: process.env.TRANSPORTER_HOST,
        secure: process.env.TRANSPORTER_SECURE == "false" ? false : true,
        from: process.env.TRANSPORTER_FROM,
        username: process.env.TRANSPORTER_USERNAME,
        password: process.env.TRANSPORTER_PASSWORD,
        receive: process.env.TRANSPORTER_MAIL_RECEIVE,
    },
    socialite:{
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
      FACEBOOK_APP_SECRET:process.env.FACEBOOK_APP_SECRET,
      FACEBOOK_APP_CALLBACK_URL: process.env.FACEBOOK_APP_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_APP_CALLBACK_URL: process.env.GOOGLE_APP_CALLBACK_URL
    }
};
