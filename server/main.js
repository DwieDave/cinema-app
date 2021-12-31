const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.argv[2];
const path = require('path');
const mongoose = require('mongoose');

/* Connecting to MongoDB */
async function connectDB () {
  await mongoose.connect('mongodb://localhost:27017/cinema-app');
}
connectDB().catch(err => console.log(err));
// TODO: catch exit node.js program if connection fails;

/* Express: use BodyParser */
app.use(bodyParser.json());

/* Simple Middleware to redirect SinglePageApplication pages to index with redirect url-parameter */
app.use(function (req, res, next) {
  if (req.url.indexOf('/page/') !== -1) {
    const URIpath = encodeURIComponent(req.url);
    res.redirect('/?redirect=' + URIpath);
  } else next();
});

/* Static client hosting */
app.use(express.static(path.join(__dirname, '../', 'webapp/build')));

/* Express: use Routes for cinemas/presentations/reservations */
app.use(require('./routes/cinemas'));
app.use(require('./routes/presentations'));
app.use(require('./routes/reservations'));

/* Start server on port given via argument */
app.listen(parseInt(port), () => {
  console.log(`Cinema-App Server running at port: ${port}`);
});
