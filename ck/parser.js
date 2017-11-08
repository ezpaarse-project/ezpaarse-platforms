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
  let path   = parsedUrl.path;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  /**
   * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
   * it described the most fine-grained of what's being accessed by the user
   * it can be a DOI, an internal identifier or a part of the accessed URL
   * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
   */

  if ((match = /\/service\/search\?/.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/ui/service/search?ckproduct=CK_US&fields=cid,itemtitle,eid,contenttype,hubeid,refimage,pdfeid,sourcetitle,pagerange,coverdatestart,authorlist,volumeissue,authorg,condition,intervention,copyrightyear,issn,pubdate,datecreatedtxt,daterevisedtxt,statustype,exactsourcetitle,label,sectionid,sourcecopyright,sourceeditor,sourcetype,toc,volume,issue,pagefirst,pagelast,pageinfo,chaptertitle,chapternumber,ngcsynthesisurl,altlangeid,provider,summary,ref,reftitle,altlang,lang,srcid,tradenames,subtype,sections,sectiontitle,chptitle,doctype,embargo,sectionids&onlyEntitled=true&query=cancer&rows=20&sections=results,facets,resultsanalysis,bestbets,topicpages,didyoumean,didyoumean,disambiguations&start=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /\/service\/content\/html\?context=player&eid=1-s2\./.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/ui/service/content/html?context=player&eid=1-s2.0-S0003999317303908&html=true&initialrequest=true&meta=true
    match = /eid=(.*?)&/.exec(path);
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    match = /eid=1-s2\.0-(.*?)&/.exec(path);
    result.pii      = match[1];
  } else if ((match = /\/service\/content\/pdf\/watermarked\/1-s2\./.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/service/content/pdf/watermarked/1-s2.0-S0003999317303908.pdf?locale=en_US
    match = /watermarked\/(.*?)\?/.exec(path);
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    match = /watermarked\/1-s2\.0-(.*?)\./.exec(path);
    result.pii      = match[1];
  } else if ((match = /ui\/service\/content\/ck\/31-s2\./.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/ui/service/content/ck/31-s2.0-50300
    match = /\/ck\/(.*)/.exec(path);
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /\/service\/content\/ck\/5-s2\./.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/service/content/ck/5-s2.0-pe_AAFP_tips-for-parents_en
    match = /\/ck\/(.*)/.exec(path);
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /\/ui\/service\/clinical_overviews\/html\//.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/ui/service/clinical_overviews/html/67-s2.0-3ccbf894-f46b-41db-9321-02dea462dc2c?separateUrgentAction=true&boxes=Differential%20Diagnosis&accordions=Diagnostic%20Procedures&references=true&imageHtml=true&crossLinkHtml=true&product=global
    match = /\/html\/(.*?)\?/.exec(path);
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /eid=3-s2\./.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/ui/service/content/html?context=player&eid=3-s2.0-B9781455733835000555&html=true&initialrequest=true&meta=true
    match = /eid=(.*?)&/.exec(path);
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    /**match = /eid=3-s2\.0-(.*?)&/.exec(path);
    result.pii      = match[1];*/
  } else if ((match = /\/service\/browse\/.*?\/toc\?/.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/service/browse/1-s2.0-S0306460317X00117/toc?hubeid=1-s2.0-S0306460317X00117&product=en_US&rows=9999&start=0
    match = /hubeid=(.*?)&/.exec(path);
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /service\/browse\/drugs\?ckproduct=CK_US&contenttype=DM/.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/service/browse/drugs?ckproduct=CK_US&contenttype=DM&firstchar=O&onlyEntitled=true&product=en_US&rows=50
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /service\/content\/ck\/(.*)/.exec(path)) !== null) {
    // https://www.clinicalkey.com:443/service/content/ck/6-s2.0-3547
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
