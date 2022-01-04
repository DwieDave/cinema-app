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

module.exports = { containsKeys, getSchemaPathNames, containsAnyString };
