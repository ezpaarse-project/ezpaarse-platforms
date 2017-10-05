#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * [description-goes-here]
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};
  let path   = parsedUrl.pathname;
  let hash   = parsedUrl.hash

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^.*?\/content\/journal\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/journal/1-s2.0-S0003999317303908
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
//    return "hello"
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
//    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
//    result.unitid = match[2];

  } else if ((match = /^.*?\/content\/book\/.*?$/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/book/3-s2.0-B978032337798000088X
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
//    result.title_id = match[1];
//    result.unitid   = match[2];
  } else if ((match = /^.*?\/content\/drug_monograph\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/drug_monograph/6-s2.0-2332
    result.rtype    = 'DRUG MONOGRAPH';
    result.mime     = 'HTML';
  } else if ((match = /^.*?\/content\/practice_guide_summary\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/practice_guide_summary/31-s2.0-50300
    result.rtype    = 'GUIDELINE';
    result.mime    = 'HTML';
  } else if ((match = /^.*?\/content\/patient_handout\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/patient_handout/5-s2.0-pe_AAFP_14-tips-parents-using-otc-medicines-child_en
    result.rtype    = 'PATIENT HANDOUT';
    result.mime    = 'HTML';
  } else if ((match = /^.*?\/content\/clinical_overview\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/clinical_overview/67-s2.0-3ccbf894-f46b-41db-9321-02dea462dc2c
    result.rtype    = 'CLINICAL OVERVIEW';
    result.mime     = 'HTML';
  } else if ((match = /^.*?\/content\/medical_procedure\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/content/medical_procedure/19-s2.0-mp_GS-028
    result.rtype    = 'MEDICAL PROCEDURE';
    result.mime     = 'HTML';
  } else if ((match = /^.*?\/browse\/toc\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/browse/toc/1-s2.0-S1076633217X00081/null/journalIssue
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
  } else if ((match = /^.*?\/browse\/book\/.*?/).exec(hash) !== null) {
    // https://www-clinicalkey-com.proxytest.library.emory.edu/#!/browse/book/3-s2.0-C20131191617
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
  }

  return result;
});
