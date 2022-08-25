#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nexis Uni
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

  if (/^\/search\/$/i.test(path)) {
    // https://advance.lexis.com:443/search/?pdmfid=1516831&crid=f4b28c75-23dc-4b70-9131-db6f9c0ca518&pdtypeofsearch=searchboxclick&pdsearchtype=SearchBox&pdqttype=and&pdbcts=1513723230381&pdpsf=undefined&earg=pdpsf&pdsearchterms=trump&pdquerytemplateid=urn%3Aquerytemplate%3A78338d18781c574d11af5fa2f7097c99~%5ENews&pdstartin=undefined&ecomp=s8ykkhk&prid=8b8a9048-9ae2-4636-a607-6a2bd9590118&_=1513723234590
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/\/document\//i.test(path)) {
    // https://advance.lexis.com:443/document/?pdmfid=1516831&crid=cf9d3984-a5ab-4c29-8d8c-959f2d179bb8&pddocfullpath=%2Fshared%2Fdocument%2Fnews%2Furn%3AcontentItem%3A5MPY-92H1-JCT0-N1F7-00000-00&pddocid=urn%3AcontentItem%3A5MPY-92H1-JCT0-N1F7-00000-00&pdcontentcomponentid=237501&pdteaserkey=sr0&pditab=allpods&ecomp=dy_k&earg=sr0&prid=f4b28c75-23dc-4b70-9131-db6f9c0ca518&_=1513723378045
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.pdcontentcomponentid;
  } else if (/^\/toc\/minitoclever\/$/i.test(path)) {
    // https://advance.lexis.com:443/toc/minitoclever/?pdmfid=1516831&crid=a707d57c-c92c-4adf-8d77-142f8f8df659&pdtocfullpath=%2Fshared%2Ftableofcontents%2Furn%3AcontentItem%3A520N-P191-DY3V-G1SV-00000-00&pdtocnodeid=ROOT&pdtocsearchterm=&ecomp=LgLdk&prid=d9ab9b3f-1eb1-4005-a38f-12fa1f8334ed&_=1513723816857
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.crid;
  } else if ((match = /^\/r\/delivery\/content\/(.*)\/download\/[0-9]*\/FullDoc$/i.exec(path)) !== null) {
    // https://advance.lexis.com:443/r/delivery/content/190521299/download/58522529/FullDoc
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if (/^\/en-us\/about-us\/media\/press-release.page$/i.test(path)) {
    // http://www.lexisnexis.com:80/en-us/about-us/media/press-release.page?id=1485461802825730&y=2017
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = param.id;
    result.publication_date = param.y;
  } else if (/\/practice-advisor-browse-results\/$/i.test(path)) {
    // https://advance.lexis.com:443/open/practice-advisor-browse-results/?pdcatfilters=UHJhY3RpY2VBcmVhXnVybjp0b3BpYzo4NjRCRTQ0MjhDN0QzRTJCOEIxMkY2OTExRjJFNkY0Q3xDb250ZW50VHlwZV5BUlRJQ0xFUw&pdbcts=1513798142432&crid=ee519864-de91-4aca-a60d-4cc39438ee24&prid=90072459-91ea-4f7d-87cc-2d0a6dfde4c5&pdpt=Articles
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/en-us\/search.page$/i.test(path)) {
    // https://www.lexisnexis.com:443/en-us/search.page?page=5&q=search%20for%20stuff%20here
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/pdf\/lexis-advance\/(.*)$/i.exec(path)) !== null) {
    // https://www.lexisnexis.com:443/pdf/lexis-advance/Common-Research-Tasks.pdf
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
