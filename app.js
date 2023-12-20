const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');

const SESSION_SECRET = require('./config/auth');

const { addAuthVariablesToEJS } = require('./middleware/authMiddleware');
const app = express();


app.use(session({
    secret: process.env.SESSION_SECRET,  
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }  
}));

app.use(addAuthVariablesToEJS);

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const userRoutes = require('./routes/users');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

module.exports = app; 
