const { Presentation, Reservation } = require('./models');

/* containsKeys: check if a given object contains valid values for a given key-set */
function containsKeys (obj, keys) {
  let test = true;
  if (obj && keys.length > 0) {
    keys.forEach(key => {
      if (obj[key] === undefined || obj[key] === null || obj[key] === '') test = false;
    });
  }
  return test;
}

/* getSchemaPathNames: return all keys of a mongoose schema in a (filtered) string array */
function getSchemaPathNames (schema, cleanIDandVersion) {
  const pathNames = Object.keys(schema.paths);
  if (cleanIDandVersion) {
    pathNames.forEach((name, index) => {
      if (name === '_id' || name === '__v') pathNames.splice(index);
    });
  }
  return pathNames;
}

/* containsAnyString: tests if any of the given string array is matched in the given test string */
function containsAnyString (string, stringsToCheck) {
  for (let i = 0; i < stringsToCheck.length; i++) {
    const stringToCheck = stringsToCheck[i];
    if (string.indexOf(stringToCheck) !== -1) {
      return true;
    }
  }
  return false;
}

/* calculateFreeSeats: calculates the amount of free seats for a given presentation id - calculates the reserved seats */
async function calculateFreeSeats (presentationId) {
  // Get Presentation based on id provided in body
  const presentation = await Presentation.findById(presentationId).populate('cinema').exec();
  // calculate cinemas total seats:
  const totalSeats = presentation.cinema.seatRows * presentation.cinema.seatsPerRow;

  // sum all reservedSeats from all Reservations for the given presentation
  const reservedSeats = await Reservation.aggregate([
    { $match: { presentation: presentation._id } },
    { $group: { _id: null, count: { $sum: '$reservedSeats' } } }
  ]).exec();

  const bookedSeats = reservedSeats[0]?.count ? reservedSeats[0].count : 0;
  const freeSeats = totalSeats - bookedSeats;

  return freeSeats;
}

/* clone: Cloning of JSON-compatible structures */
function clone (value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = { containsKeys, getSchemaPathNames, containsAnyString, calculateFreeSeats, clone };
