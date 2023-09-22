const nodemailer = require("nodemailer")


const sendEmail = async(option) =>{
    const transporter = nodemailer.createTransport(
        {
            host : process.env.EMAIL_HOST,
            PORT : process.env.EMAIL_PORT,
            auth:{
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASSWORD
            }
        }
    )

    const emailOptions = {
        from : 'dnk support<support@dnk.ac.in>',
        to : option.email,
        subject : option.subject,
        text : option.message
    }
    transporter.sendMail(emailOptions)
}

module.exports = sendEmail