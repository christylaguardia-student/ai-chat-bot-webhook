const express = require('express');
const app = express();
const request = require('superagent');
const PORT = process.env.PORT || 3000;

app.post('/', (req, res) => {
  return request
    .get('https://api.chucknorris.io/jokes/random')
    .then(joke => res.send(joke.text))
    .catch(err => console.log(err))
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});