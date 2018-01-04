#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doiOECD = '10.1787';
const doiUN   = '10.18356';

/**
 * Recognizes the accesses to the platform OECD iLibrary
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;
  // use console.error for debuging
  console.error(parsedUrl);

  if ((match = /^\/economics\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /economics/the-future-of-productivity_9789264248533-en
    result.doi    = `${doiOECD}/${match[1]}`;
    result.unitid = match[1];

    if (param.citeformat && param.citeformat == 'ris') {
      result.rtype = 'REF';
      result.mime  = 'RIS';
    } else {
      result.rtype = 'TOC';
      result.mime  = 'HTML';
    }
  } else if ((match = /^\/[a-z]+\/download\/([0-9]+[a-z]+)\.pdf$/i.exec(path)) !== null) {
    // /docserver/download/9215051e.pdf
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]+\/download\/([0-9]+[a-z]+[0-9]+)\.pdf$/i.exec(path)) !== null) {
    // /docserver/download/9215051ec008.pdf
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z-]+\/oecd\/[a-z]+\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /Digital-Asset-Management/oecd/economics/the-future-of-productivity_9789264248533-en#page1
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.doi    = `${doiOECD}/${match[1]}`;

  } else if ((match = /^\/economics\/[0-9a-z-]+\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /economics/the-future-of-productivity/the-role-of-public-policy_9789264248533-8-en
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.doi    = `${doiOECD}/${match[1]}`;

  } else if ((match = /^\/[a-z-]+\/oecd\/[a-z]+\/[a-z-]+\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /Digital-Asset-Management/oecd/economics/the-future-of-productivity/the-role-of-public-policy_9789264248533-8-en#page1
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.doi    = `${doiOECD}/${match[1]}`;

  } else if ((match = /^\/employment\/([a-z0-9-]*)\/[0-9a-z\-_]+$/i.exec(path)) !== null) {
    // /employment/oecd-employment-outlook-2016/qualification-mismatch-and-skills-use_empl_outlook-2016-table26-en
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/sites\/([a-z0-9-]*)\/([a-z0-9-]*)\.html$/i.test(path)) {
    // /sites/mei-v2016-2-en/table-92.html?contentType=%2fns%2fStatisticalPublication%2c%2fns%2fTable&itemId=%2fcontent%2ftable%2fmei-v2016-2-table92-en&mimeType=text%2fhtml&containerItemId=%2fcontent%2fserial%2f22195009&accessItemIds=%2fcontent%2fissue%2fmei-v2016-2-en
    result.rtype = 'TABLE';
    result.mime  = 'HTML';

    if (param.itemId) {
      result.unitid = param.itemId.split('/')[3];
    }
  } else if (/^\/([0-9a-z\-_]+)\.xls$/i.test(path)) {
    // /qualification-mismatch-and-skills-use_5jlvc82znz31.xls?contentType=%2fns%2fStatisticalPublication%2c%2fns%2fTable&itemId=%2fcontent%2ftable%2fempl_outlook-2016-table26-en&mimeType=application%2fvnd.ms-excel&containerItemId=%2fcontent%2fbook%2fempl_outlook-2016-en&accessItemIds=%2fcontent%2fbook%2fempl_outlook-2016-en&option6=imprint&value6=http%3a%2f%2foecd.metastore.ingenta.com%2fcontent%2fimprint%2foecd
    result.mime = 'XLS';

    if (param.contentType) {
      result.rtype = param.contentType.split('/').pop().toUpperCase();
    }
    if (param.itemId) {
      result.unitid = param.itemId.split('/')[3];
    }
  } else if ((match = /^\/[a-z-]+\/oecd\/[a-z]+\/[a-z0-9-]+\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /Digital-Asset-Management/oecd/employment/oecd-employment-outlook-2016/skills-proficiency-and-skills-use-across-oecd-piaac-countries_empl_outlook-2016-graph24-en#page1
    result.rtype  = 'GRAPH';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z-]+\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /agriculture-and-food/oecd-food-agriculture-and-fisheries-working-papers_18156797
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.doi    = `${doiOECD}/${match[1]}`;

  } else if ((match = /^\/[a-z-]+\/oecd\/governance\/([0-9a-z\-_]+)$/i.exec(path)) !== null) {
    // /Digital-Asset-Management/oecd/governance/budgeting-in-albania_budget-13-5jz14bz8n86d#page1
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z-]+\/oecd\/[a-z-]+\/[0-9a-z_-]+_([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /Digital-Asset-Management/oecd/agriculture-and-food/public-private-partnerships-for-agricultural-innovation_5jm55j9p9rmx-en#page1
    result.rtype  = 'WORKING_PAPER';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.doi    = `${doiOECD}/${match[1]}`;

  } else if ((match = /^\/docserver\/[a-z]+\/([0-9a-z]+).pdf$/i.exec(path)) !== null) {
    // /docserver/download/5jm55j9p9rmx.pdf?expires=1455188323&id=id&accname=guest&checksum=0B9EABFE2B513028DA472EF8C0E03086
    result.rtype  = 'WORKING_PAPER';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/hha\/([a-z-]+).htm$/i.exec(path)) !== null) {
    // /hha/household-disposable-income.htm
    result.rtype  = 'DATA';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z-]+\/data\/[a-z_]+\/([a-z.]+)\/[a-z]+$/i.exec(path)) !== null) {
    // /sdmx-json/data/DP_LIVE/.HHDI.NET.AGRWTH.A/OECD
    result.rtype  = 'DATA';
    result.unitid = match[1];

    if (param.contentType) {
      result.mime = param.contentType.toUpperCase();
    }

  } else if (/^\/(([a-z]+).aspx)$/i.test(path)) {
    // /BrandedView.aspx?oecd_bv_id=mig-data-fr&doi=data-00722-fr
    result.rtype  = 'DATA';
    result.mime   = 'HTML';
    result.unitid = param.doi;

  } else if ((match = /^\/governance\/([a-z-]+\/[0-9a-z-]+\/[0-9a-z\-_]+)$/i.exec(path)) !== null) {
    // /governance/oecd-journal-on-budgeting/volume-13/issue-2_budget-v13-2-en
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if (/^\/deliver\/fulltext$/i.test(path)) {
    // http://www.un-ilibrary.org:80/deliver/fulltext?contentType=%2fns%2fUNPBook%2c%2fns%2fBook&itemId=%2fcontent%2fbook%2f70388b69-es&mimeType=freepreview&containerItemId=%2fcontent%2fserial%2fd3229fb0-en&accessItemIds=&redirecturl=http%3a%2f%2fwww.keepeek.com%2fDigital-Asset-Management%2foecd%2feconomic-and-social-development%2finforme-de-los-objetivos-de-desarrollo-sostenible-2017_70388b69-es&isPreview=true
    match         = /^\/content\/book\/(.*)$/i.exec(param.itemId)
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';
    result.doi    = `${doiUN}/${match[1]}`;
    result.unitid = match[1];
  } else if (/^\/[0-9a-z].*\.pdf$/i.test(path)) {
    // http://www.un-ilibrary.org:80/informe-de-los-objetivos-de-desarrollo-sostenible-2017_70388b69-es.pdf?contentType=%2fns%2fUNPBook%2c%2fns%2fBook&itemId=%2fcontent%2fbook%2f70388b69-es&mimeType=application%2fpdf&containerItemId=%2fcontent%2fserial%2fd3229fb0-en&accessItemIds=&option6=imprint&value6=http%3a%2f%2foecd.metastore.ingenta.com%2fcontent%2fimprint%2funp
    match         = /^\/content\/book\/(.*)$/i.exec(param.itemId)
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.doi    = `${doiUN}/${match[1]}`;
    result.unitid = match[1];
  } else if (/^\/search$/i.test(path)) {
    // http://www.un-ilibrary.org:80/search?option1=titleAbstract&option2=&value2=&option3=&value3=&option4=&value4=&option5=&value5=&option6=imprint&value6=http%3A%2F%2Foecd.metastore.ingenta.com.proxy.library.emory.edu%2Fcontent%2Fimprint%2Funp&option23=&value23=&option7=&value7=&option8=&value8=&option9=&value9=&option10=&value10=&option11=&value11=&option12=&value12=&option13=&value13=&option14=&value14=&option15=&value15=&option16=&value16=&option17=&value17=&option22=excludeKeyTableEditions&value22=true&option18=sort&value18=&form_name=quick&discontin=factbooks&value1=war
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
  }

  return result;
});

