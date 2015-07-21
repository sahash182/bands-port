//requiring test library chai and request
var request = require('request')
  , expect = require('chai').expect


// testing the home page routes
describe('PortsOFBands,  Welcome', function(){
  it('should have a HTTP of 200 - success', function(done){
    request('https://bands-port.herokuapp.com/', function(err, res, body){
      expect(res.statusCode).to.equal(200)
      done();
    });
  });
});

//testing the get requests 
describe('check to see if its getting all the bands Data', function(){
  it('should get all the bands from the database', function(done){
    request('https://bands-port.herokuapp.com/api/bands', function(err, res, body){
      expect(res.statusCode).to.equal(200)
      done();
    });
  });
});