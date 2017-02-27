#!/usr/bin/env node

'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname || '';

  if (/^\/Document$/i.test(path)) {
    if (param['produit-id']) {
      result.title_id    = param['produit-id'];
      result.unitid = param['produit-id'];
    }
    if (param['famille-id']) {
      switch (param['famille-id']) {
      case 'REVUES':
        // example : http://www.dalloz.fr/Document?produit-id=REVTRAV&famille-id=REVUES
        result.rtype = 'TOC';
        result.mime  = 'MISC';
        break;
      case 'ENCYCLOPEDIES':
        // example : http://www.dalloz.fr/Document?produit-id=IMMO&famille-id=ENCYCLOPEDIES
        result.rtype = 'ENCYCLOPEDIES';
        result.mime  = 'MISC';
        break;
      case 'CODES':
        // example : http://www.dalloz.fr/Document?produit-id=CCIV&famille-id=CODES
        result.rtype = 'CODES';
        result.mime  = 'MISC';
        break;
      case 'FORMULES':
        // example : http://www.dalloz.fr.bases-doc.univ-lorraine.fr/Document?produit-id=FORMPCIV&famille-id=FORMULES
        result.rtype = 'FORMULES';
        result.mime  = 'MISC';
        break;
      case 'BROCHES':
        // example : http://www.dalloz.fr.bases-doc.univ-lorraine.fr/Document?produit-id=DRCONTRAFF&famille-id=BROCHES
        result.rtype = 'BROCHES';
        result.mime  = 'MISC';
        break;
        /** ces cas rencontrés ne sont peut etre pas traités
      case 'JURIS':
        result.type = 'JURIS';
        break;
      case 'FORMPCIV':
        result.type = 'FORMPCIV';
        break;
        **/
      }
    }
  } else if (/^\/documentation\/Document$/i.test(path)) {
    // /documentation/Document?id=AJDI/CHRON/2014/0381
    result.mime = 'HTML';

    if (param.id) {
      result.unitid = param.id;
    }
  }

  return result;
});
