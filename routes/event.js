const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const eventController = require('../controllers/eventController');
const confirmControler = require('../controllers/confirmController');

router.post('/:id([a-fA-F0-9]{24})/confirm', isAuthenticated, confirmControler.createOrUpdateConfirm);
router.get('/:id([a-fA-F0-9]{24})/confirm', isAuthenticated, confirmControler.createOrUpdateConfirm);

router.get('/', eventController.getEvents);
router.get('/create', isAuthenticated, eventController.createOrUpdateEvent);
router.post('/create', isAuthenticated, eventController.createOrUpdateEvent);

router.post('/:id/delete', isAuthenticated, eventController.deleteEvent);

router.get('/:id([a-fA-F0-9]{24})', eventController.getEvent);
router.post('/:id([a-fA-F0-9]{24})/update', isAuthenticated, eventController.createOrUpdateEvent);
router.get('/:id([a-fA-F0-9]{24})/update', isAuthenticated, eventController.createOrUpdateEvent);

module.exports = router;