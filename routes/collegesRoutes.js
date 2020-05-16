//Configuration
const router = require('express').Router();

//Import Controller
const collegesController = require('../controllers/collegesController');

//API
router.get('/', collegesController.getAllColleges);
router.get('/:college', collegesController.getCollegeData);
router.get('/:college/professors', collegesController.getProfessors);
router.get('/deleteCollege', collegesController.deleteCollege);
module.exports = router;
