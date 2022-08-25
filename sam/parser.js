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
  } else if ((match = /^\/handle\/([0-9]+\/[0-9]+)$/.exec(path)) !== null) {
  // https://sam.ensam.eu/handle/10985/10188
    result.rtype = 'RECORD_VIEW';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/handle\/([0-9]+\/[0-9]+)\/discover$/.exec(path)) !== null) {
  //http://sam.ensam.eu/handle/10985/6657/discover?filter=Centre%2Bde%2BParis&filter_0=bf19da357d295cfccc70cc93e456d708&filter_1=f2b642db8e400dc3456e146eb9c8c8fc&filter_relational_operator=equals&filter_relational_operator_0=authority&filter_relational_operator_1=authority&filtertype=institution&filtertype_0=author&filtertype_1=author&locale-attribute=fr
    result.rtype = 'QUERY';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  }
  return result;
});

