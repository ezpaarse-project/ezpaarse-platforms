#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

var patterns = {
  issn: '([0-9]{4}-[0-9]{3}[0-9xX])',
  issn_short: '(([0-9]{4})([0-9]{3}[0-9xX]))',
  doi: '((10[.][0-9]+)/([^.]+))',
  title_id: '([^.]+).',
  ISSN: '[0-9]{4}\\-[0-9]{3}([0-9Xx])?',
  ISBN: '((978[-– ])?[0-9][0-9-– ]{10}[-– ][0-9xX])|((978)?[0-9]{9}[0-9])',
  DOI: '((10[.][0-9]{4,}[^\\s"/<>]*)/([^\\s"<>]+))'
};

/**
 * Identifie les consultations de la plateforme deepdyve (gestion des accès refusés)
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
  var pi_regexp_issn_s, pi_regexp_doi;

  if ((match = /^\/rental-link$/.exec(path)) !== null) {

    result._granted = false; // These ECs are denied access

    // http://www.deepdyve.com:80/rental-link?docId=10.1016/S1872-1508(08)60082-0&journal=18721508&
    // fieldName=journal_doi&affiliateId=elsevier&format=jsonp&
    // callback=jQuery171039578543696552515_1408449347105&_=140844935716

    // http://www.deepdyve.com:80/rental-link?docId=10.1002/9781118782101.ch8&
    // fieldName=journal_doi&journal=undefined&affiliateId=wiley&
    // format=jsonp&callback=jsonp1408448955682
    if (param.affiliateId !== undefined) { result.platform = param.affiliateId; }
    if (param.docId !== undefined) {
      result.unitid = param.docId;
      if (param.fieldName == "journal_doi") {
        result.doi = param.docId;
      }
    }
    if (result.platform === "elsevier" && param.journal) {
      pi_regexp_issn_s = new RegExp(patterns.issn_short);
      result.rtype    = 'ARTICLE';
      if ((match = param.journal.match(pi_regexp_issn_s))) {
        result.print_identifier = match[2] + '-' + match[3];
      }
      result.platform = 'sd'; // real short name of platform
    } else if (result.platform === "springer") {
        if (param.journal) { result.print_identifier = param.journal; }
    } else if (result.platform === "wiley" && param.docId) {
      pi_regexp_doi = new RegExp(patterns.DOI);
      if ((match = param.docId.match(pi_regexp_doi))) {
        // j.1600-0390.2012.00514.x
        // anie.201209878
        // 9781118268117.ch3
        //console.log(match);
        if (param.journal) { result.print_identifier = param.journal; }
        if (match[3]) {
          var m;
          var r1, r2, r3;
          r1 = new RegExp('^(' + patterns.issn + ')');
          r2 = new RegExp('j.(' + patterns.issn + ')');
          r3 = new RegExp('(' + patterns.title_id + ')([^\/]+)');
          if ((m = match[3].match(r1))) {
            result.print_identifier = m[1];
            result.rtype = 'TOC';
          } else if ((m = match[3].match(r2))) {
            result.print_identifier = m[1];
            result.rtype = 'TOC';
          } else if ((m = match[3].match(r3))) {
            if (m[3].match('ch.+')) {
              result.rtype = 'BOOK_SECTION';
              result.print_identifier = m[2];
            } else { result.rtype = 'TOC'; }
            result.title_id = m[2];
          }
        }
      // } else {
        // TODO alert on new affiliateId
      }     
    }
    result.mime     = 'DEEPDYVE';
  }
  return result;
});

