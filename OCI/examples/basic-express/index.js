const express = require('express')
const app = express()
const port = process.env.NODE_ENV === 'production' ? 80 : 3000
console.log(process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.send('Bryan is indeed awesome');
});

app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
