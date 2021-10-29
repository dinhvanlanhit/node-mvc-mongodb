'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const fields = ['_id','fullname','email', 'password', 'avatar','birthday','sex','address','active','activation_key']
const userSchema = new mongoose.Schema(
    {
       fullname:{type: String},
       email:{type: String},
       password:{type: String},
       avatar:{type: String},
       birthday:{type: String},
       sex:{type: Boolean, default: 1},
       address:{type: String},
       active:{type: Boolean, default: false},
       activationKey:{type: String,default:null},
       remember_datetime:{type: String,default:null},
       remember_value:{type: String,default:null},
    },
    {
        timestamps: true
    }
);
userSchema.pre("save", async function save(next) {
  try {
      if (!this.isModified("password")) {
          return next();
      }
      this.password = bcrypt.hashSync(this.password);
      return next();
  } catch (error) {
      return next(error);
  }
});
userSchema.pre("findOneAndUpdate", async function findOneAndUpdate(next) {
  try {
      if (this._update.$set.password) {
          this._update.$set.password = bcrypt.hashSync(this._update.$set.password);
          return next();
      }
      return next();
  } catch (error) {
      return next(error);
  }
});
userSchema.method({
  transform () {
    const transformed = {}
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
  async auth (payload) {
      const {email,password} = payload;
      const User = await this.findOne({email}).exec();
      if(User){
            const passwordTrue = await User.passwordMatches(password);
            if(passwordTrue){
                return User.transform();
            }else{
                return false;
            }
      }else{
        return false;
      }
  },
}
module.exports = mongoose.model('User', userSchema);
