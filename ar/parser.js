#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for www.annualreviews.org platform
 * http://analogist.couperin.org/platforms/annualreviews/
 */
'use strict';
var URL    = require('url');
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(url) {
  var result = {};
  var path   = decodeURIComponent(URL.parse(url).path);

  var match;

  if ((match = /\/journal\/([a-z]+[0-9]?)$/.exec(path)) !== null) {
    // http://www.annualreviews.org.gate1.inist.fr/journal/anchem
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/current$/.exec(path)) !== null) {
    // /toc/achre4/current
    result.unitid = match[1] + "/current";
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.unitid = match[1] + "/" + match[2] + '/' + match[3];
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/doi\/abs\/([0-9]{2}\.[0-9]{4})\/annurev\-([^\-]+)\-([^\-]+)\-([^\-]+)$/.exec(path)) !== null) {
    // http://www.annualreviews.org.gate1.inist.fr/doi/abs/10.1146/annurev-neuro-062111-150343
    result.unitid = match[1] + "/annurev-" + match[2] + "-" + match[3] + "-" + match[4];
    result.title_id = match[2];
    result.rtype = 'ABS';
    result.mime = 'HTML';
  } else if ((match = /^\/doi\/pdf\/([0-9]{2}\.[0-9]{4})\/annurev\-([^\-]+)\-([^\-]+)\-([^\-]+)$/.exec(path)) !== null) {
    // http://www.annualreviews.org.gate1.inist.fr/doi/pdf/10.1146/annurev-anchem-062012-092547
    result.unitid = match[1] + "/annurev-" + match[2] + "-" + match[3] + "-" + match[4];
    result.title_id = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /^\/doi\/full\/([0-9]{2}\.[0-9]{4})\/annurev\-([^\-]+)\-([^\-]+)\-([^\-]+)$/.exec(path)) !== null) {
    // http://www.annualreviews.org.gate2.inist.fr/doi/full/10.1146/annurev-physchem-040412-110115
    result.unitid = match[1] + "/annurev-" + match[2] + "-" + match[3] + "-" + match[4];
    result.title_id = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  }
  return result;
});
