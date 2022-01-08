const router = require('express').Router();
const { containsKeys, getSchemaPathNames, calculateFreeSeats, clone } = require('../helper');
const { Presentation } = require('../models');

/* GET all presentations */
router.get('/v1/presentations', async (req, res) => {
  // Get presentations with populated cinema & Clone presentations to allow modification
  const presentations = clone(await Presentation.find().select('-__v').populate('cinema', '-__v').exec());

  await Promise.all(presentations.map(async presentation => {
    presentation.freeSeats = await calculateFreeSeats(presentation._id);
  }));

  res.json(presentations);
});

/* GET single presentation */
router.get('/v1/presentations/:id', async (req, res) => {
  if (req.params?.id) {
    const presentation = await Presentation.findById(req.params.id).select('-__v').populate('cinema', '-__v').exec();
    res.json(presentation);
  } else {
    // Error Handling
    res.status(400).json({ error: 'Wrong Request parameter' });
  }
});

/* POST create a new presentation */
router.post('/v1/presentations', async (req, res) => {
  const body = req.body;
  // Check that all keys from Presentation.schema exists in body
  const keysToCheck = getSchemaPathNames(Presentation.schema, true);
  if (body && containsKeys(body, keysToCheck)) {
    try {
      const newPresentation = new Presentation({ movieTitle: body.movieTitle, date: body.date, cinema: body.cinema });
      await newPresentation.save();
      const response = await Presentation.findById(newPresentation._id).select('-__v').populate('cinema', '-__v').exec();
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
