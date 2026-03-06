const mongoose = require('mongoose');

const connectDB = async()=> {
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        maxPoolSize: 10
    });
    console.log(`MongoDB connected at ${conn.connection.host}`);
    }
    catch(err) {
        console.log("Mongdb connection error",err.message);
        process.exit(1);
    }
};

module.exports = connectDB;