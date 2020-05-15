//Configuration
const router = require('express').Router();

//Import Controller
const loginController = require('../controllers/loginController');

//API
router.get('/', loginController.checker);

module.exports = router;