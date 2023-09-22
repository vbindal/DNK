const mongoose = require("mongoose")

const schema = mongoose.Schema

const OtpVerificationSchema = new schema({
    userId : String,
    otp : String,
    createdAt : String,
    expiresAt : String
})

const OtpVerifaction = mongoose.model(
    "OtpVerication",OtpVerificationSchema
)

module.exports = OtpVerifaction
