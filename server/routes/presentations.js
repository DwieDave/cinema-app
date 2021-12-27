const router = require('express').Router();
const { containsKeys, getSchemaPathNames } = require('../helper');
const { Presentation } = require('../models');

router.get('/v1/presentations', async (req, res) => {
  const presentations = await Presentation.find().populate('cinema').exec();
  res.json(presentations);
});

router.get('/v1/presentations/:id', async (req, res) => {
  if (req.params?.id) {
    const presentation = await Presentation.findById(req.params.id).populate('cinema').exec();
    res.json(presentation);
  } else {
    res.status(400).json({ error: 'Wrong Request parameter' });
  }
});

router.post('/v1/presentations', async (req, res) => {
  const body = req.body;
  const keysToCheck = getSchemaPathNames(Presentation.schema, true);
  if (body && containsKeys(body, keysToCheck)) {
    try {
      const newPresentation = new Presentation({ movieTitle: body.movieTitle, date: body.date, cinema: body.cinema });
      await newPresentation.save();
      const response = await Presentation.findById(newPresentation._id).populate('cinema').exec();
      res.send(response);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Wrong Request parameters' });
  }
});

module.exports = router;
