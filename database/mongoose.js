'use strict'
const config = require('./../config/config')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connection.on('connected', () => {
  console.log('MongoDB is connected debug:'+config.app.env)
})
mongoose.connection.on('error', (err) => {
  console.log(`Could not connect to MongoDB because of ${err}`)
  process.exit(1)
})
if (config.app.env === 'dev') {
  mongoose.set('debug', true)
}
exports.connect = () => {
  var mongoURI = (config.app.env === 'prod' || 'dev' ? config.mongo.uri : config.mongo.testURI);
  try {
    mongoose.connect(mongoURI, {
      keepAlive: 1,
      useNewUrlParser: false
    })
    return mongoose.connection;
  } catch (error) {
    console.log(`Could not connect to MongoDB because of ${error}`)
  }
}
