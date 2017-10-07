var fs = require("fs");

// Read config

global.config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));
global.searchParams = JSON.parse(fs.readFileSync(__dirname + "/search.json"));

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

var searchPromises = [];
var searchResults = {};

Object.keys(searchParams.species).forEach(function(realspecies) {

  var species = searchParams.species[realspecies];

  species.forEach(function(species) {

    var promise = new Promise(function(resolve, reject) {

      search(species).then(function(output) {

        // Filter out excludes

        Object.keys(output.results).forEach(function(id) {

          var item = output.results[id];

          var exclude;

          searchParams.exclude.forEach(function(exclude) {

            if (item.title.indexOf(exclude) !== -1) {

              exclude = true;

            }

          })

          if (exclude) {

            delete output.results[id];

          } else {

            if (!output.results[id].score) {

              output.results[id].score = 0

            }

            Object.keys(searchParams.lookoutforweighting).forEach(function(pointWord) {

              if (output.results[id].title.indexOf(pointWord) !== -1) {

                output.results[id].score += searchParams.lookoutforweighting[pointWord]

              }

            })

          }

          if (!item.species) {

            item.species = []

          }

          if (item.species.indexOf(realspecies) === -1) {

            item.species.push(realspecies)

          }

        });

        searchResults = Object.assign(output.results, searchResults);

        resolve();

      });

    })

    searchPromises.push(promise);

  })

})

var Datastore = require('nedb'),
  db = new Datastore({
    filename: __dirname + '/database/database.db',
    autoload: true
  });

var request = require("request");

Promise.all(searchPromises).then(function() {

  Object.keys(searchResults).forEach(function(id) {

    searchResults[id].uuid = id;

    var options = {
      method: 'POST',
      url: config.global.dbServer + '/post',
      headers: {
        'postman-token': 'ebbd654f-be23-4cc0-29e3-a36796d62b1f',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData: searchResults[id]
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });

  })

})

const express = require('express')
const app = express();
const Handlebars = require('handlebars');

app.get("/", function(req, res) {

  var source = fs.readFileSync(__dirname + "/templates/search.html", "utf8");
  var template = Handlebars.compile(source);

  if (req.query.search) {

    search(req.query.search, 1).then(function(output) {

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
