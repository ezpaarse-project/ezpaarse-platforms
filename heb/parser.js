#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Humanities E-Books
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

  if ((match = /^\/the-collection\/([a-z-]+)/i.exec(path)) !== null) {
    // http://www.humanitiesebook.org:80/the-collection/acls-fellows-publications/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if (/^\/a\/acls\/browse/i.test(path)) {
    // https://quod.lib.umich.edu:443/a/acls/browse/subject/A.html
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/cgi\/t\/text\/text-idx$/i.test(path)) {
    // https://quod.lib.umich.edu:443/cgi/t/text/text-idx?c=acls&cc=acls&op2=and&rgn2=series&sort=freq&type=simple&q1=paper&rgn1=full+text&q2=ACLS+Humanities+E-Book&cite1=&cite1restrict=author&cite2=&cite2restrict=author&Submit=Search
    // https://quod.lib.umich.edu:443/cgi/t/text/text-idx?c=acls;cc=acls;idno=heb03408.0001.001;node=heb03408.0001.001%3A4.1;view=toc
    // https://quod.lib.umich.edu:443/cgi/t/text/text-idx?c=acls;cc=acls;rgn=div2;view=text;idno=heb99046.0001.001;node=heb99046.0001.001%3A9.10
    // https://quod.lib.umich.edu:443/cgi/t/text/text-idx?c=acls;idno=heb04957
    if (param.Submit === 'Search') {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    } else if ((match = /idno=(.*?);.*;view=(toc)/i.exec(parsedUrl.path)) !== null) {
      result.rtype = match[2].toUpperCase();
      result.mime  = 'HTML';
      result.title_id = match[1];
      result.unitid = match[1];
    } else if ((match = /view=text;idno=(.*?);/i.exec(parsedUrl.path)) !== null) {
      result.rtype  = 'SUPPL';
      result.mime   = 'HTML';
      result.title_id = match[1];
      result.unitid = match[1];
    } else if ((match = /c=.*;idno=(.*)$/i.exec(parsedUrl.path)) !== null) {
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.title_id = match[1];
      result.unitid = match[1];
    } else if ((match = /view=toc;idno=(.*?);/i.exec(parsedUrl.path)) !== null) {
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.title_id = match[1];
      result.unitid = match[1];
    }
  } else if ((match = /^\/cache\/h\/e\/b\/(.*?)\/[a-z0-9.]+.pdf$/i.exec(path)) !== null) {
    // https://quod.lib.umich.edu:443/cache/h/e/b/heb00001.0001.001/00000001.tif.16.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/cgi\/p\/pod\/dod-idx\/(.*).epub$/i.exec(path)) !== null) {
    // https://quod.lib.umich.edu:443/cgi/p/pod/dod-idx/heb99041.0001.001.epub?c=acls;idno=heb99041.0001.001;format=epub
    result.rtype    = 'ARTICLE';
    result.mime     = 'EPUB';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/cgi\/p\/pod\/dod-idx\/(.*).mobi$/i.exec(path)) !== null) {
    // https://quod.lib.umich.edu:443/cgi/p/pod/dod-idx/heb99041.0001.001.mobi?c=acls;idno=heb99041.0001.001;format=mobi
    result.rtype    = 'ARTICLE';
    result.mime     = 'MOBI';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/cgi\/t\/text\/pageviewer-idx$/i.test(path)) {
    // https://quod.lib.umich.edu:443/cgi/t/text/pageviewer-idx?c=acls;cc=acls;q1=Abolitionists%20--%20United%20States%20--%20History;rgn=subject;idno=heb06236.0001.001;didno=heb06236.0001.001;view=image;seq=00000018;node=heb06236.0001.001%3A3
    result.rtype = 'BOOK_SECTION';
    if ((match = /idno=(.*?);.*;view=(.*?);/i.exec(parsedUrl.path)) !== null) {
      result.title_id = match[1];
      result.unitid = match[1];
      if (match[2] === 'image') {
        result.mime = 'HTML';
      } else {
        result.mime = 'PDF';
      }
    }
  }

  return result;
});
