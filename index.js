const app = require('./app');

const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const SESSION_SECRET = require('./config/auth');
const session = require('express-session');

connectDB()

app.use(session({
    secret: SESSION_SECRET,  
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: process.env.MONGODB_URI}),
    cookie: { maxAge: 3600000 }  
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` 🟢🟢🟢 The server is running and listening on port ${PORT}`);
});