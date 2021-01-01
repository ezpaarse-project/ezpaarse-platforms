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

  if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/multimedia$/i.exec(path)) !== null && (param.media == 'photos' || param.media == 'illustrations')) {
    // https://birdsoftheworld.org/bow/species/chfspa1/cur/multimedia?media=photos
    // https://birdsoftheworld.org/bow/species/unijay1/cur/multimedia?media=photos
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=illustrations
    result.rtype    = 'IMAGE';
    result.mime     = 'GIF';
    result.unitid = match[1];

  } else if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/multimedia$/i.exec(path)) !== null && param.media == 'figures') {
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=figures
    result.rtype    = 'MAP';
    result.mime     = 'GIF';
    result.unitid   = match[1];
  } else if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/multimedia$/i.exec(path)) !== null && param.media == 'video') {
    // https://birdsoftheworld.org/bow/species/unijay1/cur/multimedia?media=video
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=video
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/multimedia$/i.exec(path)) !== null && param.media == 'audio') {
    // https://birdsoftheworld.org/bow/species/unijay1/cur/multimedia?media=audio
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/multimedia?media=audio
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.unitid   = match[1];
  } else if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/introduction$/i.exec(path)) !== null) {
    // https://birdsoftheworld.org/bow/species/corvid1/cur/introduction#idsum
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/introduction#sounds
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/species$/i.exec(path)) !== null) {
    // https://birdsoftheworld.org/bow/species/corvid1/cur/species
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/bow\/species\/([0-9a-z]+)\/cur\/references$/i.exec(path)) !== null) {
    // https://birdsoftheworld.org/bow/species/mexjay3/cur/references
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
