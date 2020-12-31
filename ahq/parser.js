#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ancestry Heritage Quest
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

  if ((match = /^\/search\/collections\/[0-9]+\/$/i.exec(path)) !== null) {
    // https://www.ancestryheritagequest.com/search/collections/2442/?name=_Duffy
    // https://www.ancestryheritagequest.com/search/collections/8802/?name=_Duffy
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/discoveryui-content\/view\/(.+)$/i.exec(path)) !== null) {
    // https://www.ancestryheritagequest.com/discoveryui-content/view/55332762:2442?_phsrc=aTR16&_phstart=successSource&usePUBJs=true&indiv=1&gsln=Duffy&cp=0&new=1&rank=1&uidh=qd1&redir=false&msT=1&gss=angs-d&pcat=35&fh=1&recoff=&ml_rpos=2&queryId=b6fa55c56702c468d8db1f177fdf724b
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/imageviewer\/collections\/[0-9]+\/images\/([0-9a-z-_]+)$/i.exec(path)) !== null) {
    // https://www.ancestryheritagequest.com/imageviewer/collections/8802/images/005537866_00293?treeid=&personid=&hintid=&queryId=348948532fadbaf8c71d0d8730c339cd&usePUB=true&_phsrc=aTR17&_phstart=successSource&usePUBJs=true&pId=437439
    // https://www.ancestryheritagequest.com/imageviewer/collections/1995/images/MIUSA1775D_135440-00283?backlabel=ReturnSearchResults&queryId=d357a4d9e591e6fb96a19eac88a0ced1&pId=18093
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.unitid   = match[1];
  } else if ((match = /^\/HQA\/Maps$/i.exec(path)) !== null) {
    // https://www.ancestryheritagequest.com/HQA/Maps
    result.rtype    = 'MAP';
    result.mime     = 'JPEG';
  } else if ((match = /^\/Content\/researchAids\/([a-z-]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.ancestryheritagequest.com/Content/researchAids/HistoricalCensuses.pdf
    // https://www.ancestryheritagequest.com/Content/researchAids/cemetery-guide.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
