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
      "results": []
    }, function(output) {

      resolve(output);

    });

  })

}

const express = require('express')
const app = express();
const Handlebars = require('handlebars');

app.get("/", function(req, res) {

  var source = fs.readFileSync(__dirname + "/templates/search.html", "utf8");
  var template = Handlebars.compile(source);

  if (req.query.search) {

    search(req.query.search, 100).then(function(output) {

      res.send(template({
        results: output.results
      }));

    }, function(fail) {

      res.status(500).send("Error");

    })

  } else {

    res.send(template());

  }

})

app.use(express.static('static'));

app.listen(config.global.port, function() {
  console.log('Spider Web Crawler listening on port ' + config.global.port)
})
