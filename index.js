var fs = require("fs");

// Read config

global.config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var processChain = function(tasks, parameters, success, fail) {

  tasks.reduce(function(cur, next) {
    return cur.then(next);
  }, Promise.resolve(parameters)).then(success, fail);

};

var services = config.services.map(function(element) {

  return require("./" + element).get;

});

var search = function(search, count, dateFrom, dateTo) {

  return new Promise(function(resolve, reject) {

    processChain(services, {
      "search": search,
      "count": count,
      "results": {}
    }, function(output) {

      resolve(output);

    });

  })

}

search("tarantula", 100).then(function(output) {

  // Output

  console.log(output);

})
