//Configuration
const router = require('express').Router();

//Import Controller
const cfAdminController = require('../controllers/cfAdminController');

router.get('/', cfAdminController.load);
router.get('/colleges', cfAdminController.getAllColCount);
router.get('/reviews', cfAdminController.getAllRevCom);
router.get('/professors', cfAdminController.getAllProfCount);
router.get('/users', cfAdminController.getAllUserCount);

module.exports = router;