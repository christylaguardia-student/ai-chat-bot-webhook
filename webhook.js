const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const appId = process.env.APP_ID;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', bodyParser, (req, res) => {
  const { action, parameters } = req.body.result;

  switch (action) {
    case 'WEBHOOK_ACTION_PRODUCT':
      getProductData(parameters.product, parameters.condition)
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

function getProductData(product, condition) {
  let url = 'http://svcs.ebay.com/services/search/FindingService/v1';
  url += '?OPERATION-NAME=findItemsByKeywords';
  url += '&SERVICE-VERSION=1.0.0';
  url += `&SECURITY-APPNAME=${appId}`;
  url += '&GLOBAL-ID=EBAY-US';
  url += '&RESPONSE-DATA-FORMAT=JSON';
  url += '&paginationInput.entriesPerPage=10';
  url += '&ItemFilterType=BestOfferOnly=true';
  url += '&itemFilter(0).name=Condition';
  url += `&itemFilter(0).value(0)=${condition === 'new' ? 1000 : 3000}`;
  url += `&keywords=${product}`;

  
  return superagent
    .get(url)
    .then(data => {
      const response = JSON.parse(data.text);
      const selectedItem = response.findItemsByKeywordsResponse[0].searchResult[0].item[0];
      const price = selectedItem.sellingStatus[0].currentPrice[0]['__value__'];
      let responseText = `I found this ${condition} "${product}" for you on eBay:`;
      responseText += ` ${selectedItem.title}`;
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