const express = require('express');
const app = express();
const port = process.argv[2];
const path = require('path');

app.use(express.static(path.join(__dirname, '../', 'webapp/build')));

app.get('/debug', function (req, res) {
  res.send(JSON.stringify(process.argv));
});

app.listen(parseInt(port), () => {
  console.log(`Cinema-App Server running at port: ${port}`);
});
