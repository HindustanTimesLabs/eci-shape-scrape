var walk = require("walk"),
  fs = require("fs"),
  unzip = require("unzip");

var files = [];

// Walker options
var walker  = walk.walk("zip", { followLinks: false });

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
    fs.createReadStream("zip/" + d).pipe(unzip.Extract({ path: "kml" }));
  });
});
