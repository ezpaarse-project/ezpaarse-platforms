#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme EbscoHost
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;
  var hashedUrl;

  if (parsedUrl.hash) {
    var URL  = require('url');
    hashedUrl = URL.parse(parsedUrl.hash.replace("#","/?"), true);
  }

  if ((match = /^\/pdf(.*)\/pdf\/(([^ ]+)\/([^\/]+))\.pdf$/.exec(path)) !== null) {
    // https://content.ebscohost.com/pdf29_30/pdf/2013/CLB/01Sep13/90496319.pdf?T=P&P=AN&
    // K=2012317464&S=R&D=rzh&EbscoContent=dGJyMNXb4kSeqa44zdnyOLCmr0ueprJSsKi4Sa%2BWxWXS&
    // ContentCustomer=dGJyMPGvrkm2p7JKuePfgeyx44Dt6fIA
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[2];
    result.title_id = match[4];
  } else if ((match = /^\/ehost\/pdfviewer\/pdfviewer$/.exec(path)) !== null) {
    // https://web-ebscohost-com.frodon.univ-paris5.fr/ehost/pdfviewer/pdfviewer?
    // sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&vid=4&hid=103
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
  } else if ((match = /^\/ContentServer.asp$/.exec(path)) !== null) {
    // http://content.ebscohost.com:80/ContentServer.asp?T=P&P=AN&K=96283258&S=R&
    // D=aph&EbscoContent=dGJyMNLe80SeqK84v%2BvlOLCmr0yep65Srqi4S7CWxWXS&
    // ContentCustomer=dGJyMPGpsky2qLNQuczHXbnb5ofx6gAA
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (param.K) { result.title_id = param.K; }
  } else if ((match = /^\/ehost\/(results|detail)$/.exec(path)) !== null) {
    // https://web-ebscohost-com.frodon.univ-paris5.fr/ehost/results?
    // sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&vid=2&
    // hid=103&bquery=JN+%22Computers+in+Libraries%22+AND+DT+20130901&
    // bdata=JmRiPXJ6aCZsYW5nPWZyJnR5cGU9MSZzaXRlPWVob3N0LWxpdmU%3d
    //
    // https://web-ebscohost-com.frodon.univ-paris5.fr/ehost/detail?
    // sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&vid=1&
    // hid=103&bdata=Jmxhbmc9ZnImc2l0ZT1laG9zdC1saXZl#db=rzh&jid=CLB
    // 
    // https://web-ebscohost-com.frodon.univ-paris5.fr/ehost/detail?
    // vid=3&sid=6323ca41-66ca-4e71-a8d9-c2a2cae26f16%40sessionmgr110&
    // hid=103&bdata=Jmxhbmc9ZnImc2l0ZT1laG9zdC1saXZl#db=rzh&AN=2012317453
    if (match[1] === 'results') {
      result.rtype    = 'TOC';
    } else if (hashedUrl && hashedUrl.query.db) { // detail
      result.rtype    = 'ABS';
      result.unitid = hashedUrl.query.db;
      if (hashedUrl.query.AN) {
        result.title_id = hashedUrl.query.AN;
        result.unitid += "_" + hashedUrl.query.AN;
      }
      if (hashedUrl.query.jid) {
        result.title_id = hashedUrl.query.jid;
        result.unitid += "_" + hashedUrl.query.jid;
      }      
    }
    result.mime     = 'MISC';
    if (param.K) { result.title_id = param.K; }
  }
  return result;
});

