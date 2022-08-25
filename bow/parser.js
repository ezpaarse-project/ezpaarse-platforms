#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Birds of the Worldcat
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/(multimedia|introduction|species|references)$/i.exec(path)) !== null) {
    // https://birdsoftheworld.org/bow/species/chfspa1/cur/multimedia?media=photos
    // https://birdsoftheworld.org/bow/species/unijay1/cur/multimedia?media=photos
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=illustrations
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=figures
    // https://birdsoftheworld.org/bow/species/unijay1/cur/multimedia?media=video
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=video
    // https://birdsoftheworld.org/bow/species/unijay1/cur/multimedia?media=audio
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=audio
    // https://birdsoftheworld.org/bow/species/corvid1/cur/introduction#idsum
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/introduction#sounds
    // https://birdsoftheworld.org/bow/species/corvid1/cur/species
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/references
    result.unitid = match[1];

    if (match[2] === 'multimedia') {
      switch (param.media) {
      case 'photos':
      case 'illustrations':
        result.rtype = 'IMAGE';
        result.mime = 'GIF';
        break;

      case 'figures':
        result.rtype = 'MAP';
        result.mime = 'GIF';
        break;

      case 'video':
        result.rtype = 'VIDEO';
        result.mime = 'MISC';
        break;

      case 'audio':
        result.rtype = 'AUDIO';
        result.mime = 'MP3';
        break;
      }
    }

    switch (match[2]) {
    case 'introduction':
      result.rtype = 'ENCYCLOPAEDIA_ENTRY';
      result.mime = 'HTML';
      break;

    case 'species':
      result.rtype = 'TOC';
      result.mime  = 'HTML';
      break;

    case 'references':
      result.rtype = 'RECORD_VIEW';
      result.mime  = 'HTML';
      break;
    }
  }

  return result;
});
