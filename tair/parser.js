#!/usr/bin/env node

// ##EZPAARSE
// very simple skeleton parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  var match;
  result.mime  = 'HTML';

  if ((match = /^\/(index).jsp$/.exec(path)) !== null) {
    // http://www.arabidopsis.org.gate1.inist.fr/index.jsp
    // 
    result.rtype = match[1].toUpperCase();
  } else if ((match = /^\/([^\/]+)\/(index).jsp$/.exec(path)) !== null) {
    // http://www.arabidopsis.org.gate1.inist.fr/tools/index.jsp
    result.rtype = match[1].toUpperCase();
  } else if ((match = /^\/servlets\/(Search)$/.exec(path)) !== null) {
    // hhttp://www.arabidopsis.org.gate1.inist.fr/servlets/Search?type=general&action=new_search
    result.rtype = match[1].toUpperCase();
  }
  return result;
});

