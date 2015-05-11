#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ELnet
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(param);

  var match, match_FromId;

  if ((match = /^\/documentation\/Document$/.exec(path)) !== null) {
    // http://www.elnet.fr/documentation/Document?id=Y4IDXJRP
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    if (param.id) {
      result.title_id = param.id;
      result.unitid= param.id;
    }
    if (param.FromId) {
      // http://www.elnet.fr/documentation/Document?id=ASSU&FromId=Z4LSTCODE
      // http://www.elnet.fr/documentation/Document?id=A197461&FromId=Y4IDXJRP
      // http://www.elnet.fr/documentation/Document?id=Y3M08&FromId=Y3LSTFORM
      // http://www.elnet.fr/documentation/Document?id=Y3LSTET-1
      match_FromId = param.FromId.match(/(CODE|JRP|TXT|FORM|ET)$/);
      switch(match_FromId[0]) {
        case 'CODE':
          result.rtype    = 'CODES';
        break;
        case 'JRP':
          result.rtype    = 'JURISPRUDENCE';
        break;
        case 'FORM':
          result.rtype    = 'FORMULES';
        break;
        case 'ET':
          result.rtype    = 'ARTICLE';
        break;
      }
    }
  } else if ((match = /^\/documentation\/hulkStatic\/EL\/(.*)\/([^\/]+)\.pdf$/.exec(path)) !== null) {
    // http://www.elnet.fr/documentation/hulkStatic/EL/CD13/DPFORM2/Y3M10/sharp_/ANX/y3m313001.pdf
    result.rtype    = 'ARTICLE';
    if (match[1] && match[1].indexOf('FORM') != -1 ) {
      result.rtype    = 'FORMULES';
    }
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/aboveille\/editdoc\.do$/.exec(path)) !== null) {
    // http://www.editions-legislatives.fr/aboveille/editdoc.do?attId=150868
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (param.attId) { 
      result.title_id = param.attId;
      result.unitid= param.attId;
    }
  } else if ((match = /^\/aboveille\/logon\.do$/.exec(path)) !== null) {
    // http://www.editions-legislatives.fr/aboveille/logon.do?zone=CCACTU
    // &theme=15w345&attId=159359&forward=viewccarticle
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (param.attId) { 
      result.title_id = param.attId;
      result.unitid= param.attId;
    }
  }

  return result;
});

