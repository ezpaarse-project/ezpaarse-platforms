#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Micromedex
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  //let match;

  if (/^\/.+\/evidencexpert.Calculators$/i.test(path)) {
    // https://www.micromedexsolutions.com/micromedex2/librarian/CS/FE7C57/ND_PR/evidencexpert/ND_P/evidencexpert/DUPLICATIONSHIELDSYNC/AC7EBD/ND_PG/evidencexpert/ND_B/evidencexpert/ND_AppProduct/evidencexpert/ND_T/evidencexpert/PFActionId/evidencexpert.Calculators?navitem=topCalculators&isToolPage=true
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';

  } else if (/^\/.+\/evidencexpert.GetDocumentSection$/i.test(path)) {
    // https://www.micromedexsolutions.com:443/micromedex2/librarian/CS/F796D5/ND_PR/evidencexpert/ND_P/evidencexpert/DUPLICATIONSHIELDSYNC/749F42/ND_PG/evidencexpert/ND_B/evidencexpert/ND_AppProduct/evidencexpert/ND_T/evidencexpert/PFActionId/evidencexpert.GetDocumentSection?topicId=dosingAdminSection&subtopicId=adultDosageSection&contentSetId=100&docId=301568&title=Insulin%20Human%20Regular&crossWalkContentSetId=31&crossWalkDocId=0002&selectedGRA=fda
    // https://www.micromedexsolutions.com/micromedex2/librarian/CS/EA42CE/ND_PR/evidencexpert/ND_P/evidencexpert/DUPLICATIONSHIELDSYNC/949D97/ND_PG/evidencexpert/ND_B/evidencexpert/ND_AppProduct/evidencexpert/ND_T/evidencexpert/PFActionId/evidencexpert.DoIntegratedSearch?SearchTerm=Ibuprofen&fromInterSaltBase=true&UserMdxSearchTerm=%24userMdxSearchTerm&false=null&=null#
    // https://www.micromedexsolutions.com/micromedex2/librarian/CS/ABC89A/ND_PR/evidencexpert/ND_P/evidencexpert/DUPLICATIONSHIELDSYNC/B9146F/ND_PG/evidencexpert/ND_B/evidencexpert/ND_AppProduct/evidencexpert/ND_T/evidencexpert/PFActionId/evidencexpert.DoIntegratedSearch?SearchTerm=Ibuprofen&fromInterSaltBase=true&UserMdxSearchTerm=%24userMdxSearchTerm&false=null&=null#
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.docId;
  } else if (/^\/.+\/evidencexpert.DoIntegratedSearch$/i.test(path)) {
  // https://www.micromedexsolutions.com:443/micromedex2/librarian/CS/EFFCA2/ND_PR/evidencexpert/ND_P/evidencexpert/DUPLICATIONSHIELDSYNC/4359C1/ND_PG/evidencexpert/ND_B/evidencexpert/ND_AppProduct/evidencexpert/ND_T/evidencexpert/PFActionId/evidencexpert.DoIntegratedSearch?SearchTerm=insulin%20human%20regular&UserSearchTerm=insulin%20human%20regular&SearchFilter=filterNone&navitem=searchGlobal
  // https://www.micromedexsolutions.com/micromedex2/librarian/CS/345BB2/ND_PR/evidencexpert/ND_P/evidencexpert/DUPLICATIONSHIELDSYNC/37AA14/ND_PG/evidencexpert/ND_B/evidencexpert/ND_AppProduct/evidencexpert/ND_T/evidencexpert/PFActionId/evidencexpert.DoIntegratedSearch?SearchTerm=advil&UserSearchTerm=advil&SearchFilter=filterNone&navitem=searchALL
  result.rtype    = 'SEARCH';
  result.mime     = 'HTML';
}

  return result;
});
