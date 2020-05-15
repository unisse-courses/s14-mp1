//Configuration
const router = require('express').Router();

//Import Controller
const rootController = require('../controllers/rootController');

//API
router.get('/', rootController.loadHome);

module.exports = router;