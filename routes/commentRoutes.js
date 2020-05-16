
const router = require('express').Router();
commentController = require('../controllers/commentController');

router.post('/addComment', commentController.addComment);


router.post('/deleteComment', commentController.deleteComment);


router.post('/saveComment', commentController.saveComment);

module.exports = router;
