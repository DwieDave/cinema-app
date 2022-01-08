const router = require('express').Router();
const { containsKeys, getSchemaPathNames } = require('../helper');
const { Cinema } = require('../models');

/* GET all cinemas */
router.get('/v1/cinemas', async (req, res) => {
  const cinemas = await Cinema.find().select('-__v').exec();
  res.json(cinemas);
});

/* GET single cinema */
router.get('/v1/cinemas/:id', async (req, res) => {
  if (req.params?.id) {
    const cinema = await Cinema.findById(req.params.id).select('-__v').exec();
    res.json(cinema);
  } else {
    // Error Handling
    res.status(400).json({ error: 'Wrong Request parameter' });
  }
});

/* POST create a new cinema */
router.post('/v1/cinemas', async (req, res) => {
  const body = req.body;
  // Check that all keys from Cinema.schema exists in body
  const keysToCheck = getSchemaPathNames(Cinema.schema, true);
  if (body && containsKeys(body, keysToCheck)) {
    try {
      const newCinema = new Cinema({ name: body.name, seatRows: body.seatRows, seatsPerRow: body.seatsPerRow });
      await newCinema.save();
      const response = await Cinema.findById(newCinema._id).select('-__v').exec();
      res.send(response);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  } else {
    // Error Handling
    res.status(400).json({ error: 'Wrong Request parameters' });
  }
});

module.exports = router;
