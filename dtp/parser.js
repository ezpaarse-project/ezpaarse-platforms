#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Digital Theatre Plus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search$/i.test(path)) {
    // https://edu.digitaltheatreplus.com/search?q=tragedies
    // https://edu.digitaltheatreplus.com/search?q=othello
    // https://edu.digitaltheatreplus.com/search?q=romeo+and+juliet
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/content\/productions\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://edu.digitaltheatreplus.com/content/productions/romeo-and-juliet-broadwayhd
    // https://edu.digitaltheatreplus.com/content/productions/king-lear-the-film
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/content\/productions$/i.test(path)) {
    // https://edu.digitaltheatreplus.com/content/productions
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/content\/guides\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://edu.digitaltheatreplus.com/content/guides/15-heroines-15-monologues-adapted-from-ovid
    // https://edu.digitaltheatreplus.com/content/guides/15-heroines-a-critical-introduction
    // https://edu.digitaltheatreplus.com/content/guides/a-christmas-carol-education-pack
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/content\/interviews\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://edu.digitaltheatreplus.com/content/interviews/actors-preparing-and-playing
    // https://edu.digitaltheatreplus.com/content/interviews/eric-bentley-at-100-on-brecht-theatre-politics-and-writing
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/content\/lesson-plans\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://edu.digitaltheatreplus.com/content/lesson-plans/a-christmas-carol-workshop-plan
    // https://edu.digitaltheatreplus.com/content/lesson-plans/analyzing-character-in-fish-cheeks
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
