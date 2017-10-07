var ebay = require('ebay-api');

var params = {
  keywords: ["Canon", "Powershot"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 10
  },

  itemFilter: [
    {name: 'FreeShippingOnly', value: true},
    {name: 'MaxPrice', value: '150'}
  ],

  domainFilter: [
    {name: 'domainName', value: 'Digital_Cameras'}
  ]
};

ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: '......................',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
    params: params,
    parser: ebay.parseResponseJson    // (default)
  },
  // gets all the items together in a merged array
  function itemsCallback(error, itemsResponse) {
    if (error) throw error;

    var items = itemsResponse.searchResult.item;
    

  }
);
