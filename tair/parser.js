#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/(index).jsp$/.exec(path)) !== null) {
    // http://www.arabidopsis.org.gate1.inist.fr/index.jsp
    result.unitid = match[1];
    result.mime   = 'HTML';
    result.rtype  = match[1].toUpperCase();

  } else if ((match = /^\/([^/]+)\/index.jsp$/.exec(path)) !== null) {
    // http://www.arabidopsis.org.gate1.inist.fr/tools/index.jsp
    result.unitid = match[1] + '/index';
    result.mime   = 'HTML';
    result.rtype  = match[1].toUpperCase();

  } else if ((match = /^\/servlets\/(Search)$/.exec(path)) !== null) {
    // hhttp://www.arabidopsis.org.gate1.inist.fr/servlets/Search?type=general&action=new_search
    result.rtype  = match[1].toUpperCase();
    result.mime   = 'HTML';
    result.unitid = 'servlets/' + match[1];
  }
  return result;
});

