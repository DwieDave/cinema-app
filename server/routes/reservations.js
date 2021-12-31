const router = require('express').Router();
const { containsKeys, getSchemaPathNames } = require('../helper');
const { Reservation, Presentation } = require('../models');
const QRCode = require('qrcode');

router.get('/v1/reservations/:id', async (req, res) => {
  if (req.params?.id) {
    const presentation = await Reservation.findById(req.params.id).populate('presentation').exec();
    res.json(presentation);
  } else {
    res.status(400).json({ error: 'Wrong Request parameter' });
  }
});

/* POST create new reservation */
router.post('/v1/reservations', async (req, res) => {
  const body = req.body;
  const keysToCheck = getSchemaPathNames(Reservation.schema, true);
  if (body && containsKeys(body, keysToCheck)) {
    // Check if seats are available
    const presentation = await Presentation.findById(body.presentation).populate('cinema').exec();
    const totalSeats = presentation.cinema.seatRows * presentation.cinema.seatsPerRow;
    const reservedSeats = await Reservation.aggregate([
      {
        $group: {
          _id: { presentation: body.presentation },
          count: { $sum: '$reservedSeats' }
        }
      }
    ]).exec();

    const freeSeats = totalSeats - (reservedSeats[0].count + body.reservedSeats);
    if (freeSeats >= 0) {
      try {
        // Create Reservation
        const newReservation = new Reservation({
          presentation: body.presentation,
          reservedSeats: body.reservedSeats,
          customerName: body.customerName
        });
        await newReservation.save();

        // Create QR-Code and respond with it
        const response = await QRCode.toDataURL(`reservation_id:${newReservation._id}`);
        res.json({ qrcode: response });
      } catch (error) {
        console.error(error);
        res.json({ error: error.message });
      }
    } else {
      res.status(410).json({ error: 'reservedSeats amount not available' });
    }
  } else {
    res.status(400).json({ error: 'Wrong Request parameters' });
  }
});

module.exports = router;
