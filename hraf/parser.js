#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Human Relations Area Files
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

  let match;

  if (/^\/(ehrafa|ehrafe)\/([A-z]+)\.do/i.test(path)) {
    // https://ehrafworldcultbrowseCultures.do?context=main
    // http://ehrafworldcultures.yale.edu:80/ehrafe/cultureResults.do?selectedIndex=1 
    // https://ehrafworldcultures.yale.edu:443/ehrafe/dispatchSearch.do?method=documentSearch&col=collection%28%27%2FeHRAF%2Fethnography%2FOceania%2FOP04%27%29&owc=OP04&owcMatches=1&owcDocs=1&cache=0 
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if (/^\//i.test(path)) {
    // https://hraf.yale.edu:443/?submit=Search&s=barton
    if (param.submit === 'Search') {
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
    }

  } if (/^\/ehc\/variables/i.test(path)) {
    // https://hraf.yale.edu:443/ehc/variables?q=climate+zone
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if (/^\/ehrafe\/subjectToc\.do/i.test(path)) {
    // https://ehrafworldcultures.yale.edu:443/ehrafe/subjectToc.do?ocm=721&_=1562597591727
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.ocm + '/' + param._;
    result.title_id = param.ocm + '/' + param._;

  } if (/^\/ehc\/api\/ehc_variables/i.test(path)) {
    // https://hraf.yale.edu:443/ehc/api/ehc_variables/?q=id:5&wt=json
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = param.q;
    result.title_id = param.q;

  } if ((match = /^\/resources\/reference\/([a-z-]+)/i.exec(path)) !== null) {
    // https://hraf.yale.edu:443/resources/reference/outline-of-cultural-materials/
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } if (/^\/(ehrafa|ehrafe)\/citation\.do/i.test(path)) {
    // https://ehrafarchaeology.yale.edu:443/ehrafa/citation.do?method=citation&forward=searchFullContext&col=collection(%27/eHRAF/archaeology/Africa/FA75%27)&docId=fa75-000&tocOffsetId=tocPubInfoP
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = param.docId;
    result.title_id = param.col.slice(13, -2);

  } if (/^\/(ehrafe|ehrafa)\/subjectDescription\.do/i.test(path)) {
    // https://ehrafworldcultures.yale.edu:443/ehrafe/subjectDescription.do?ocm=460&_=1562698445108
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = param.ocm + '/' + param._;
    result.title_id = param.ocm + '/' + param._;

  } if (/^\/(ehrafe|ehrafa)\/pages\/notePopup\.jsp/i.test(path)) {
    // https://ehrafworldcultures.yale.edu:443/ehrafe/pages/notePopup.jsp?code=NC04&facet=owc&_=1562698445111 
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = param.code + '/' + param._;
    result.title_id = param.code + '/' + param._;

  } if (/^\/ehc\/api\/ehc_documents/i.test(path)) {
    // https://hraf.yale.edu:443/ehc/api/ehc_documents?q=id:26&wt=json
    if (param.q) {
      result.rtype = 'ABS';
      result.mime = 'HTML';
      result.unitid = param.q;
      result.title_id = param.q;
    } else if (param.defType) {
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
    }

  } if (/^\/(ehrafa|ehrafe)\/fullContext\.do/i.test(path)) {
    // https://ehrafworldcultures.yale.edu:443/ehrafe/fullContext.do?method=fullContext&forward=browseAuthorsFullContext&col=collection(%27/eHRAF/ethnography/MidEast/M013%27)&docId=m013-026&page=m013-026-000147&offsetId=m013026000097
    result.rtype = 'BOOK_PAGE';
    result.mime = 'HTML';
    result.unitid = param.docId;
    result.title_id = param.docId;


  } if ((match = /^\/([a-z-]+\/)$/i.exec(path)) !== null) {
    // https://hraf.yale.edu:443/how-do-parents-around-the-world-teach-children-to-control-their-anger/
    // https://hraf.yale.edu:443/ccc/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1].slice(0, -1);
    result.title_id = match[1].slice(0, -1);

  } if ((match = /^\/ehc\/assets\/summaries\/([a-z-]+)/i.exec(path)) !== null) {
    // https://hraf.yale.edu:443/ehc/assets/summaries/altered-states-of-consciousness
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } if (/^\/ehrafe\/cultureSummary\.do/i.test(path)) {
    // https://ehrafworldcultures.yale.edu:443/ehrafe/cultureSummary.do?owc=FL12&_=1562008538137
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.owc + '/' + param._;
    result.title_id = param.owc + '/' + param._;

  } if ((match = /^\/(ehc|wp-content)\/(assets|uploads)\/(summaries|([0-9]{4}))\/(pdfs|([0-9]{2}))\/([0-z-]+)\.pdf$/i.exec(path)) !== null) {
    // https://hraf.yale.edu:443/ehc/assets/summaries/pdfs/adolescence.pdf
    // https://hraf.yale.edu:443/wp-content/uploads/2016/06/hraf-ccc-ch8-III.pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[7];
    result.title_id = match[7];

  } if (/^\/ehc\/api\/ehc_hypotheses/i.test(path)) {
    // https://hraf.yale.edu:443/ehc/api/ehc_hypotheses?q=id:262&wt=json&mlt=true&mlt.fl=text
    result.rtype = 'DATA';
    result.mime = 'HTML';
    result.unitid = param.q;
    result.title_id = param.q;

  }

  return result;
});
