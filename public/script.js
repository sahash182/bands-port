$(function() {
  // check if its connected
  console.log('I am here ');
  var baseUrl = "http://localhost:3000"; // mongoDB localhost
  // var baseUrl = "https://bands-port.herokuapp." //mongoDB heroku

  $band = _.template($('#bandTemplate').html());

  $.get(baseUrl + '/api/bands', function(data){
    var bands = data;
    
     _.each(bands, function(band) {
      console.log(band);
      $('#bands').append($band(band));
    });
  });



  //add band to find bands from db 
$('#submit-band').on('click', function(){
  event.preventDefault();
  var bandObj = {
      name: $('#name').val(),
      genre: $('#genre').val(),
      zipCode: $('#zipCode').val(),
      about: $('#about').val(),
      picture: $('#picture').val()
  };
  console.log(bandObj);
    //posting to database
  $.ajax({
    type: "POST",
    url: "/api/bands",
    data: bandObj,
    sucess: function(data){
      console.log(data);
      // window.location.reload();
    } 
  });
});

//get bands
$('#search-band').on('click', function(){
  event.preventDefault();
  console.log('hello');
  $.ajax({
    type: "GET",
    url: "/api/bands",
    success: function(data) {
      var template = _.template($("#band-template").html());
          _.each(data, function(band) {
          $("#band-container").append(template(band));
      });
    }
  // window.location.href = ("search.html");
  });
});



});

  


































































