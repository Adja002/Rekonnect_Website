const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(' 🟢 Database Connected');
        return mongoose.connection;
    } catch (error) {
        console.error('🔴 Database Connection Error:', error);
        process.exit(1);
    }
};


module.exports = connectDB;
