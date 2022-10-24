#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform 123rf
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

  if ((match = /^\/(photo|footage|audio)_([0-9]+)_[a-z-]+\.html$/i.exec(path)) !== null) {
    result.mime     = 'HTML';
    result.unitid = match[2];
    if (match[1] == 'photo') {
      // https://www.123rf.com/photo_129407680_child-playing-with-baby-dog-and-cat-kids-play-with-puppy-and-kitten-little-boy-and-american-cocker-s.html?vti=nemmudp95bmhkhd5xi-1-6
      result.rtype    = 'IMAGE';
    } else if (match[1] == 'footage') {
      // https://www.123rf.com/footage_137527960_ink-water-explosion-sorcery-chemistry-pink-yellow-smog-effect-.html
      result.rtype    = 'VIDEO';
    } else if (match[1] =='audio') {
      // https://www.123rf.com/audio_192142832_beautiful-warm-positive-cool-fun-romantic-loving-guitar-whistle-koto-pan-flute-and-accordion-backgro.html
      result.rtype    = 'AUDIO';
    }
  } else if (/^\/stock-photo\/[a-z-]+\.html$/i.test(path)) {
    // https://www.123rf.com/stock-photo/Dog.html
    result.mime = 'HTML';
    result.rtype = 'SEARCH';
  }

  return result;
});
