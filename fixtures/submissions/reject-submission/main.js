const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>dimassautra</h1>');
});

app.listen(9000);