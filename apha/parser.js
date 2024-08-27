#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform APhA Pharmacy Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/action\/doSearch$/i.test(path)) {
    // https://pharmacylibrary.com/action/doSearch?AllField=Acid+reflux
    // https://pharmacylibrary.com/action/doSearch?AllField=HIV
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/do\/[0-9.]+\/([a-zA-Z0-9._]+)\/full\/?$/i.exec(path)) !== null) {
    // https://pharmacylibrary-com.jerome.stjohns.edu/do/10.21019/hap_vap_table_cap_dsm/full
    // https://pharmacylibrary.com/do/10.21019/pharmacotherapyfirst.hiv_overview_table1/full
    result.rtype = 'TABLE';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/topic\/([a-zA-Z]+)$/i.exec(path)) !== null) {
    // https://pharmacylibrary.com/topic/pfcbl
    // https://pharmacylibrary.com/topic/multimedia
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/doi\/full\/([0-9.]+)\/([a-zA-Z0-9_.-]+)$/i.exec(path)) !== null) {
    // https://pharmacylibrary.com/doi/full/10.21019/culturaltoolkit-diverse.cross-cultural_communication
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = match[2];
    result.unitid = `${match[1]}/${match[2]}`;

  } else if ((match = /^\/doi\/([0-9.]+)\/([a-zA-Z0-9_.-]+)$/i.exec(path)) !== null) {
    // https://pharmacylibrary.com/doi/10.21019/culturaltoolkit-healthdisp.define_health-disp
    // https://pharmacylibrary.com/doi/10.21019/ALE.2000.1
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = match[2];
    result.unitid = `${match[1]}/${match[2]}`;

  } else if ((match = /^\/doi\/epub\/([0-9.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://pharmacylibrary.com/doi/epub/10.21019/9781582122168
    // https://pharmacylibrary.com/doi/epub/10.21019/9781582122861
    result.rtype = 'BOOK';
    result.mime = 'EPUB';
    result.unitid = `${match[1]}/${match[2]}`;
    result.doi = `${match[1]}/${match[2]}`;
  } else if ((match = /^\/doi\/epdf\/([0-9.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://pharmacylibrary.com/doi/epdf/10.21019/9781582121444
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.unitid = `${match[1]}/${match[2]}`;
    result.doi = `${match[1]}/${match[2]}`;
  }
  return result;
});
