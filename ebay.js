var request = require('request');

module.exports = {

  get: function(query) {

    return new Promise(function(resolve, reject) {

      var params = {

        "OPERATION-NAME": "findItemsByKeywords",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": "FilipHnz-spiderwe-PRD-45d865283-42e705e9",
        "GLOBAL-ID": "EBAY-GB",
        "RESPONSE-DATA-FORMAT": "JSON",
        "keywords": query.search

      }

      var url = "http://svcs.ebay.com/services/search/FindingService/v1?" + Object.keys(params).map(function(key) {
        return key + '=' + params[key];
      }).join('&');

      request(url, function(error, response, body) {

        var response = JSON.parse(body).findItemsByKeywordsResponse[0].searchResult[0].item;

        if (response) {

          response.forEach(function(item) {

            try {

            if (item.title && item.galleryURL && item.location && item.viewItemURL) {

              query.results[item.title[0]] = {

                "title": item.title[0],
                "product_img_url": item.galleryURL[0],
                "post_geolocation": item.location[0],
                "url": item.viewItemURL[0],
                "date_listed": Date.now(),
                "source": "ebay"

              }

            }

          } catch(e){

            console.log(e);

          }

          })

        }

        resolve(query);

      });

    })

  }

}
