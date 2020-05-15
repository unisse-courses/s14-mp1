//Configuration
const router = require('express').Router();

//Import Controller
const collegesController = require('../controllers/collegesController');

//API
router.get('/', collegesController.getAllColleges);
router.get('/:college', collegesController.getCollegeData);
router.get('/:college/professors', collegesController.getProfessors);

module.exports = router;