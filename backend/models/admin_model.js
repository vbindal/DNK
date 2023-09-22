const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    require: true,
  },
  LastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  OrganizationId: {
    type: String,
    require: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return (val = this.password);
      },
      message: "password anc confirm password are different",
    },
  },
  // role: {
  //   type: String,
  //   enum: ["main admin", "helper admin"],
  //   default: "helper admin",
  // },
  assignedSellers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
  ],
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  sellers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seller" }],
});



adminSchema.method.isPasswordChanged = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const pwdTime = parseInt(this.passwordChangedAt.getTime()/1000,10)

    return JWTTimestamp<pwdTime

  }
  return false;
}

adminSchema.method.createResetPasswordToken = function(){
  try{
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpires = Date.now()*10*60*1000
    return resetToken

  }
  catch(err){
    res.status(400).send({ error: error.message });
  }
}

const Admin = mongoose.model('Admin', adminSchema,'adminData');
module.exports = Admin;
