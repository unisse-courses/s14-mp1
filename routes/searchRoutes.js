//Configuration
const router = require('express').Router();

//Import Controller
const searchController = require('../controllers/search');

//API
router.get('/', searchController.find);

module.exports = router;