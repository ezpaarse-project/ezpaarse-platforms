#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OECD iLibrary
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
console.log(path);
  var match;
  if ((match = /^\/economics\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //economics/the-future-of-productivity_9789264248533-en
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.doi      = '10.1787/' + match[1].split('_')[1];
    if (param.citeformat && param.citeformat == 'ris') {
      result.rtype    = 'REF';
      result.mime     = 'RIS';
    }
    result.unitid   = match[1].split('_')[1];
  } else if ((match = /^\/([a-z]+)\/download\/(([0-9]+)([a-z]+)([0-9]+)?\.pdf)$/.exec(path)) !== null) {
    //docserver/download/9215051e.pdf
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[2];

    if (match[5]) {
      result.rtype    = 'BOOK_SECTION';
    }
  } else if ((match = /^\/([A-Za-z\-]*)\/oecd\/([a-z]+)\/(([a-z\-\_]+)(([0-9]+)([a-z\-]+)))$/.exec(path)) !== null) {
    //Digital-Asset-Management/oecd/economics/the-future-of-productivity_9789264248533-en#page1
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi = '10.1787/' + match[5];
    result.unitid   = match[3].split('_')[1];
  } else if ((match = /^\/economics\/([0-9a-z\-]+)\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //economics/the-future-of-productivity/the-role-of-public-policy_9789264248533-8-en
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[2].split('_')[1];
    result.doi      = '10.1787/' + match[2].split('_')[1];
  } else if ((match = /^\/([A-Za-z\-]*)\/oecd\/([a-z]+)\/([a-z\-]+)\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //Digital-Asset-Management/oecd/economics/the-future-of-productivity/the-role-of-public-policy_9789264248533-8-en#page1
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[4].split('_')[1];
    result.doi      = '10.1787/' + match[4].split('_')[1];
  } else if ((match = /^\/employment\/([a-z0-9\-]*)\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //employment/oecd-employment-outlook-2016/qualification-mismatch-and-skills-use_empl_outlook-2016-table26-en
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/sites\/([a-z0-9\-]*)\/([a-z0-9\-]*)\.html$/.exec(path)) !== null) {
    //sites/mei-v2016-2-en/table-92.html?contentType=%2fns%2fStatisticalPublication%2c%2fns%2fTable&itemId=%2fcontent%2ftable%2fmei-v2016-2-table92-en&mimeType=text%2fhtml&containerItemId=%2fcontent%2fserial%2f22195009&accessItemIds=%2fcontent%2fissue%2fmei-v2016-2-en
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';
    if (param.itemId) {
      result.unitid   = param.itemId.split('/')[3];
    }
  } else if ((match = /^\/([0-9a-z\-\_]+)\.xls$/.exec(path)) !== null) {
    //qualification-mismatch-and-skills-use_5jlvc82znz31.xls?contentType=%2fns%2fStatisticalPublication%2c%2fns%2fTable&itemId=%2fcontent%2ftable%2fempl_outlook-2016-table26-en&mimeType=application%2fvnd.ms-excel&containerItemId=%2fcontent%2fbook%2fempl_outlook-2016-en&accessItemIds=%2fcontent%2fbook%2fempl_outlook-2016-en&option6=imprint&value6=http%3a%2f%2foecd.metastore.ingenta.com%2fcontent%2fimprint%2foecd

    if (param.contentType) {
      var unitid= param.contentType.split('/');
      result.rtype    = unitid[unitid.length - 1].toUpperCase();
    }
    result.mime     = 'XLS';
    if (param.itemId) {
      result.unitid   = param.itemId.split('/')[3];
    }
  } else if ((match = /^\/([A-Za-z\-]*)\/oecd\/([a-z]+)\/([a-z0-9\-]*)\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //Digital-Asset-Management/oecd/employment/oecd-employment-outlook-2016/skills-proficiency-and-skills-use-across-oecd-piaac-countries_empl_outlook-2016-graph24-en#page1
    result.rtype    = 'GRAPH';
    result.mime     = 'HTML';
    result.unitid   = match[4].split('_')[2];
  } else if ((match = /^\/([a-z\-]*)\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //agriculture-and-food/oecd-food-agriculture-and-fisheries-working-papers_18156797
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/([A-Za-z\-]+)\/oecd\/governance\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {

    //Digital-Asset-Management/oecd/governance/budgeting-in-albania_budget-13-5jz14bz8n86d#page1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/([A-Za-z\-]+)\/oecd\/([a-z\-]+)\/([0-9a-z\-\_]+)$/.exec(path)) !== null) {
    //Digital-Asset-Management/oecd/agriculture-and-food/public-private-partnerships-for-agricultural-innovation_5jm55j9p9rmx-en#page1
    result.rtype    = 'WORKING_PAPER';
    result.mime     = 'HTML';
    result.unitid   = match[3];
    result.doi      = '10.1787/' + match[3].split('_')[1];
  } else if ((match = /^\/docserver\/([a-z]+)\/(([0-9a-z]+).pdf)$/.exec(path)) !== null) {
    //docserver/download/5jm55j9p9rmx.pdf?expires=1455188323&id=id&accname=guest&checksum=0B9EABFE2B513028DA472EF8C0E03086
    result.rtype    = 'WORKING_PAPER';
    result.mime     = 'PDF';
    result.unitid   = match[2];
  } else if ((match = /^\/hha\/(([a-z\-]+).htm)$/.exec(path)) !== null) {
    //docserver/download/5jm55j9p9rmx.pdf?expires=1455188323&id=id&accname=guest&checksum=0B9EABFE2B513028DA472EF8C0E03086
    result.rtype    = 'DATA';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/([a-z\-]+)\/data\/([A-Z\_]+)\/([A-Z\.]+)\/([A-Z]+)$/.exec(path)) !== null) {
    //sdmx-json/data/DP_LIVE/.HHDI.NET.AGRWTH.A/OECD
    result.rtype    = 'DATA';
    result.mime     = param.contentType.toUpperCase();
    result.unitid   = match[3];
  } else if ((match = /^\/(([A-Za-z]+).aspx)$/.exec(path)) !== null) {
    ///BrandedView.aspx?oecd_bv_id=mig-data-fr&doi=data-00722-fr
    result.rtype    = 'DATA';
    result.mime     = 'HTML';
    result.unitid   = param.doi || '';
  } else if ((match = /^\/governance\/(([a-z\-]+)\/([0-9a-z\-]+)\/([0-9a-z\-\_]+))$/.exec(path)) !== null) {
    //governance/oecd-journal-on-budgeting/volume-13/issue-2_budget-v13-2-en
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});

