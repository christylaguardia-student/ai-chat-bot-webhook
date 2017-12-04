const express = require('express');
const app = express();
const request = require('superagent');
const PORT = process.env.PORT || 3000;

app.use('/', (req, res) => {
  return request
    .get('https://api.chucknorris.io/jokes/random')
    .then(res => {
      console.log('chuck norris says:', res.body.value)
      return res.body.value;
    })
    .catch(err => console.log(err.status, 'error', err));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});