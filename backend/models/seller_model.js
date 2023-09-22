const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sellerSchema = new mongoose.Schema({
  
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  gstNumber: {
    type: String,
    required: true,
    unique: true,
  },
  document1: {
    name: String,
    data: Buffer,
    
  },
  document2: {
    name: String,
    data: Buffer,
  },
  document3: {
    name: String,
    data: Buffer,
  },
  bankName: {
    type :String,
    required : true
  },
  accountNumber: {
    type : String,
    required : true,
  },
  ifscCode: {
    type : String,
    required : true
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  submittedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  passwordChangedAt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});


sellerSchema.pre("save", async function (next) {
  try {
    const seller = this;
    const existingUsernames = await mongoose
      .model("Seller")
      .find({})
      .distinct("username");

    if (seller.isModified("password")) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(seller.password, saltRounds);
      seller.password = hashedPassword;
      seller.confirmPassword = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});

sellerSchema.method.isPasswordChanged = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const pwdTime = pasrseInt(this.passwordChangedAt.getTime()/1000,10)

    return JWTTimestamp<pwdTime

  }
  return false;
}

sellerSchema.method.createResetPasswordToken = function(){
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
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
