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

  $('#addComment').click(function() {
    var newComment = {
      reviewRef: $('#commProf').find(":selected").text(),
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
    var id = $(this).data('id');
    var content = $(this).data('content');
    var course = $(this).data('course');
    var profName = $(this).data('profname');
 
    document.getElementById('modalReviewRef').value = id; 
    document.getElementById('modalCommentContent').innerHTML = content; 
    document.getElementById('modalEditPostCourse').value = course;  
    document.getElementById('modalEditPostProfName').value = profName;       
  });

  $('#editPostClose').click(function(){
    document.getElementById('modalCommentContent').innerHTML = ""; 
    document.getElementById('modalEditPostCourse').value = "";  
    document.getElementById('modalEditPostProfessor').value = "";    
  });

  $('#savePost').click(function() {
    var post = {
      reviewRef: $('#modalReviewRef').val(),
      commentContent: $('#modalCommentContent').val()
    };

    $.post('/savePost', post, function(data, status) {
      console.log(data);
      if (data.success) {
        $('#msgEd').addClass('text-success');
        $('#msgEd').removeClass('text-danger');
        $('#msgEd').text(data.message);
      } else {
        $('#msgEd').addClass('text-danger');
        $('#msgEd').removeClass('text-success');
        $('#msgEd').text(data.message);
      }
    });
  });

  if (location.hash) {
    const hash = url.split("#");
    $('#myTab a[href="#'+hash[1]+'"]').tab("show");
    url = location.href.replace(/\/#/, "#");
    history.replaceState(null, null, url);
    setTimeout(() => {
      $(window).scrollTop(0);
    }, 400);
  } 
   
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