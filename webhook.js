const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const appId = process.env.APP_ID;
let ebayApiUrl = 'http://svcs.ebay.com/services/search/FindingService/v1'
ebayApiUrl += '?OPERATION-NAME=findItemsByKeywords'
ebayApiUrl += '&SERVICE-VERSION=1.0.0';
ebayApiUrl += `&SECURITY-APPNAME=${appId}`;
ebayApiUrl += '&GLOBAL-ID=EBAY-US';
ebayApiUrl += '&RESPONSE-DATA-FORMAT=JSON';
ebayApiUrl += '&paginationInput.entriesPerPage=1';

app.post('/', bodyParser, (req, res) => {
  const { action, parameters } = req.body.result;

  switch (action) {
    case 'WEBHOOK_ACTION_PRODUCT':
      getProductData(parameters.product).then(data => res.send(data));
      break;
    
    case 'WEBHOOK_ACTION_PRODUCT_DEAL':
      getProductDealsData(parameters.product).then(data => res.send(data));
      break;

    case 'WEBHOOK_ACTION_JOKE':
      getDadJoke().then(data => res.send(data));
      break;
    
    default:
      res.send({
        speech: 'Uh oh! Something went wrong.',
        displayText: 'Uh oh! Something went wrong.',
        data: 'Uh oh! Something went wrong.',
        contextOut: [],
        source: ''
      });
  }
});

function getProductData(product) {
  const url = `${ebayApiUrl}&keywords=${product}`;

  return superagent
    .get(url)
    .then(data => {
      const response = JSON.parse(data.text);
      const selectedItem = response.findItemsByKeywordsResponse[0].searchResult[0].item[0];
      console.log(selectedItem);

      let responseText = `I found this "${product}" for you on eBay: ${selectedItem.title}`;
      responseText += ` The current bid price is $${selectedItem.sellingStatus[0].currentPrice[0]['__value__']}.`;
      responseText += ` Here's the link: ${selectedItem.viewItemURL}`;
      
      console.log('responseText', responseText);
      return {
        speech: responseText,
        displayText: responseText,
        data: responseText,
        contextOut: [],
        source: ''
      };
    })
    .catch(err => {
      console.log(err);
      return `I'm sorry, I couldn't find "${product}" for you on eBay.`;
    })
}

function getProductDealsData(product) {
  const url = `${ebayApiUrl}&keywords=${product}&ItemFilterType=BestOfferOnly=true`;

  return superagent
    .get(url)
    .then(data => {
      const response = JSON.parse(data.text);
      const selectedItem = response.findItemsByKeywordsResponse[0].searchResult[0].item[0];
      console.log(selectedItem);

      let responseText = `I found this deal on "${product}" for you on eBay: ${selectedItem.title}`;
      responseText += ` The current bid price is $${selectedItem.sellingStatus[0].currentPrice[0]['__value__']}.`;
      responseText += ` Here's the link: ${selectedItem.viewItemURL}`;

      console.log('responseText', responseText);
      return {
        speech: responseText,
        displayText: responseText,
        data: responseText,
        contextOut: [],
        source: ''
      };
    })
    .catch(err => {
      console.log(err);
      return `I'm sorry, I couldn't find a deal on "${product}" for you on eBay.`;
    })
}

function getDadJoke() {
  return superagent
    .get('https://icanhazdadjoke.com/')
    .set('Accept', 'application/json')
    .then(data => {
      const { joke } = data.body;
      console.log(joke);

      return {
        speech: joke,
        displayText: joke,
        data: joke,
        contextOut: [],
        source: ''
      };
    })
    .catch(err => console.log(err))
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});