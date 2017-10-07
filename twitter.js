var Twitter = require('twitter');
var client = new Twitter(config.twitter);

module.exports = {

  get: function(query) {

    var params = {
      q: query.search,
      include_entities: true,
      count: query.count || 1
    };

    return new Promise(function(resolve, reject) {

      client.get('search/tweets', params, function(error, tweets, response) {

        if (!error) {

          // Add tweets to results

          tweets.statuses = tweets.statuses.map(function(item) {

            return {
              title: item.text,
              user: item.user.screen_name,
              location: item.user.location,
              image: item.entities.media ? item.entities.media[0].media_url : undefined,
              source: "twitter",
              timestamp: Date.now(),
              url: "https://twitter.com/statuses/" + item.id_str

            }

          })

          query.results = query.results.concat(tweets.statuses);

          resolve(query);

        }

      });

    });

  }

}
