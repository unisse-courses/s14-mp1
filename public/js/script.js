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
});