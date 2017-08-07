/**
 * Utility for validating standard identifiers
 */
'use strict';

module.exports = {
  getType,
  isValidIdentifier,
  isValidISSN,
  isValidISBN10,
  isValidISBN13
};

const identifiers = [
  {
    type: 'issn',
    reg: /^[0-9]{4}-[0-9]{3}([0-9Xx])?$/,
    validate: isValidISSN
  }, {
    type: 'isbn10',
    reg: /^9[-– ]*7[-– ]*([0-9][-– ]*){7}[0-9Xx][-– ]*$/,
    validate: isValidISBN10
  }, {
    type: 'isbn13',
    reg: /^9[-– ]*7[-– ]*([0-9][-– ]*){11}$/,
    validate: isValidISBN13
  }, {
    type: 'doi',
    reg: /^10[.][0-9]{4,}[^\\s"/<>]*\/[^\\s"<>]+$/
  }
];

/**
 * Get the type of an identifier
 * @param {String} id identifier
 * @returns {String} the type of the identifier, or 'unknown'
 */
function getType (id) {
  const identifier = identifiers.find(p => p.reg.test(id));
  return identifier && identifier.type || 'unknown';
}

/**
 * Validate an identifier given its type
 * @param {String} id identifier
 * @param {String} type type of identifier
 */
function isValidIdentifier (id) {
  return identifiers.some(i => {
    if (i.reg.test(id)) {
      return i.validate ? i.validate(id) : true;
    }
    return false;
  });
}

/**
 * Validate ISSN
 * @param {String} id ISSN
 * @returns {Boolean}
 */
function isValidISSN (id) {
  const chars = Array.from(id.toString().toLowerCase().replace(/[- –]/g, ''));

  if (chars.length !== 8) { return false; }

  const control = chars.pop().replace('x', '10');
  const product = chars.reduce((prev, curr, i) => prev + parseInt(curr) * (8 - i), 0);
  const rest    = product % 11;

  return parseInt(control) === (rest && 11 - rest);
}

/**
 * Validate ISBN 10
 * @param {String} id ISBN 10
 * @returns {Boolean}
 */
function isValidISBN10 (id) {
  const chars = Array.from(id.toString().toLowerCase().replace(/[- –]/g, ''));

  if (chars.length !== 10) { return false; }

  const control = chars.pop().replace('x', '10');
  const product = chars.reduce((prev, curr, i) => prev + parseInt(curr) * (i + 1), 0);
  const rest    = product % 11;

  return parseInt(control) === rest;
}

/**
 * Validate ISBN 13
 * @param {String} id ISBN 13
 * @returns {Boolean}
 */
function isValidISBN13 (id) {
  const chars = Array.from(id.toString().toLowerCase().replace(/[- –]/g, ''));

  if (chars.length !== 13) { return false; }

  const control = chars.pop();
  const product = chars.reduce((prev, curr, i) => prev + parseInt(curr) * (i % 2 ? 1 : 3), 0);
  const rest    = product % 11;

  return parseInt(control) === rest;
}
