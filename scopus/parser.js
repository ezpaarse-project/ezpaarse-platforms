#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scopus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  result.mime = 'HTML'; // we always get HTML

  if ((match = /^\/results\/citedbyresults.url$/.exec(path)) !== null) {
      // http://www.scopus.com/results/citedbyresults.url?sort=plf-f
      // &cite=2-s2.0-84863856522&src=s&imp=t
      // &sid=38BDE00A99BBFE87E2CE4B3BBB4A00E8.aqHV0EoE4xlIF3hgVWgA%3a170
      // &sot=cite&sdt=a&sl=0&origin=resultslist
      // &editSaveSearch=&txGid=38BDE00A99BBFE87E2CE4B3BBB4A00E8.aqHV0EoE4xlIF3hgVWgA%3a17
      result.rtype = 'REF';
      result.unitid = param.cite;
  } else if ((match = /^\/record\/display.url$/.exec(path)) !== null) {
      // http://www.scopus.com/record/display.url?eid=2-s2.0-33644857527
      // &origin=reflist&sort=plf-f&src=s&st1=bim
      // &st2=crowd&sid=32F992A81208A3DEC0703EA645402F89.f594dyPDCy4K3aQHRor6A%3a40&sot=b
      // &sdt=b&sl=45&s=%28TITLE-ABS-KEY%28bim%29+AND+TITLE-ABS-KEY%28crowd%29%29
      //
      // TODO: use http://kitchingroup.cheme.cmu.edu/blog/2015/04/06/
      // Using-the-Scopus-api-with-xml-output to get metadata like doi.
      // The API requires a key.
      result.rtype = 'ABS';
      result.unitid = param.eid;
  } else if ((match = /^\/record\/references.url$/.exec(path)) !== null) {
      // http://www.scopus.com/record/references.url?origin=recordpage
      // &currentRecordPageEID=2-s2.0-84880617481
      result.rtype = 'REF';
      result.unitid = param.currentRecordPageEID;
  } else if ((match = /^\/authid\/detail.url$/.exec(path)) !== null) {
      // http://www.scopus.com/authid/detail.url?authorId=35190313500
      result.rtype = 'BIO';
      if (param.authorId) {
          result.unitid = param.authorId;
      }
  }
  return result;
});
