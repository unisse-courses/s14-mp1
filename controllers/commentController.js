const commentModel = require('../models/comment');


exports.addComment = function(req, res) {
	if (req.session.banned){
		var result;
		result = { success: false, message: "Your account is BANNED!" }
		res.send(result);
	} else{
		var newComment = new commentModel({
			reviewRef: req.body.reviewRef,
		 	studentRef: req.body.studentRef,
		  	commentContent: req.body.commentContent,
		});

		newComment.create(newComment, function(err, comment) {
			var result;
			if (err) {
				console.log(err.errors);
				result = { success: false, message: "Comment was not posted!" }
				res.send(result);
		  	} else {
				console.log(comment);
				result = { success: true, message: "Comment posted!" }
				res.send(result);
		  	}
		});
	}
}



exports.saveComment = function(req, res) {
	if (req.session.banned){
		var result;
		result = { success: false, message: "Your account is BANNED!" }
		res.send(result);
	} else{
		var id = req.body.id;
		var content = req.body.content;

		commentModel.findOne({_id: id}, function(err, doc){
			var result;
			if(err){
				console.log(err.errors)
				result = { success: false, message: "Comment was not successfully saved!" }
				res.send(result);
			}
			else{
				doc.commentContent = content;
				doc.save();
				console.log("Successfully saved comment!");
				console.log(doc);
				result = { success: true, message: "Comment saved!" }
				res.send(result);
			}
		});
	}
}

exports.deleteComment = function (req, res) {
  	var id = req.body.id;
  	commentModel.delete(id, function(err) {
  		if (err) {
  			console.log(err.errors);
  			result = {
  				success: false,
  				message: "Comment was not successfully deleted!"
  			}
  			res.send(result);
  		} else {
  			console.log("Successfully deleted comment!");
  			result = {
  				success: true,
  				message: "Comment deleted!"
  			}
  			res.send(result);
  		}
  	});
  }
