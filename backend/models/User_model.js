const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = mongoose.Schema;

const userSchema = new schema({
  firstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  phoneNumber: {
    type: String,
    require: true,
  },
  Address: {
    HomeAddress:{
        type:String,
        require:true
    },
    pincode:{
        type:String,
        require:true
    },
    district:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    country:{
        type:String,
        require:true
    }
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1, // You can set a default quantity if needed
      },
    }
  ],
  favorites:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
  }
],
  Orders:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
  }
});


userSchema.pre("save", async function (next) {
    try {
      if (this.isModified("password")) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        this.confirmPassword = hashedPassword;
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
const User = mongoose.model("UserData",userSchema)
module.exports = User