//Configuration
const router = require('express').Router();

//Import Controller
const logoutController = require('../controllers/logoutController');

//API
router.get('/', logoutController.checker);

module.exports = router;