const express = require('express');
const app = express();
const port = process.argv[2];
const path = require('path');
const mongoose = require('mongoose');
const { Cinema, Presentation, Reservation } = require('./models');

async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017/cinema-app');
}
connectDB().catch(err => console.log(err));

app.use(express.static(path.join(__dirname, '../', 'webapp/build')));

app.get('/newCinema', (req, res) => {
  const newCinema = new Cinema({ name: "Kinosaal 2", seatRows: 15, seatsPerRow: 30 });
  newCinema.save();

  const newPresentation = new Presentation({ cinema: newCinema._id, date: Date.now(), movieTitle: "Avengers: Endgame" });
  newPresentation.save();

  const newReservation = new Reservation({ presentation: newPresentation._id, reservedSeats: 2, customerName: "John Doe" });
  newReservation.save();
  res.send("success");
});

app.get('/presentation', async (req, res) => {
  const presentation = await Presentation.find().populate('cinema', 'name').exec();
  res.json(presentation);
});

app.get('/debug', (req, res) => {
  res.send(JSON.stringify(process.argv));
});

app.listen(parseInt(port), () => {
  console.log(`Cinema-App Server running at port: ${port}`);
});
