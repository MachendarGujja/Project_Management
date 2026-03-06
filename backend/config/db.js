const mongoose = require('mongoose');

const connectDB = async()=> {
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/project_manager");
    console.log(`MongoDB connected at ${conn.connection.host}`);
    }
    catch(err) {
        console.log("Mongdb connection error",err.message);
        process.exit(1);
    }
};

module.exports = connectDB;