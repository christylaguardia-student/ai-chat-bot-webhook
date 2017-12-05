const express = require('express');
const app = express();
const request = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const appId = process.env.APP_ID;
const searchTerm = 'harry%20potter';

let url = 'http://svcs.ebay.com/services/search/FindingService/v1'
url += '?OPERATION-NAME=findItemsByKeywords'
url += '&SERVICE-VERSION=1.0.0';
url += `&SECURITY-APPNAME=${appId}`;
url += '&GLOBAL-ID=EBAY-US';
url += '&RESPONSE-DATA-FORMAT=JSON';
url += '&callback=_cb_findItemsByKeywords';
url += '&REST-PAYLOAD';
url += `&keywords=${searchTerm}`;
url += '&paginationInput.entriesPerPage=3';
url += '&itemFilter(0).name=MaxPrice';
url += '&itemFilter(0).value=25';
url += '&itemFilter(0).paramName=Currency';
url += '&itemFilter(0).paramValue=USD';
url += '&itemFilter(1).name=FreeShippingOnly';
url += '&itemFilter(1).value=true';
url += '&itemFilter(2).name=ListingType';
url += '&itemFilter(2).value(0)=AuctionWithBIN';
url += '&itemFilter(2).value(1)=FixedPrice';
url += '&itemFilter(2).value(2)=StoreInventory';

app.post('/', (req, res) => {
  console.log('req.params', req.params);

  return request
    .get(url)
    .then(data => {
      const length = data.text.length - 1;
      const parsedData = data.text.substring(28, length);
      const jsonObj = JSON.parse(parsedData)
      const webhookObj = {
        speech: jsonObj,
        displayText: jsonObj,
        data: jsonObj,
        contextOut: [],
        source: "",
        followupEvent: {}
      };
      res.setHeader('Content-type', 'application/json');
      res.send(webhookObj);
    })
    .catch(err => console.log(err))
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});