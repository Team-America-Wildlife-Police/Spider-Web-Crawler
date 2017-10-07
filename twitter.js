var Twitter = require('twitter');
var client = new Twitter(config.twitter);

module.exports = {

  get: function(query) {

    var params = {
      q: query.search,
      include_entities: false,
      count: query.count || 1
    };

    return new Promise(function(resolve, reject) {

      client.get('search/tweets', params, function(error, tweets, response) {

        if (!error) {

          // Add tweets to results

          query.results.twitter = tweets.statuses;

          resolve(query);

        }

      });

    });

  }

}
