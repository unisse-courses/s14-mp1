//Configuration
const router = require('express').Router();

//Import Controller
const profileController = require('../controllers/profileController');

//API
router.get('/', profileController.loadProfile);

module.exports = router;