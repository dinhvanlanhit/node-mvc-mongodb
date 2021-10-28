'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const userSchema = new mongoose.Schema(
    {
        name:{type: String},
        phone:{type: String},
        email:{type: String},
        password:{type: String},
        avatar:{type: String},
        active:{type: Boolean, default: false},
        sex:{type: Boolean, default: 1},
        address:{type: String},
        activationKey:{type: String,default:null},
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
    const fields = ['id', 'name', 'email', 'active','createdAt']
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
            }else{
              return false;
            }
          
      }else{
        return false;
      }
  },
}
module.exports = mongoose.model('User', userSchema);
