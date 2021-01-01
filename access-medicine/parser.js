#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Access Medicine
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
  let hash;

  if (parsedUrl.hash) {
    hash = parsedUrl.hash
      .replace('#', '')
      .split('&')
      .reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
      }, {});
  } else {
    hash = {};
  }
  // use console.error for debuging
  //console.error(parsedUrl);
  //console.error(hash);

  let match;

  if ((match = /^\/searchresults\.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/searchresults.aspx?q=chronic+exertional+compartment+syndrome&subonly=True
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/CaseContent\.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/CaseContent.aspx?gbosID=533934&gbosContainerID=245#240777564
    // https://accessmedicine.mhmedical.com/CaseContent.aspx?gbosID=459684&gbosContainerID=224&viewByNumber=false&groupid=1344#210735386
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = param.gbosID;
  } else if ((match = /^\/patientEdHandouts\.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/patientEdHandouts.aspx?gbosID=250260
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.gbosID;
  } else if ((match = /^\/mgh\/content_public\/gboscontainer\/[0-9]+\/([0-9a-z_]+)\.pdf$/i.exec(path)) !== null) {
    // https://mgh.silverchair-cdn.com/mgh/content_public/gboscontainer/123/aa_comprtsd_sma.pdf?Expires=1608157851&Signature=K4-1DjNESBrdQk51QpiLb2FF70Wux1TN9i8BTg8HqSGZ1dGEkGgbnwDxcDcyM07ao1xirE-CZUUTMVle2huoPIIA24b77ifeaCX4FO~yRy8SXm3LUo7HsZEIg-Dqkx~eqm~w1wIPhlsHJI0LawYQZE5Ifo3Yl4P3a03bPbAxsLdltG7dCF0XLiYMYsc~MgF15xHUwL23H63YmNvkZBqd4sAfwHD2IGMSepd6FeLf7Xu7TjZQ-GwGe~qn8v8qVoSSyA8Uv7COpE6SfzQrPwtBGgtMN2J04xDVzCl5v64Pm141yz4KofgkXlyDsO8Zb-fNqOegjSKfc9HdjT9Buk45Tw__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/book.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/book.aspx?bookid=1180
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.bookid;
  } else if ((match = /^\/content.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/content.aspx?sectionid=70381398&bookid=1180#70381726
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.bookid + '-' + param.sectionid;
  } else if ((match = /^\/MultimediaPlayer.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/MultimediaPlayer.aspx?MultimediaID=17965166
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid   = param.MultimediaID;
  } else if ((match = /^\/drugs.aspx$/i.exec(path)) !== null) {
    // https://accessmedicine.mhmedical.com/drugs.aspx#monoNumber=426051&sectionID=03&tab=tab1
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = hash.monoNumber;
  }

  return result;
});
