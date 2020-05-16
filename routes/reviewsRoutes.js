//Router Configuration
const router = require('express').Router();

//Import Controller
const reviewsController = require('../controllers/reviewsController');

//API
router.get('/', reviewsController.getAllRevCount);
router.get('/:id', reviewsController.getReview);
router.post('/add', reviewsController.addReview);
router.post('/edit', reviewsController.editReview);
router.post('/delete', reviewsController.deleteReview);

module.exports = router;