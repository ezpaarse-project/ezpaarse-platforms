#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  var match;


  if (param._ob) {
    if (param._cdi) { result.title_id = param._cdi; }

    switch (param._ob) {
    case 'PdfDownloadURL':

      result.mime = 'PDF';

      if (param._isbn || param.isBook) {
        result.rtype            = 'CHAPTERS_BUNDLE';
        result.print_identifier = param._isbn;
        result.title_id         = param._isbn;
        result.unitid           = param._isbn;
        break;
      }

      result.rtype = 'ARTICLES_BUNDLE';

      result.unitid = param._hubEid;
      result.pii    = (param._hubEid || '').split('-')[2];

      if (result.pii) {
        result.title_id = result.pii.substr(1, 8);
        result.print_identifier = `${result.pii.substr(1, 4)}-${result.pii.substr(5, 4)}`;
      }

      break;
    case 'IssueURL':
      // The CDI is the 2nd parameter of _tockey (params separated by '#')
      result.title_id = (param._tockey || '').split('#')[2];
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
      break;
    case 'ArticleURL':
      switch (param._fmt) {
      case 'summary':
        result.rtype = 'ABS';
        result.mime  = 'MISC';
        break;
      case 'full':
        result.rtype = 'ARTICLE';
        result.mime  = 'HTML';
        break;
      }
      break;
    case 'MImg':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'MiamiImageURL':
      if (!param._pii) { break; }

      result.pii      = param._pii;
      result.unitid   = param._pii;

      if (param._pii.charAt(0) === 'B') {
        // http://pdn.sciencedirect.com/science?_ob=MiamiImageURL&_cid=276181&_user=4046392
        // &_pii=B9780122694400500017&_check=y&_origin=browse&_zone=rslt_list_item&_coverDate=1996-12-31
        // &wchp=dGLzVlV-zSkWz&md5=7e7ed3b95463e5438053bb62f487cf57&pid=3-s2.0-B9780122694400500017-main.pdf
        result.print_identifier = param._pii.substr(1, 13);
        result.title_id         = result.print_identifier;
        result.rtype            = 'BOOK_SECTION';
        result.mime             = 'PDF';

      } else {
        // http://pdn.sciencedirect.com/science?_ob=MiamiImageURL&_cid=282179&_user=4046392
        // &_pii=S221267161200100X&_check=y&_origin=browseVolIssue&_zone=rslt_list_item&_coverDate=2012-12-31
        // &wchp=dGLbVlB-zSkWz&md5=79a307d3c9bdbea6d6a6092d73c25545&pid=1-s2.0-S221267161200100X-main.pdf
        result.print_identifier = `${param._pii.substr(1, 4)}-${param._pii.substr(5, 4)}`;
        result.title_id         = param._pii.substr(1, 8);
        result.rtype            = 'ARTICLE';
        result.mime             = 'PDF';
      }
      break;
    case 'PdfExcerptURL':
      result.rtype = 'PREVIEW';
      result.mime  = 'PDF';

      if (param._imagekey && param._piikey) {
        result.pii = param._piikey;
        if ((match = /.?-[^\-]+-([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)-main.pdf$/.exec(param._imagekey)) !== null) {
          // http://www.sciencedirect.com:80/science?_ob=PdfExcerptURL&_imagekey=1-s2.0-0304419X91900078-main.pdf
          // &_piikey=0304419X91900078&_cdi=271120&_user=4046392&_acct=C000061186&_version=1&_userid=4046392
          // &md5=558d565a13699ae0796cdf1f600dafa6&ie=/excerpt.pdf
          result.unitid           = param._piikey;
          result.title_id         = match[1] + match[2];
          result.print_identifier = match[1] + '-' + match[2];
        }
      }
      break;
    }
  } else if ((match = /^\/science\/article\/pii\/(([SB])?([0-9]{7}[0-9]{5}?[0-9Xx])[0-9A-Za-z]*)(\/pdf(?:ft)?)?$/.exec(path)) !== null) {
    // /science/article/pii/S1369526612001653/pdfft
    // /science/article/pii/S2212671612001011
    // /science/article/pii/B9780124200029100009

    result.pii    = match[1];
    result.unitid = match[1];
    result.mime   = match[4] ? 'PDF' : 'HTML';

    if (match[2] === 'B') {
      result.rtype            = 'BOOK_SECTION';
      result.title_id         = match[3];
      result.print_identifier = match[3];
    } else {
      result.rtype            = 'ARTICLE';
      result.title_id         = match[3].substr(0, 8);
      result.print_identifier = `${match[3].substr(0, 4)}-${match[3].substr(4, 4)}`;
    }

  } else if ((match = /^\/science\/(journal|bookseries|handbooks|handbooks|book)\/([0-9Xx]{8,})(\/[0-9]+)?$/.exec(path)) !== null) {
    // http://www.sciencedirect.com/science/journal/22126716
    // http://www.sciencedirect.com/science/journal/18729312/14
    // http://www.sciencedirect.com/science/bookseries/00652458
    // http://www.sciencedirect.com/science/handbooks/01673785
    // http://www.sciencedirect.com/science/handbooks/01673785/11
    // http://www.sciencedirect.com/science/book/9780122694400

    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[2];
    result.title_id = match[2];

    if (match[3]) { result.unitid += match[3]; }

    switch (match[1]) {
    case 'journal':
    case 'handbooks':
    case 'bookseries':
      result.print_identifier = `${match[2].substr(0, 4)}-${match[2].substr(4, 4)}`;
      break;
    case 'book':
      result.print_identifier = match[2];
      break;
    }

  } else if ((match = /^\/science\/MiamiMultiMediaURL\/[^\/]+(S([0-9]{4})([0-9]{3}[0-9Xx])[a-zA-Z0-9]*).*\.pdf$/.exec(path)) !== null) {
    // http://www.sciencedirect.com:80/science/MiamiMultiMediaURL/1-s2.0-S0960982213001917/1-s2.0-S0960982213001917-mmc1.pdf
    // /272099/FULL/S0960982213001917/b60b292cd91d2846ac711a4e83db83a3/mmc1.pdf
    result.pii              = result.unitid = match[1];
    result.title_id         = `${match[2]}${match[3]}`;
    result.print_identifier = `${match[2]}-${match[3]}`;
    result.rtype            = 'ARTICLE';
    result.mime             = 'PDF';

  } else if ((match = /^\/(([SB])?([0-9]{7}[0-9]{5}?[0-9Xx])[0-9A-Za-z]*)\/[0-9A-Za-z\-\.]*-main\.pdf$/.exec(path)) !== null) {
    // http://ac.els-cdn.com/S0967586808000258/1-s2.0-S0967586808000258-main.pdf?
    // _tid=2146516a-82a7-11e3-a57f-00000aab0f6b&acdnat=1390314188_e595d0b375febbda9fdd48d069be9b55
    // ou
    // http://ac.els-cdn.com/0001871677800035/1-s2.0-0001871677800035-main.pdf?
    // _tid=65623530-1280-11e4-9d32-00000aab0f6b&acdnat=1406130519_9a8661aeed578bd5ef6727f8e65547b2
    result.pii    = match[1];
    result.unitid = match[1];
    result.mime   = 'PDF';

    if (match[2] === 'B') {
      result.rtype            = 'BOOK_SECTION';
      result.title_id         = match[3];
      result.print_identifier = match[3];
    } else {
      result.rtype            = 'ARTICLE';
      result.title_id         = match[3].substr(0, 8);
      result.print_identifier = `${match[3].substr(0, 4)}-${match[3].substr(4, 4)}`;
    }

  } else if (path === '/science/publication') {
    result.rtype = 'TOC';
    result.mime  = 'MISC';

    if (param.issn) {
      result.print_identifier = `${param.issn.substr(0, 4)}-${param.issn.substr(4, 4)}`;
      result.unitid           = result.print_identifier;
      result.title_id         = param.issn;
    }
  }

  return result;
});
