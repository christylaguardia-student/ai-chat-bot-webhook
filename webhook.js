const express = require('express');
const app = express();
const request = require('superagent');
const PORT = process.env.PORT || 3000;

app.post('/', (req, res) => {
  request
    .get('https://api.chucknorris.io/jokes/random')
    .then(response => res.send(response.body.value))
    .catch(err => console.log(err))
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});