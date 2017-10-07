var jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;

var request = require('request');

module.exports = {

  get: function(query) {

    return new Promise(function(resolve, reject) {

      request.get('https://www.gumtree.com/search?search_category=all&q=' + query.search, {}, function(err, res, body) {

        const dom = new JSDOM(body, {
          includeNodeLocations: true
        });

        var ads = dom.window.document.querySelectorAll(".listing-maxi");

        var results = [];

        for (i = 0; i < ads.length; i++) {

          results.push({
            title: ads[i].getElementsByClassName("listing-title")[0].textContent.trim(),
            location: ads[i].getElementsByClassName("listing-location")[0].textContent.trim(),
            description: ads[i].getElementsByClassName("listing-description")[0].textContent.trim(),
            price: ads[i].getElementsByClassName("listing-price")[0].textContent.trim(),
            image: ads[i].getElementsByTagName("img")[0] ? ads[i].getElementsByTagName("img")[0].getAttribute("data-lazy") : undefined,
            url: ads[i].getElementsByClassName("listing-link")[0] ? ads[i].getElementsByClassName("listing-link")[0].getAttribute("href") : undefined,
            timestamp: Date.now()
          });
        }

        // Trim nonsense from start

        results.shift();
        results.shift();
        results.shift();

        query.results.gumtree = results;

        resolve(query);

      });

    })

  }

}
