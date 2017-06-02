#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Atomic Learning
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
  let match;

  if ((match = /^\/k12\/movie\/(([0-9]+)\/(play|play_window))$/.exec(path)) !== null) {
    // https://www.atomiclearning.com/k12/movie/79411/play?section_id=8452&type=Tutorial&sid=2280
    // https://www.atomiclearning.com/k12/movie/136983/play_window?sid=5657

    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = param.section_id;

  } else if ((match = /^\/k12\/download\/((.*).zip)$/.exec(path)) !== null) {
    // https://www.atomiclearning.com/k12/download/TI-Nspire2_Scripts.zip?sid=2280

    result.rtype    = 'ARTICLE';
    result.mime     = 'ZIP';
    result.title_id = match[2];

  } else if ((match = /^\/k12\/download\/((.*)\/(.*).(docx|doc))$/.exec(path)) !== null) {
    // https://www.atomiclearning.com/k12/download/admin_support/word_out/AtomicLearning-Flyer-K12.docx

    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.title_id = match[3];

  } else if ((match = /^\/k12\/(.*)$/.exec(path)) !== null) {
    // https://www.atomiclearning.com/k12/ti_nspire2_2

    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else if ((match = /^\/(.*)$/.exec(path)) !== null) {
    // https://www.atomiclearning.com/microsoft-sql-training

    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
  }

  return result;
});
