const router = require('express').Router();
const { containsKeys, getSchemaPathNames } = require('../helper');
const { Cinema } = require('../models');

router.get('/v1/cinemas', async (req, res) => {
  const cinemas = await Cinema.find().exec();
  res.json(cinemas);
});

router.get('/v1/cinemas/:id', async (req, res) => {
  if (req.params?.id) {
    const cinema = await Cinema.findById(req.params.id).exec();
    res.json(cinema);
  } else {
    res.status(400).json({ error: 'Wrong Request parameter' });
  }
});

router.post('/v1/cinemas', async (req, res) => {
  let body = req.body;
  let keysToCheck = getSchemaPathNames(Cinema.schema, true);
  if (body && containsKeys(body, keysToCheck)) {
    try {
      const newCinema = new Cinema({ name: body.name, seatRows: body.seatRows, seatsPerRow: body.seatsPerRow });
      await newCinema.save();
      let response = await Cinema.findById(newCinema._id).exec();
      res.send(response);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Wrong Request parameters' });
  }
});

module.exports = router