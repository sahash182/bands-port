$(function() {
  // check if its connected
  console.log('I am here ');


  //search band to find bands from db 
$('#submit-band').on('click', function(){
  event.preventDefault();
  var bandObj = {
      name: $('#name').val(),
      genre: $('#genre').val(),
      zipCode: $('#zipCode').val(),
      picture: $('#picture').val(),
      about: $('#about').val()
    };

  $.ajax({
    type: "POST",
    url: "https://bands-port.herokuapp.com/api/bands",
    data: bandObj,
    sucess: function(){
      bands.save(data);
      window.location.reload();
    },
    error: function(){
      alert("Error!");
    }
  });
});

//get bands
$('#search-band').on('click', function(){
  event.preventDefault();













































});

  


































































