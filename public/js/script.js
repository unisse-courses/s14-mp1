window.addEventListener('load', () => {
  var profRef = '';
  var profNumber = 0;
  let url = location.href.replace(/\/$/, "");

  //FRONTEND - ADD REVIEW
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

  //BACKEND - ADD USER
  $('#addUser').click(function() {
    var newUser = {
        studentName: $('#studentName').val(),
        studentId: $('#studentId').val(),
        password: '',
        isAdmin: $("input[name='studentAdmin']:checked").val(),
      };

    var studentName = $("#studentName").val();
    var studentId = $("#studentId").val();
    var studentPass1 = $("#studentPass1").val();
    var studentPass2 = $("#studentPass2").val();

    if(studentName === '')$('#studentName').addClass('border border-danger');
    else $('#studentName').removeClass('border-danger');

    if(studentId === '') $('#studentId').addClass('border border-danger');
    else $('#studentId').removeClass('border-danger');

    if((studentPass1 === studentPass2) && (studentPass1 != '')) {
      newUser.password = studentPass1;
      $('#studentPass1').removeClass('border-danger');
      $('#studentPass2').removeClass('border-danger');
      $.post('/addUser', newUser, function(data, status) {
        if (data.success) {
          $('#msg').addClass('text-success');
          $('#msg').removeClass('text-danger');
          $('#msg').text(data.message);
          $("#studentName").val('');
          $("#studentId").val('');
          $("#studentPass1").val('');
          $("#studentPass2").val('');
          $('input[name="studentAdmin"]:checked').prop('checked', false);
          var delay = 500; 
          setTimeout(function(){location.reload(true)}, delay);
        } else {
          $('#msg').addClass('text-danger');
          $('#msg').removeClass('text-success');
          $('#msg').text(data.message);
        }
      });        
    } else{
      $('#studentPass1').addClass('border border-danger');
      $('#studentPass2').addClass('border border-danger');
      $('#msg').addClass('text-danger');
      $('#msg').removeClass('text-success');
      $('#msg').text('Please enter necessary information!');
    }
  });

  //BACKEND - ADD PROFESSOR
  $('#addProfessor').click(function() {
    var newProfessor = {
      profName: $("#profName").val(),
      gender: $("input[name='profGender']:checked").val(),
      college: $('#profCollege').find(":selected").text(),
      profCourse: $("#profCourse").val()
    };

    if(newProfessor.profName === '')$('#profName').addClass('border border-danger');
    else $('#profName').removeClass('border-danger');

    if(newProfessor.college === 'Choose...')$('#profCollege').addClass('border border-danger');
    else $('#profCollege').removeClass('border-danger');

    if(newProfessor.profCourse === '')$('#profCourse').addClass('border border-danger');
    else $('#profCourse').removeClass('border-danger');

    $.post('/addProfessor', newProfessor, function(data, status) {
      console.log(data);

      if (data.success) {
        $('#msg').addClass('text-success');
        $('#msg').removeClass('text-danger');
        $('#msg').text(data.message);
        $('input[name="gender"]:checked').prop('checked', false);
        $('#profName').val('');
        var delay = 500; 
        setTimeout(function(){location.reload(true)}, delay);
      } else {
        $('#msg').addClass('text-danger');
        $('#msg').removeClass('text-success');
        $('#msg').text(data.message);
      }
    });
  });

  //FRONTEND - ADD COMMENT
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

  //FRONTEND - QUICK REVIEW - DYNAMIC COLLEGE
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

  //FRONTEND - QUICK REVIEW - DYNAMIC COURSE
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

  //FRONTEND - EDIT POST / COMMENT
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

  //FRONTEND - EDIT POST (CLOSE)
  $('#editPostClose').click(function(){
    document.getElementById('modalCommentContent').innerHTML = ""; 
    document.getElementById('modalEditPostCourse').value = "";  
    document.getElementById('modalEditPostProfessor').value = "";    
  });

  //FRONTEND - EDIT COMMENT (CLOSE)
  $('#editCommentClose').click(function () {
    document.getElementById('modalCommentContent').innerHTML = "";
    document.getElementById('modalEditCommentCourse').value = "";
    document.getElementById('modalEditCommentProfessor').value = "";
  });

  // FRONT END - EDIT POST (SAVE)
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

  // FRONT END - EDIT COMMENT (SAVE)
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

  //FRONT END - DELETE POST
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

  //FRONT END - DELETE COMMENT
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

  //FRONT END - CHANGE PASSWORD
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

  //SITEWIDE - PANE LINK TRUNCATOR
  if (location.hash) {
    const hash = url.split("#");
    $('#myTab a[href="#'+hash[1]+'"]').tab("show");
    url = location.href.replace(/\/#/, "#");
    history.replaceState(null, null, url);
    setTimeout(() => {
      $(window).scrollTop(0);
    }, 400);
  } 
  
  //SITEWIDE - PANE LINK SETTER
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