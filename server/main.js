const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.argv[2];
const path = require('path');
const mongoose = require('mongoose');
const { Cinema, Presentation, Reservation } = require('./models');

async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017/cinema-app');
}
connectDB().catch(err => console.log(err));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../', 'webapp/build')));

app.use(require('./routes/cinemas'));
app.use(require('./routes/presentations'));
app.use(require('./routes/reservations'));


app.listen(parseInt(port), () => {
  console.log(`Cinema-App Server running at port: ${port}`);
});
