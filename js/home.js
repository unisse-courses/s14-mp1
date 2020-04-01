$("#postBtn").click(function() {
  var body = document.getElementById("newpost_body").value;
  var title = document.getElementById("newpost_title").value;



  if (title === "" && body === ""){
    alert("Fill out Missing Information");
  }
  else {

  $("#samplepost_container").append(" <div class='usercontainer'> " +
                      "<img src='media/avatar.png' class='avatar'>" +
                      "<h1 class='user'>Archer</h1>" +
                      "</div> " +

                      "<div class='mainpost'>"+
  
                      "<div class='titlepost'>" +
                      "<h3>Thoughts on Professor "+title+"</h3></div>" +
  

                      "<div class='bodypost'>" +
                      "<p>" + body + "</p>    </div></div>" 
                      );
  alert("Posted! :)");
  }
});