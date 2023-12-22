const ejs = require('ejs');
const path = require('path');
const Event = require('../models/event');

exports.homePage = async (req, res) => {

    const isAuthenticated = req.session.isAuthenticated;
    const user = isAuthenticated ? req.session.user : null;

    const eventsQuery = isAuthenticated ? {} : { visibility: "Public" };
    const events = await Event.find(eventsQuery).limit(3);

    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'main.ejs'), { events, user,  });

    res.render('partials/layout', { body: content});
}

exports.aboutPage = async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'about-us.ejs'));
    res.render('partials/layout', { body: content });
}
