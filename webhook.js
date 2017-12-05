const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const appId = process.env.APP_ID;

app.post('/', bodyParser, (req, res) => {
  const { action, parameters } = req.body.result;

  switch (action) {
    case 'WEBHOOK_ACTION_PRODUCT':
      getProductData(parameters.product)
        .then(data => res.send(data));
      break;

    case 'WEBHOOK_ACTION_CHUCK':
      getChuckNorrisJoke()
        .then(data => res.send(data));
      break;
    
    default:
      res.send('Uh oh! Something went wrong.');
  }
});

function getProductData(product) {
  let url = 'http://svcs.ebay.com/services/search/FindingService/v1'
  url += '?OPERATION-NAME=findItemsByKeywords'
  url += '&SERVICE-VERSION=1.0.0';
  url += `&SECURITY-APPNAME=${appId}`;
  url += '&GLOBAL-ID=EBAY-US';
  url += '&RESPONSE-DATA-FORMAT=JSON';
  url += '&callback=_cb_findItemsByKeywords';
  url += '&REST-PAYLOAD';
  url += `&keywords=${product}`;
  url += '&paginationInput.entriesPerPage=3';

  return superagent
    .get(url)
    .then(data => {
      const length = data.text.length - 1;
      const parsedData = data.text.substring(28, length);
      const jsonObj = JSON.parse(parsedData)
      
      const selectedItem = jsonObj.findItemsByKeywordsResponse[0].searchResult[0].item[0];
      let responseText = `I found this ${product} for you on eBay: "${selectedItem.title}".`
      responseText += ` "${selectedItem.subtitle}."`;
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

function getChuckNorrisJoke() {
  return superagent
    .get('https://api.chucknorris.io/jokes/random')
    .then(data => {
      const jsonData = JSON.parse(data.text)
      const responseText = jsonData.value;
      console.log(responseText);

      return {
        speech: responseText,
        displayText: responseText,
        data: responseText,
        contextOut: [],
        source: ''
      };
    })
    .catch(err => console.log(err))
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});