#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {

  var result   = {};
  var pathname = parsedUrl.pathname;
  var hostname = parsedUrl.hostname;
  var fileSize = ec ? parseInt(ec.size, 10) : undefined; // because size could be a string (comming from the test CSV)
  var match;

  result.title_id = hostname;

  if ((match = /^\/content\/([0-9]+\/[0-9]+\/[0-9a-zA-Z\.]+\.(abstract|full|full\.pdf))$/.exec(pathname)) !== null) {
    /**
     * examples : http://rsbl.royalsocietypublishing.org/content/6/4/458.abstract
     *            http://rsbl.royalsocietypublishing.org/content/6/4/458.full
     *            http://rsbl.royalsocietypublishing.org/content/6/4/458.full.pdf
     *            http://cshprotocols.cshlp.org/content/2012/5/pdb.top069344.full.pdf
     */
    result.unitid  = hostname + '/' + match[1];

    switch (match[2]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'full.pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  } else if ((match = /^\/content\/([0-9]+\/[0-9]+\.toc)$/.exec(pathname)) !== null) {
    // example : http://www.jimmunol.org.gate1.inist.fr/content/188/3.toc
    result.unitid = hostname + '/' + match[1];
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
  }

  // if the size is less than 10ko, it's not the actual article but a login page
  if (fileSize && fileSize < 10000) {
    result._granted = false;
  }

  // do not return ECs with empty rtype and empty mime
  if (!result.rtype && !result.mime) {
    result = {};
  }

  return result;
});
