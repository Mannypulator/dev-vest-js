/**
 * Converts a Mongoose lean document into a serializable plain JavaScript object.
 *
 * @param {Object|Array|any} data - The Mongoose lean document, array, or value to be converted.
 * @returns {Object|Array|any} A plain JavaScript value that is serializable.
 */
export function convertToSerializeableObject(data) {
  // Handle null or non-objects
  if (data === null || typeof data !== "object") {
    return data;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Handle objects with toJSON/toString (e.g., ObjectId)
  if (data.toJSON && data.toString) {
    return data.toString();
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => convertToSerializeableObject(item));
  }

  // Handle objects
  const result = {};
  for (const key of Object.keys(data)) {
    result[key] = convertToSerializeableObject(data[key]);
  }
  return result;
}
