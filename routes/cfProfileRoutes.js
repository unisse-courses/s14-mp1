//Configuration
const router = require('express').Router();

//Import Controller
const cfProfileController = require('../controllers/cfProfileController');

router.get('/', cfProfileController.load);

module.exports = router;