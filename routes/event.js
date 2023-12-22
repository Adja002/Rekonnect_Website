const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const eventController = require('../controllers/eventController');
const confirmControler = require('../controllers/confirmController');

router.post('/confirm', isAuthenticated, confirmControler.createOrUpdateConfirm);
router.get('/confirm', isAuthenticated, confirmControler.createOrUpdateConfirm);

router.get('/', eventController.getEvents);
router.get('/create', isAuthenticated, eventController.createOrUpdateEvent);
router.post('/create', isAuthenticated, eventController.createOrUpdateEvent);

router.post('/:id/delete', isAuthenticated, eventController.deleteEvent);

router.get('/', eventController.getEvent);
router.post('/update', isAuthenticated, eventController.createOrUpdateEvent);
router.get('/update', isAuthenticated, eventController.createOrUpdateEvent);

module.exports = router;