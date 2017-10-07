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

          tweets.statuses.forEach(function(item) {

            query.results[item.id_str] = {
              title: item.text,
              username: item.user.screen_name,
              post_geolocation: item.user.location,
              prouct_img_url: item.entities.media ? item.entities.media[0].media_url : undefined,
              source: "twitter",
              date_listed: Date.now(),
              url: "https://twitter.com/statuses/" + item.id_str

            }

          })

          resolve(query);

        }

      });

    });

  }

}
