const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const appId = process.env.APP_ID;
let ebayApiUrl = 'http://svcs.ebay.com/services/search/FindingService/v1';
ebayApiUrl += '?OPERATION-NAME=findItemsByKeywords';
ebayApiUrl += '&SERVICE-VERSION=1.0.0';
ebayApiUrl += `&SECURITY-APPNAME=${appId}`;
ebayApiUrl += '&GLOBAL-ID=EBAY-US';
ebayApiUrl += '&RESPONSE-DATA-FORMAT=JSON';
ebayApiUrl += '&paginationInput.entriesPerPage=10';
ebayApiUrl += '&ItemFilterType=BestOfferOnly=true';
ebayApiUrl += '&itemFilter(0).name=Condition';
ebayApiUrl += '&itemFilter(0).value(0)=';

const ebayApiUrlNew = 1000;
const ebayApiUrlUsed = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', bodyParser, (req, res) => {
  const { action, parameters } = req.body.result;

  switch (action) {
    case 'WEBHOOK_ACTION_PRODUCT_NEW':
      getProductData(parameters.product, false)
        .then(data => res.send(data));
      break;
    
    case 'WEBHOOK_ACTION_PRODUCT_USED':
      getProductData(parameters.product, true)
        .then(data => res.send(data));
      break;

    case 'WEBHOOK_ACTION_JOKE':
      getDadJoke().then(data => res.send(data));
      break;
    
    default:
      res.send({
        speech: 'Uh oh! Something went wrong.',
        displayText: 'Uh oh! Something went wrong.'
      });
  }
});

function getProductData(product, used) {
  let url = `${ebayApiUrl}${used ? ebayApiUrlNew : ebayApiUrlNew}&keywords=${product}`;

  return superagent
    .get(url)
    .then(data => {
      const response = JSON.parse(data.text);
      const selectedItem = response.findItemsByKeywordsResponse[0].searchResult[0].item[0];
      const price = selectedItem.sellingStatus[0].currentPrice[0]['__value__'];
      let responseText = `I found this ${used ? 'USED' : 'NEW'}`;
      responseText += ` "${product}" for you on eBay: ${selectedItem.title}`;
      responseText += ` The current bid price is $${price}.`;
      responseText += ` Here's the link: ${selectedItem.viewItemURL}`;
      
      return {
        speech: responseText,
        displayText: responseText
      };
    })
    .catch(err => {
      console.log(err);
      return {
        speech: `I'm sorry, I couldn't find "${product}" for you on eBay.`,
        displayText: `I'm sorry, I couldn't find "${product}" for you on eBay.`
      };
    });
}

function getDadJoke() {
  return superagent
    .get('https://icanhazdadjoke.com/')
    .set('Accept', 'application/json')
    .then(data => {
      const { joke } = data.body;

      return {
        speech: joke,
        displayText: joke
      };
    })
    .catch(err => {
      console.log(err);
      return {
        speech: 'I\'m sorry, I don\'t feel like joking around right now',
        displayText: 'I\'m sorry, I don\'t feel like joking around right now'
      };
    });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});