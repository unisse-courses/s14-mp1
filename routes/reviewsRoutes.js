//Router Configuration
const router = require('express').Router();

//Import Controller
const reviewsController = require('../controllers/reviewsController');

//API
router.get('/', reviewsController.getAllRevCount);
router.get('/:id', reviewsController.getReview);

module.exports = router;