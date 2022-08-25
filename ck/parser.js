#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform ClinicalKey
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let params = parsedUrl.query || {};

  let match;

  if (/^\/ui\/service\/search$/i.test(path)) {
    // /ui/service/search?ckproduct=CK_US&fields=cid,itemtitle,eid,contenttype,hubeid,refimage,pdfeid,sourcetitle,pagerange,coverdatestart,authorlist,volumeissue,authorg,condition,intervention,copyrightyear,issn,pubdate,datecreatedtxt,daterevisedtxt,statustype,exactsourcetitle,label,sectionid,sourcecopyright,sourceeditor,sourcetype,toc,volume,issue,pagefirst,pagelast,pageinfo,chaptertitle,chapternumber,ngcsynthesisurl,altlangeid,provider,summary,ref,reftitle,altlang,lang,srcid,tradenames,subtype,sections,sectiontitle,chptitle,doctype,embargo,sectionids&onlyEntitled=true&query=cancer&rows=20&sections=results,facets,resultsanalysis,bestbets,topicpages,didyoumean,didyoumean,disambiguations&start=0
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/student\/content\/emc\/(?:toc|articles)\/([0-9x]{8})(?:\/[0-9%|-]+)?/i.exec(path)) !== null) {
    // /student/content/emc/toc/11551941
    // /student/content/emc/articles/11551941/0-1|1-10
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.print_identifier = `${match[1].substring(0, 4)}-${match[1].substring(4, 8)}`;

  } else if ((match = /^\/student\/content\/(toc|book|emc)\/(\d+-s\d\.\d-([SBC][a-z0-9]+))$/i.exec(path)) !== null) {
    // /student/content/toc/3-s2.0-C20150064152
    // /student/content/book/3-s2.0-B978229475106600032X
    // /student/content/emc/51-s2.0-S1155194114514205

    result.unitid = match[2];

    switch (match[1]) {
    case 'toc':
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = match[3];
      break;
    case 'book':
      result.rtype = 'BOOK_SECTION';
      result.mime  = 'HTML';
      result.pii   = match[3];
      break;
    case 'emc':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      result.pii   = match[3];
      break;
    }

    if (result.pii && result.pii.startsWith('S')) {
      result.print_identifier = `${result.pii.substring(1, 5)}-${result.pii.substring(5, 9)}`;
    }

  } else if (/^\/ui\/service\/content\/html$/i.test(path)) {
    // /ui/service/content/html?context=player&eid=1-s2.0-S0003999317303908&html=true&initialrequest=true&meta=true
    if (params.context !== 'player') { return {}; }

    result.mime   = 'HTML';
    result.unitid = params.eid;

    const piiMatch = /^\d-s\d\.\d-(([SB]).*)/i.exec(params.eid);

    if (piiMatch) {
      result.rtype = piiMatch[2] === 'S' ? 'ARTICLE' : 'BOOK';
      result.pii   = piiMatch[1];
    }
  } else if ((match = /\/service\/content\/pdf\/watermarked\/(\d-s\d\.\d-([0-9a-z]+))\.pdf$/i.exec(path)) !== null) {
    // /service/content/pdf/watermarked/1-s2.0-S0003999317303908.pdf?locale=en_US
    if (match[2].startsWith('S')) {
      result.rtype = 'ARTICLE';
    } else if (match[2].startsWith('B')) {
      result.rtype = 'BOOK_SECTION';
    }
    result.mime   = 'PDF';
    result.unitid = match[1];
    result.pii    = match[2];
  } else if ((match = /\/service\/content\/ck\/([0-9a-z-]*?-[0-9a-z.]*?-[0-9a-zA-Z-_]*)/i.exec(path)) !== null) {
    // /ui/service/content/ck/31-s2.0-50300
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/ui\/service\/clinical_overviews\/html\/(.+?)$/i.exec(path)) !== null) {
    // /ui/service/clinical_overviews/html/67-s2.0-3ccbf894-f46b-41db-9321-02dea462dc2c?separateUrgentAction=true&boxes=Differential%20Diagnosis&accordions=Diagnostic%20Procedures&references=true&imageHtml=true&crossLinkHtml=true&product=global
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /\/service\/browse\/(.+?)\/toc$/i.exec(path)) !== null) {
    // /service/browse/1-s2.0-S0306460317X00117/toc?hubeid=1-s2.0-S0306460317X00117&product=en_US&rows=9999&start=0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/service\/browse\/drugs$/i.test(path)) {
    // /service/browse/drugs?ckproduct=CK_US&contenttype=DM&firstchar=O&onlyEntitled=true&product=en_US&rows=50
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /service\/content\/ck\/(.*)/i.exec(path)) !== null) {
    // /service/content/ck/6-s2.0-3547
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
