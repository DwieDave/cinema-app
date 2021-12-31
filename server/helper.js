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

module.exports = { containsKeys, getSchemaPathNames };
