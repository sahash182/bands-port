$(function() {

  var baseUrl = "http://localhost:3000"; // mongoDB localhost
  // var baseUrl = "https://bands-port.herokuapp.com" //mongoDB heroku

  //template
  $band = _.template($('#bandTemplate').html());

  //search with requested zipcode
  $('#search-band').on('submit', function(event){
    event.preventDefault();
    //find the ones with the matching zipcode
      userZipcode = $('#zip-code').val();
      $.get('/api/bands/' + userZipcode, function(data){
          var bands = data;  
          console.log(bands);

          // $('#bands').append($band(bands));
          // console.log($("#search-band").val()); 
          _.each(bands, function(band) {
            console.log(band);
            $('#bands').append($band(band));
          });
      }).fail(function(){
         alert("cannot find on That ZIP Code");
      }); 
  });


  //add band to find bands from db 
  $('#submit-band').on('click', function(event){
    event.preventDefault();
    var bandObj = {
        name: $('#name').val(),
        genre: $('#genre').val(),
        zipCode: $('#zip-code').val(),
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
        window.location.reload();
      }
    });
    $('#add-band').modal('hide');
  });

  $.get("/me", function(data) {
        if (data == null) {
            // NOT LOGGED IN
            console.log("NOT LOGGED IN")
            $("#login-btn").css("display", "inline");
            $("#signup-btn").css("display", "inline");
           $("#logout-btn").css("display", "none");
        } else {
            // SUCCESS
            console.log(data.firstName + " is logged in.")
            $("#login-btn").css("display", "none");
            $("#signup-btn").css("display", "none");
           $("#logout-btn").css("display", "inline");
           //loop through user's votes array and change vote icon color if present in array

        }
    });

  // auth sign up /login logout

  //signup form
  $('#signup').on('submit', function (event) {
    event.preventDefault();

    var user = {
      firstName: $('#signup-firstName').val(),
      lastName: $('#signup-lastName').val(),
      email: $('#signup-email').val(),
      password: $('#signup-password').val()
    };
    if (user.password.length >= 5) {
      //send request to server to create new user
      $.post('/signup', user, function(data) {
        console.log(data);
        //Append welcome user to header
        $('#header').append("welcome user");
        location.reload();
      });
      //hide modal
      $('#signup-modal').modal('hide');
      //reset the form
          $(this)[0].reset();

          location.reload();
    } else {
      alert("Password must be at least 5 characters long.");
    }   
    });



  //login existing user with auth process in server 
  $('#login').on('submit', function (event) {
    console.log("form submit");
    event.preventDefault();

    var user = {
      email: $('#login-email').val(),
      password: $('#login-password').val()
    };
    $.post('/login', user, function (data) {
        console.log(data.firstName + "is logged in");
        $('#header').append("welcome user: " +  data.firstName);
        location.reload();
    });

    $('#login-modal').modal('hide');
  });

  //logout existing user
  $('#logout-btn').on('click', function(event){
    event.preventDefault();
    $.get('/logout', function(){
      console.log('you are logged out now');
    });
    location.reload();
  });



});



