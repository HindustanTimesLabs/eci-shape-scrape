var list = ["ANDHRAPRADESH", "ARUNACHALPRADESH-AC", "ASSAM-AC", "BIHAR-AC", "GOA-AC", "GUJARAT-AC", "HARYANA-AC", "HIMACHALPRADESH-AC", "KARNATAKA-AC", "KERALA-AC", "MADHYAPRADESH-AC", "MAHARASHTRA-AC", "MANIPUR-AC", "MEGHALAYA-AC", "MIZORAM-AC", "ORISSA-AC", "PUNJAB-AC", "RAJASTHAN-AC", "SIKKIM-AC", "TAMILNADU-AC", "TRIPURA-AC", "UTTARPRADESH-AC", "WESTBENGAL-AC", "CHHATTISGARH-AC", "JHARKHAND-AC", "UTTARKHAND-AC", "TELANGANA", "CHANDIGARH", "DADRA", "DAMAN", "DELHI-AC", "PUDUCHERRY-AC"];

var http = require("http"),
  fs = require("fs"),
  _ = require("underscore");

_.rateLimit = function(func, rate, async) {
  var queue = [];
  var timeOutRef = false;
  var currentlyEmptyingQueue = false;

  var emptyQueue = function() {
    if (queue.length) {
      currentlyEmptyingQueue = true;
      _.delay(function() {
        if (async) {
          _.defer(function() { queue.shift().call(); });
        } else {
          queue.shift().call();
        }
        emptyQueue();
      }, rate);
    } else {
      currentlyEmptyingQueue = false;
    }
  };

  return function() {
    var args = _.map(arguments, function(e) { return e; }); // get arguments into an array
    queue.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
    if (!currentlyEmptyingQueue) { emptyQueue(); }
  };
};

var start = 1, end = 2;

var rl = _.rateLimit(r, 800)

list.forEach(function(d){
  rl(d);
})

function r(d){

  var file = fs.createWriteStream("zip/" + d + ".zip");
  http.get("http://psleci.nic.in/kml/" + d + ".zip", function(response, err) {

    if (!err && response.statusCode == "200"){
      console.log("Scraping " + d);
      response.pipe(file);
    }

  });
}
