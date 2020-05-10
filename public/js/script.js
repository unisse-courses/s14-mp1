window.addEventListener('load', () => {
  var profRef = '';
  var profNumber = 0;
  let url = location.href.replace(/\/$/, "");

  $('#addReview').click(function() {
    var newReview = {
      profRef: window.profRef,
      profNumber: window.profNumber,
      profCourse: $('#revProfCourse').find(":selected").text(),
      studentRef: window.studentRef,
      studentId: window.studentId,
      reviewContent: $("textarea#revContent").val()
    };

    $.post('/addReview', newReview, function(data, status) {
      console.log(data);

      if (data.success) {
        $('#msg').addClass('text-success');
        $('#msg').removeClass('text-danger');
        $('#msg').text('Successfully added review!');
        $('textarea#revContent').val('');
      } else {
        $('#msg').addClass('text-danger');
        $('#msg').removeClass('text-success');
        $('#msg').text('Error in adding review!');
      }
    });
  });

  $('#commentBtn').click(function() {
    var newComment = {
      reviewRef: $('#commRN').find(":selected").text(),
      studentRef: window.studentRef,
      commentContent: $("textarea#commContent").val()
    };

    $.post('/addComment', newComment, function(data, status) {
      console.log(data);

      if (data.success) {
        $('#msg').addClass('text-success');
        $('#msg').removeClass('text-danger');
        $('#msg').text(data.message);
        $('textarea#commContent').val('');
      } else {
        $('#msg').addClass('text-danger');
        $('#msg').removeClass('text-success');
        $('#msg').text(data.message);
      }
    });
  });

  $('#quickCollege').change(function() {
    var selectedCollege = $(this).children("option").filter(":selected").val();
    var course = document.getElementById('quickCourse');
    var prof = document.getElementById('quickProf');
    var courseItem = "<option hidden disabled selected value>Choose...</option>";
    prof.innerHTML = courseItem;
    $.get('/getCourseByCollege', selectedCollege, function(data, status) {
      $.each(data, function(index, value){
        courseItem += "<option>" + value + "</option>";
      });
      course.innerHTML = courseItem;
    });
  });

  $("#quickCourse").change(function() {
    var selectedCourse = $(this).children("option").filter(":selected").val();
    var prof = document.getElementById('quickProf');
    var profItem = "<option hidden disabled selected value>Choose...</option>";

    $.get('/getProfByCourse', selectedCourse, function(data, status) {
      $.each(data, function(index, value){
        profItem += "<option>" + value.profName + "</option>";
      });
      prof.innerHTML = profItem;
    });
    
    $('#postReview').click(function() {
      var newReview = {
        profName: $('#quickProf').find(":selected").text(),
        profCourse: $('#quickCourse').find(":selected").text(),
        studentRef: window.studentRef,
        studentId: window.studentId,
        reviewContent: $("textarea#revContent").val()
      };

      $.get('/getProfDetails', newReview, function(data, status) {
        var profRef = data._id;
        var profNumber = data.profNumber;

        var finalReview = {
          profRef: profRef,
          profNumber: profNumber,
          profCourse: newReview.profCourse,
          studentRef: newReview.studentRef,
          studentId: newReview.studentId,
          reviewContent: newReview.reviewContent
        }

        $.post('/addReview', finalReview, function(data, status) {
          console.log(data);
          if (data.success) {
            $('#msg').addClass('text-success');
            $('#msg').removeClass('text-danger');
            $('#msg').text(data.message);
            $('textarea#revContent').val('');
            var delay = 500; 
            setTimeout(function(){location.reload(true)}, delay);
          } else {
            $('#msg').addClass('text-danger');
            $('#msg').removeClass('text-success');
            $('#msg').text(data.message);
          }
        });
      });
    });
  });

  $(document).on('click', 'button[data-id]', function (e) {
    var funct = $(this).data('funct');
    var id = $(this).data('id');

    if (funct == 'editPost' || funct == 'editComment') {
      var content = $(this).data('content');
      var course = $(this).data('course');
      var profName = $(this).data('profname');
   
      if (funct == 'editPost') { 
        document.getElementById('modalReviewRef').value = id;
        document.getElementById('modalReviewContent').innerHTML = content;
        document.getElementById('modalEditPostCourse').value = course;
        document.getElementById('modalEditPostProfessor').value = profName;
      } else{
        document.getElementById('modalCommentRef').value = id;
        document.getElementById('modalCommentContent').innerHTML = content;
        document.getElementById('modalEditCommentCourse').value = course;
        document.getElementById('modalEditCommentProfessor').value = profName;
      }
    }

    if(funct == 'deletePost'){
        document.getElementById('modalDeleteReviewRef').value = id;
    }

    if(funct == 'deleteComment'){
        document.getElementById('modalDeleteCommentRef').value = id;
    }
  });

  $('#editPostClose').click(function(){
    document.getElementById('modalCommentContent').innerHTML = ""; 
    document.getElementById('modalEditPostCourse').value = "";  
    document.getElementById('modalEditPostProfessor').value = "";    
  });

   $('#editCommentClose').click(function () {
    document.getElementById('modalCommentContent').innerHTML = "";
    document.getElementById('modalEditCommentCourse').value = "";
    document.getElementById('modalEditCommentProfessor').value = "";
  });

  // EDIT POST SAVE
  $('#savePost').click(function() {
    var post = {
      reviewRef: $('#modalReviewRef').val(),
      commentContent: $('#modalReviewContent').val()
    };
    $.post('/savePost', post, function(data, status) {
      console.log(data);
      if (data.success) {
        $('#msgEd1').addClass('text-success');
        $('#msgEd1').removeClass('text-danger');
        $('#msgEd1').text(data.message);
      } else {
        $('#msgEd1').addClass('text-danger');
        $('#msgEd1').removeClass('text-success');
        $('#msgEd1').text(data.message);
      }
    });
    var delay = 500; 
    setTimeout(function(){location.reload(true)}, delay);
  });

  //EDIT COMMENT SAVE
  $('#saveComment').click(function () {
    var comment = {
      id: $('#modalCommentRef').val(),
      content: $('#modalCommentContent').val()
    };
    $.post('/saveComment', comment, function (data, status) {
      console.log(data);
      if (data.success) {
        $('#msgEd2').addClass('text-success');
        $('#msgEd2').removeClass('text-danger');
        $('#msgEd2').text(data.message);
      } else {
        $('#msgEd2').addClass('text-danger');
        $('#msgEd2').removeClass('text-success');
        $('#msgEd2').text(data.message);
      }
    });
    var delay = 500; 
    setTimeout(function(){location.reload(true)}, delay);
  });

  //DELETE POST
  $('#deletePost').click(function () {
    var post = {
      id: $('#modalDeleteReviewRef').val()
    };
    $.post('/deletePost', post, function (data, status) {
      if (data.success) {
        $('#msgDel1').addClass('text-success');
        $('#msgDel1').removeClass('text-danger');
        $('#msgDel1').text('Successfully deleted post!');
        location.reload();
      } else {
        $('#msgDel1').addClass('text-danger');
        $('#msgDel1').removeClass('text-success');
        $('#msgDel1').text('Error in deleting post!');
      }
    });
  });

  //DELETE COMMENT
  $('#deleteComment').click(function () {
    var comment = {
      id: $('#modalDeleteCommentRef').val()
    };
    $.post('/deleteComment', comment, function (data, status) {
      if (data.success) {
        $('#msgDel2').addClass('text-success');
        $('#msgDel2').removeClass('text-danger');
        $('#msgDel2').text('Successfully deleted comment!');
        location.reload();
      } else {
        $('#msgDel2').addClass('text-danger');
        $('#msgDel2').removeClass('text-success');
        $('#msgDel2').text('Error in delete comment!');
      }
    });
  });

  //CHANGE PASSWORD
  $('#changePassword').click(function () {
    var credentials = {
      oldPassword: '',
      newPassword: ''
    };

    var currentPassword = $("#currentPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();

    if(currentPassword != ''){
      if((newPassword === confirmPassword) && (newPassword != '')){
        $('#currentPassword').removeClass('border-danger');
        $('#newPassword').removeClass('border-danger');
        $('#confirmPassword').removeClass('border-danger');
        credentials.oldPassword = currentPassword;
        credentials.newPassword = newPassword;

        $.post('/changePassword', credentials, function(data, status) {
          if (data.success) {
            $('#msg').addClass('text-success');
            $('#msg').removeClass('text-danger');
            $('#msg').text(data.message);
            $("#currentPassword").val('');
            $("#newPassword").val('');
            $("#confirmPassword").val('');
            var delay = 500; 
            setTimeout(function(){location.reload(true)}, delay);
          } else {
            $('#msg').addClass('text-danger');
            $('#msg').removeClass('text-success');
            $('#msg').text(data.message);
          }
        });
      } else{
        $('#newPassword').addClass('border border-danger');
        $('#confirmPassword').addClass('border border-danger');
        $('#msg').addClass('text-danger');
        $('#msg').removeClass('text-success');
        $('#msg').text('Please enter a valid new password!');
      }
    } else{
      $('#currentPassword').addClass('border border-danger');
      $('#msg').addClass('text-danger');
      $('#msg').removeClass('text-success');
      $('#msg').text('Please enter your current password!');
    }
  });

  //PANE LINK TRUNCATOR
  if (location.hash) {
    const hash = url.split("#");
    $('#myTab a[href="#'+hash[1]+'"]').tab("show");
    url = location.href.replace(/\/#/, "#");
    history.replaceState(null, null, url);
    setTimeout(() => {
      $(window).scrollTop(0);
    }, 400);
  } 
  
  //PANE LINK SETTER
  $('a[data-toggle="tab"]').on("click", function() {
    let newUrl;
    const hash = $(this).attr("href");
    if(hash == "#home") {
      newUrl = url.split("#")[0];
    } else {
      newUrl = url.split("#")[0] + hash;
    }
    newUrl += "/";
    history.replaceState(null, null, newUrl);
  });
});