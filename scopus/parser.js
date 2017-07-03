#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scopus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};
  let match;

  if (/^\/results\/citedbyresults.ur[il]$/i.test(path)) {
    // http://www.scopus.com/results/citedbyresults.url?sort=plf-f
    // &cite=2-s2.0-84863856522&src=s&imp=t
    // &sid=38BDE00A99BBFE87E2CE4B3BBB4A00E8.aqHV0EoE4xlIF3hgVWgA%3a170
    // &sot=cite&sdt=a&sl=0&origin=resultslist
    // &editSaveSearch=&txGid=38BDE00A99BBFE87E2CE4B3BBB4A00E8.aqHV0EoE4xlIF3hgVWgA%3a17

    result.mime   = 'HTML';
    result.rtype  = 'REF';
    result.unitid = param.cite;
  } else if ((match = /^\/record\/([a-z]+)\.ur[il]$/i.exec(path)) !== null) {
    // TODO: use http://kitchingroup.cheme.cmu.edu/blog/2015/04/06/
    // Using-the-Scopus-api-with-xml-output to get metadata like doi.
    // The API requires a key.

    switch (match[1]) {
    case 'display':
      // http://www.scopus.com/record/display.url?eid=2-s2.0-33644857527
      // &origin=reflist&sort=plf-f&src=s&st1=bim
      // &st2=crowd&sid=32F992A81208A3DEC0703EA645402F89.f594dyPDCy4K3aQHRor6A%3a40&sot=b
      // &sdt=b&sl=45&s=%28TITLE-ABS-KEY%28bim%29+AND+TITLE-ABS-KEY%28crowd%29%29
      result.mime   = 'HTML';
      result.rtype  = 'ABS';
      result.unitid = param.eid;
      break;
    case 'references':
      // http://www.scopus.com/record/references.url?origin=recordpage&currentRecordPageEID=2-s2.0-84880617481
      result.mime   = 'HTML';
      result.rtype  = 'REF';
      result.unitid = param.currentRecordPageEID;
      break;
    case 'detail':
      result.mime  = 'HTML';
      result.rtype = 'BIO';
      if (param.authorId) {
        result.unitid = param.authorId;
      }
      break;
    case 'pdfdownload':
      // /record/pdfdownload.uri?origin=recordpage&sid=&src=s&stateKey=OFD_804446236&eid=2-s2.0-84952777090&sort=&listId=&clickedLink=&_selectedCitationInformationItemsAll=on&selectedCitationInformationItems=Author%28s%29
      result.rtype  = 'REF';
      result.mime   = 'PDF';
      result.unitid = param.eid;
      break;
    }
  } else if (/^\/authid\/detail\.ur[il]$/i.test(path)) {
    // http://www.scopus.com/authid/detail.url?authorId=35190313500

    result.mime  = 'HTML';
    result.rtype = 'BIO';
    if (param.authorId) {
      result.unitid = param.authorId;
    }
  } else if (/^\/citation\/print\.ur[il]$/i.test(path)) {
    // /citation/print.uri?origin=recordpage&sid=&src=s&stateKey=OFD_804446236&eid=2-s2.0-84952777090&sort=&clickedLink=&view=FullDocument&_selectedCitationInformationItemsAll=on&selectedCitationInformationItems=Author%28s%29

    result.mime  = 'PRINT';
    result.rtype = 'REF';
    if (param.eid) {
      result.unitid = param.eid;
    }
  }

  return result;
});
