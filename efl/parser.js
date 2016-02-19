#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

// console.log(path);

  if (/\/EFL2\/DOCUMENT\/VIEW\/documentViewUDContent.do/.test(path)) {
    // http://abonnes.efl.fr/EFL2/DOCUMENT/VIEW/documentViewUDContent.do?fromNavig=true&
    // key=DOC$MASGE&refId=P1822245B2F70F-EFL&fromLink=true#P1822245B2F70F-EFL

    result.rtype = 'JURIDIQUE';
    result.mime  = 'HTML';
    if (param.key) {
      result.title_id    = param.key.replace('DOC$', '');
    }
    if (param.refId) {
      result.unitid = param.refId;
    }

  } else if (/\/portail\/actusdetail.no/.test(path)) {
    // http://abonnes.efl.fr/portail/actusdetail.no?ezId=41312&mode=nav&from=autre
    result.rtype = 'ACTUALITE';
    result.mime  = 'HTML';
    if (param.ezId) {
      result.unitid    = param.ezId.replace('DOC$', '');
    }
  }

  return result;
});
