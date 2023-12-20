const express = require('express');
const router = express.Router();

const Controller = require('../controllers/Controller');

router.get('/', Controller.homePage);
router.get('/about-us', Controller.aboutPage);

module.exports = router;
