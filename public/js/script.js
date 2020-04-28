$(document).ready(function() {

  // POST called
  $('#addReview').click(function() {
    // Get the data from the form
    var newReview = {
      profRef: $('#revProfRef').text(),
      profName: $('#revProfName').find(":selected").text(),
      profNumber: $('#revProfNum').text(),
      profCourse: $('#revProfCourse').find(":selected").text(),
      studentRef: $('#revStudentRef').text(),
      studentId: $('#revStudentId').text(),
      reviewContent: $("textarea#revContent").val()
    };

    $.post('/addReview', newReview, function(data, status) {
      console.log(data);

      if (data.success) {
        $('#msg').addClass('text-success');
        $('#msg').removeClass('text-danger');
        $('#msg').text('Successfully added review!');
        $('#revProfRef').val('');
        $('#revProfNum').val('');
        $('#revStudentRef').val('');
        $('#revStudentId').val('');
        $('textarea#revContent').val('');
      } else {
        $('#msg').addClass('text-danger');
        $('#msg').removeClass('text-success');
        $('#msg').text('Error in adding review!');
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
        profItem += "<option>" + value + "</option>";
      });
      prof.innerHTML = profItem;
    });
  });
});