const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Cinema Schema & Model */
const cinemaSchema = Schema({
  name: String,
  seatRows: Number,
  seatsPerRow: Number
});
const Cinema = mongoose.model('Cinema', cinemaSchema);

/* Presentation Schema & Model */
const presentationSchema = Schema({
  cinema: { type: Schema.Types.ObjectId, ref: 'Cinema' },
  date: Date,
  movieTitle: String
});
const Presentation = mongoose.model('Presentation', presentationSchema);

/* Reservation Schema & Model */
const reservationSchema = Schema({
  presentation: { type: Schema.Types.ObjectId, ref: 'Presentation' },
  reservedSeats: Number,
  customerName: String
});
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = { Cinema, Presentation, Reservation };
