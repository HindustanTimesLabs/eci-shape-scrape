var walk = require("walk"),
  fs = require("fs"),
  tj = require("togeojson"),
  DOMParser = require("xmldom").DOMParser;

var files = [];

// Walker options
var walker  = walk.walk("kml", { followLinks: false });

walker.on("file", function(root, stat, next) {
    // Add this file to the list of files
    var f = stat.name;
    if (f != ".DS_Store"){
      files.push(stat.name);
    }
    next();
});

walker.on("end", function() {
  files.forEach(function(d, i){

    console.log("Converting " + d);
    var kml = new DOMParser().parseFromString(fs.readFileSync("kml/" + d, "utf8"));
    var converted = tj.kml(kml);
    var convertedWithStyles = tj.kml(kml, { styles: true });
    var json = JSON.stringify(convertedWithStyles);
    fs.writeFile("json/" + d.split(".")[0] + ".json", json, "utf8", function(err){
      if (err){
        console.log(err);
      }
    });

  });
});
