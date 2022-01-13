const router = require('express').Router();
const { containsKeys, getSchemaPathNames, calculateFreeSeats } = require('../helper');
const { Reservation } = require('../models');
const QRCode = require('qrcode');

/* GET single reservation based on id */
router.get('/v1/reservations/:id', async (req, res) => {
  if (req.params?.id) {
    const presentation = await Reservation.findById(req.params.id).populate('presentation').exec();
    res.json(presentation);
  } else {
    // Error Handling
    res.status(400).json({ error: 'Wrong Request parameter' });
  }
});

/* POST create new reservation */
router.post('/v1/reservations', async (req, res) => {
  const body = req.body;
  // Check that all keys from Reservation.schema exists in body
  const keysToCheck = getSchemaPathNames(Reservation.schema, true);
  if (body && containsKeys(body, keysToCheck)) {
    // Check if seats are available:
    // calculate freeSeats
    const freeSeatsIncludingReservation = await calculateFreeSeats(body.presentation) - body.reservedSeats;

    if (freeSeatsIncludingReservation >= 0) {
      try {
        // Create Reservation
        const newReservation = new Reservation({
          presentation: body.presentation,
          reservedSeats: body.reservedSeats,
          customerName: body.customerName
        });
        await newReservation.save();

        // Get newly inserted Reservation with populated presentation and cinema
        const reservation = await Reservation.findById(newReservation._id).select('-__v').populate({
          path: 'presentation',
          select: '-__v-_id',
          populate: { path: 'cinema', select: '-__v-_id' }
        }).exec();

        // Create QR-Code and respond with it
        const response = await QRCode.toDataURL(JSON.stringify(reservation));

        res.json({ qrcode: response, reservation: reservation });
      } catch (error) {
        // Error Handling
        console.error(error);
        res.json({ error: error.message });
      }
    } else {
      // Error Handling
      res.status(410).json({ error: 'reservedSeats amount not available' });
    }
  } else {
    // Error Handling
    res.status(400).json({ error: 'Wrong Request parameters' });
  }
});

module.exports = router;
