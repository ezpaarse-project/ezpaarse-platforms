#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Edinburgh University Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/action\/(doSearch|showPublications)/i.test(path)) {
    // https://www.euppublishing.com:443/action/doSearch?startPage=0&field1=AllField&text1=barton&Ppub=&Ppub=&AfterMonth=&AfterYear=&BeforeMonth=&BeforeYear=&earlycite=on
    // https://www.euppublishing.com:443/action/doSearch?AllField=puffins&ConceptID=
    // https://www.euppublishing.com:443/action/doSearch?AllField=10.3366%2Fanh.2018.0477&ConceptID=
    // https://www.euppublishing.com:443/action/showPublications
    // https://www.euppublishing.com:443/action/showPublications?category=10.1555%2Fcategory.40036333
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/toc\/([a-z]{3})\/(current|([0-9/]+))$/i.exec(path)) !== null) {
    // https://www.euppublishing.com:443/toc/anh/45/1
    // https://www.euppublishing.com:443/toc/afg/current
    // https://www.euppublishing.com:443/toc/drs/36/1
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[1] + '/' + match[2];

  } else if ((match = /^\/doi\/ref\/10\.3366\/([0-z.]+)$/i.exec(path)) !== null) {
    // https://www.euppublishing.com:443/doi/ref/10.3366/anh.2018.0485
    // https://www.euppublishing.com:443/doi/ref/10.3366/drs.2018.0218
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = '10.3366' + '/' + match[1];
    result.title_id = '10.3366' + '/' + match[1];
    result.doi = '10.3366' + '/' + match[1];

  } else if ((match = /^\/doi\/abs\/10\.3366\/([0-z.]+)/i.exec(path)) !== null) {
    // https://www.euppublishing.com:443/doi/abs/10.3366/jshs.2005.25.1.73
    // https://www.euppublishing.com:443/doi/abs/10.3366/anh.2018.0477
    // https://www.euppublishing.com:443/doi/abs/10.3366/E1471576708000211
    // https://www.euppublishing.com:443/doi/abs/10.3366/anh.2014.0206?journalCode=anh
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = '10.3366' + '/' + match[1];
    result.title_id = '10.3366' + '/' + match[1];
    result.doi = '10.3366' + '/' + match[1];

  } else if ((match = /^\/doi\/full\/10\.3366\/([0-z.]+)/i.exec(path)) !== null) {
    // https://www.euppublishing.com:443/doi/full/10.3366/anh.2018.0485
    // https://www.euppublishing.com:443/doi/full/10.3366/vic.2015.0194
    // https://www.euppublishing.com:443/doi/full/10.3366/drs.2018.0218
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = '10.3366' + '/' + match[1];
    result.title_id = '10.3366' + '/' + match[1];
    result.doi = '10.3366' + '/' + match[1];

  } else if ((match = /^\/doi\/pdfplus\/10\.3366\/([0-z.]+)/i.exec(path)) !== null) {
    // https://www.euppublishing.com:443/doi/pdfplus/10.3366/jshs.2005.25.1.73
    // https://www.euppublishing.com:443/doi/pdfplus/10.3366/anh.2018.0477
    result.rtype = 'ARTICLE';
    result.mime = 'PDFPLUS';
    result.unitid = '10.3366' + '/' + match[1];
    result.title_id = '10.3366' + '/' + match[1];
    result.doi = '10.3366' + '/' + match[1];

  }

  return result;
});
