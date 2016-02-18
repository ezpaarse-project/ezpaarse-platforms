#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/(bitstream\/handle)\/([0-9]+\/[0-9]+)\/(.*\.pdf)$/.exec(path)) !== null) {
    // http://sam.ensam.eu/bitstream/handle/10985/7761/I2M-CIRP-PERRY-2013.pdf?sequence=1
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[2];
    result.unitid = match[3];
  } else if ((match = /^\/(bitstream\/handle)\/([0-9]+\/[0-9]+)\/(.*\.html?)$/.exec(path)) !== null) {
    //
    //
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[2];
    result.unitid = match[3];
  }
  return result;
});

