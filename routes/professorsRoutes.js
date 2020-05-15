//Router Configuration
const router = require('express').Router();

//Import Controller
const professorsController = require('../controllers/professorsController');

//API
router.get('/', professorsController.getAllProfs);
router.get('/:id', professorsController.getProfData);

module.exports = router;