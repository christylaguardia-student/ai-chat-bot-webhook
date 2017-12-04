const request = require('superagent');

request
  .get('https://api.chucknorris.io/jokes/random')
  .then(res => res.body)
  .catch(err => console.log(err.status, 'error', err));