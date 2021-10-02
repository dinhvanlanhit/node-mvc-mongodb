'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const userSchema = new mongoose.Schema(
    {
        fullname:{type: String},
        avatar:{type: String},
        phone:{type: String},
        email:{type: String},
        password:{type: String},
        active:{type: Boolean, default: false},
        sex:{type: Boolean, default: 1},
        address:{type: String},
        activationKey:{type: String,default:null},
    },
    {
        timestamps: true
    }
);
userSchema.pre('save', async function save (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
    this.password = bcrypt.hashSync(this.password)
    return next()
  } catch (error) {
    return next(error)
  }
})
userSchema.method({
  transform () {
    const transformed = {}
    const fields = ['_id', 'email', 'active','createdAt']
    fields.forEach((field) => {
      transformed[field] = this[field]
    })
    return transformed
  },
  passwordMatches (password) {
    return bcrypt.compareSync(password, this.password)
  },
})
userSchema.statics = {
  async auth (body) {
    const {email,password } = body;
    const User = await this.findOne({ email }).exec();
    if(User){
      const passwordTrue = await User.passwordMatches(password);
      if(passwordTrue){
        return User.transform();
      }
      return false;
    }else{
      return false;
    }
  },
}
module.exports = mongoose.model('User', userSchema);
