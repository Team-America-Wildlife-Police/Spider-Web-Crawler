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

const express = require('express')
const app = express()

app.get("/", function(req, res) {

  console.log(req.query);

  if (req.query.search) {

    search("tarantula", 100).then(function(output) {

      res.json(output.results);

    }, function(fail) {

      res.status(500).send("Error");

    })

  } else {

    res.send(`

        <form>

        <input name="search" placeholder="search"/>

        <input type="submit"/>

        </form>


      `);

  }

})

app.listen(config.global.port, function() {
  console.log('Example app listening on port ' + config.global.port)
})
