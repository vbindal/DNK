const jwt = require("jsonwebtoken");
const Admin = require("../models/admin_model");
const asyncWrapper = require("../middleware/async");
const {createCustomError} = require("../error/custom-error")
const sendMail = require("../middleware/email")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const OtpVerication = require("../models/OtpVerification")

// function OTPgenrator(otp_length) {
//   var digits = "0123456789";
//   let OTP = "";
//   for (let i = 0; i < otp_length; i++) {
//     OTP += digits[Math.floor(Math.random() * 10)];
//   }
//   return OTP;
// }

// const signupAdmin = async (req, res, next) => {
//   const { email, password, organizationId, phoneNumber } = req.body;

//   try {
//     const otp = OTPgenrator(6);
//     const level = email.includes("level2") ? "MainAdmin" : "HelperAdmin";
//     const organizationType = organizationId.toString().substring(0, 2);

//     const role =
//       organizationType === "22" && level == "level2"
//         ? "MainAdmin"
//         : "HelperAdmin";

//     const existingAdmin = await Admin.findOne({
//       email: email,
//       organizationId: organizationId,
//     });

//     if (existingAdmin) {
//       return res.status(409).send({
//         message: "Email and organization ID combination is already in use.",
//         OTP: req.Admin.tempOtp,
//         phoneNumber,
//       });
//     } else {
//       if (role == "MainAdmin" || role == "HelperAdmin") {
//         req.body.otp = otp;
//         const newAdmin = new Admin({
//           email: email,
//           password: password,
//           role: role,
//           organizationId: organizationId,
//         });

//         await newAdmin.save();

//         res.status(200).send({
//           message: "New user has been created successfully",
//           OTP: +otp,
//           phoneNumber,
//         });
//         const expTime = process.env.LOGIN_EXPIRES;
//         const token = jwt.sign({ userId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: expTime });
//         res.locals.token = token;
//         next();
//       } else {
//         res
//           .status(400)
//           .send({ message: "You are not authorized to enter admin dashboard" });
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

const sendOtpVerification = async(req,res,next)=>{
  
  try{
    const id = req.params.id
    const email = req.params.email

    const otp = `${Math.floor(1000 + Math.random()*9000)}`

    const mail ={
      from : process.env.EMAIL_USER,
      to : email,
      subject : "verify your email",
      message : `Enter ${otp} to verify your email the otp will expire in 60 mins`
    }

    const hashedOtp = await bcrypt.hash(otp,10)

    const newOtpVerifaction = new OtpVerication({
      userId : _id,
      otp : hashedOtp,
      createdAt : Date.now(),
      expiresAt : Date.now()*3600000
    })

    await newOtpVerifaction.save()
    await sendMail(mail)
    res.json({
      status: "pending",
      message : "verification otp email sent",
      date:{
        userID : _id,
        email
      }
    })

  }catch(error){
    next(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log(admin)
    
    if (!admin) {
      return res.status(400).send({ message: "Invalid email/username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (isPasswordValid) {
      res.status(200).send({ 
        message: "Login success",
        token: jwt.sign({ userID: admin._id }, process.env.JWT_SECRET),
      });
      next();
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

async function updateAdminPasswords(req,res,next) {
  try {
    const admins = await Admin.find();

    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10); 
      admin.password = hashedPassword; 
      admin.confirmPassword = hashedPassword;
      await admin.save(); 
    }
    res.status(200).send('password hashing done')
    next()
  } catch (error) {
    next(error)
  }
}

const updateAdmin = async (req, res,next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await Admin.findByIdAndUpdate({ _id: id }, data);
    res.status(200).send({ message: "Admin data has been updated" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
  next()
};

const forgotPassword = asyncWrapper(async(req,res,next)=>{

  const admin = await Admin.findOne({email:req.email})

  if(!admin){
    const error = new createCustomError('admin not found',404)
    next(error)
  }
  const resetToken = admin.createResetPasswordToken()

  await admin.save({validateBeforeSave:false})

  const resetUrl = `${req.protocol}:${req.get('host')}/api/admin/resetPassword/${resetToken}`
  const message = `use the given link to reset your password\n\n${resetUrl}`

  try{
    await sendMail({
      email : user.email,
      subject : 'password change request received',
      message : message
    });
    res.status(200).json({
      status: 'success',
      message: 'password change link sent to admin email'
    })
  }catch(err){
    admin.resetPasswordToken = undefined
    admin.resetPasswordExpires = undefined
    admin.save({validateBeforeSave:false})

    return next(new createCustomError('error while sending reset password link,try again'),500)
  }

})

const resetPassword = async(req,res,next)=>{
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const admin = await Admin.findOne({resetPasswordToken : req.params.token,resetPasswordExpires:{$gt : Date.now()}})

  if(!admin){
    const error = new createCustomError('Token is invalid or has expired',400)
    next(error)
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  admin.password = hashedPassword;
  admin.confirmPassword = req.body.confirmPassword
  admin.resetPasswordToken = undefined
  admin.resetPasswordExpires = undefined
  admin.passwordChangedAt = Date.now()
  
  admin.save()

  const loginToken = jwt.sign({ userID: admin._id }, process.env.JWT_SECRET, { expiresIn:process.env.LOGIN_EXPIRES});

  //const loginToken = jwt.sign({ userID: admin._id }, process.env.JWT_SECRET,)
  res.status(200).json({
    status : 'success',
    token : loginToken
  })
}


module.exports = {
  login,
  updateAdminPasswords,
  updateAdmin,
  forgotPassword,
  resetPassword
};
