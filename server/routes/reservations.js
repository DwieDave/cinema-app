const router = require('express').Router();
const { containsKeys, getSchemaPathNames } = require('../helper');
const { Reservation } = require('../models');

router.post('/v1/reservations', async (req, res) => {
    let body = req.body;
    let keysToCheck = getSchemaPathNames(Reservation.schema, true);
    if (body && containsKeys(body, keysToCheck)) {
        //TODO: Check if seats are available
        try {
            const newReservation = new Reservation({
                presentation: body.presentation,
                reservedSeats: body.reservedSeats,
                customerName: body.customerName,
            });
            await newReservation.save();
            let response = await Reservation.findById(newReservation._id).populate('presentation').exec();
            //TODO: Create and respond with QR-Code!
            res.send(response);
        } catch (error) {
            console.error(error);
            res.send('error: ', error.message);
        }
    } else {
        res.status(400).json({ error: 'Wrong Request parameters' });
    }
});

module.exports = router;