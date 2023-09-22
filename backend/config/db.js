const mongoose = require('mongoose')
const dotenv = require('dotenv').config()


const db = `${process.env.MONGO_URI}`

const ConnectDB = async () => {
    try {
        await mongoose.connect(db, {

            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log("mongoDB connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = ConnectDB;
