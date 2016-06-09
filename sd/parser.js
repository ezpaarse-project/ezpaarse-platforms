#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser      = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var url    = parsedUrl.href;
  var path   = parsedUrl.pathname;
  var match;


  if (param._ob) {
    if (param._cdi) {
      result.title_id = param._cdi;
    }
    switch (param._ob) {
    case 'IssueURL':
      // The CDI is the 2nd parameter of _tockey (params separated by '#')
      var arg = param._tockey.split('#');
      result.title_id = arg[2];
      // Set consultation type to TableOfContent (TOC)
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    case 'ArticleURL':
      // Summary of full text
      if (param._fmt) {
        switch (param.fmt) {
        case 'summary':
          // Set consultation type to Summary
          result.rtype = 'ABS';
          result.mime  = 'MISC';
          break;
        case 'full':
          // Set consultation type to Text
          result.rtype = 'ARTICLE';
          result.mime  = 'HTML';
          break;
        }
      }
      break;
    case 'MImg':
      // PDF
      // Set consultation type to PDF
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'MiamiImageURL':
      if (param._pii) {
        result.pii = param._pii;
        if ((match = /S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)/.exec(param._pii)) !== null) {
          // example : http://pdn.sciencedirect.com.gate1.inist.fr/science?_ob=MiamiImageURL&_cid=282179&_user=4046392
          // &_pii=S221267161200100X&_check=y&_origin=browseVolIssue&_zone=rslt_list_item&_coverDate=2012-12-31
          // &wchp=dGLbVlB-zSkWz&md5=79a307d3c9bdbea6d6a6092d73c25545&pid=1-s2.0-S221267161200100X-main.pdf
          result.unitid   = 'S' + match[1] + match[2] + match[3];
          result.title_id = match[1] + match[2];
          result.print_identifier = match[1] + '-' + match[2];
          result.rtype    = 'ARTICLE';
          result.mime     = 'PDF';
        } else if ((match = /B([0-9]{12})([0-9Xx])/.exec(param._pii)) !== null) {
          // example : http://pdn.sciencedirect.com.gate1.inist.fr/science?_ob=MiamiImageURL&_cid=276181&_user=4046392
          // &_pii=B9780122694400500017&_check=y&_origin=browse&_zone=rslt_list_item&_coverDate=1996-12-31
          // &wchp=dGLzVlV-zSkWz&md5=7e7ed3b95463e5438053bb62f487cf57&pid=3-s2.0-B9780122694400500017-main.pdf
          result.unitid   = 'B' + match[1] + match[2];
          result.title_id = match[1] + match[2];
          result.print_identifier  = match[1] + match[2];
          result.rtype    = 'BOOK';
          result.mime     = 'PDF';
        } else {
          var issnTmp     = [ param._pii.substr(1, 4), param._pii.substr(5, 4) ];
          result.title_id = issnTmp[0] + issnTmp[1];
          result.unitid   = issnTmp[0] + issnTmp[1];
          result.print_identifier  = issnTmp[0] + '-' + issnTmp[1];
          // Set consultation type to PDF
          result.rtype    = 'ARTICLE';
          result.mime     = 'PDF';
        }
      }
      break;
    case 'PdfExcerptURL':
      result.rtype    = 'PREVIEW';
      result.mime     = 'PDF';
      if (param._imagekey && param._piikey) {
        result.pii   = param._piikey;
        if ((match = /.?-[^\-]+-([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)-main.pdf$/.exec(param._imagekey)) !== null) {
          // example : http://www.sciencedirect.com:80/science?_ob=PdfExcerptURL&_imagekey=1-s2.0-0304419X91900078-main.pdf
          // &_piikey=0304419X91900078&_cdi=271120&_user=4046392&_acct=C000061186&_version=1&_userid=4046392
          // &md5=558d565a13699ae0796cdf1f600dafa6&ie=/excerpt.pdf
          result.unitid   = param._piikey;
          result.title_id = match[1] + match[2];
          result.print_identifier  = match[1] + '-' + match[2];

        }
      }
      break;
    }
  } else {
    //
    if ((match = /\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)\/pdfft/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com:80/science/article/pii/S1369526612001653/pdfft?
      // md5=c6511f076fa8b25969d8e223410bfb0f&pid=1-s2.0-S1369526612001653-main.pdf
      result.pii = result.unitid = 'S' + match[1] + match[2] + match[3];
      result.title_id = match[1] + match[2];
      result.print_identifier = match[1] + '-' + match[2];
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if ((match = /\/science\/MiamiMultiMediaURL\/[^\/]+(S([0-9]{4})([0-9]{3}[0-9Xx])[^\/]+)(.*).pdf$/.exec(url)) !== null) {
      // http://www.sciencedirect.com:80/science/MiamiMultiMediaURL/1-s2.0-S0960982213001917/1-s2.0-S0960982213001917-mmc1.pdf
      // /272099/FULL/S0960982213001917/b60b292cd91d2846ac711a4e83db83a3/mmc1.pdf
      result.pii = result.unitid   = match[1];
      result.title_id = match[2] + match[3];
      result.print_identifier = match[2] + '-' + match[3];
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
      // http://www.sciencedirect.com:80/science/MiamiMultiMediaURL/1-s2.0-S0960982213001917/1-s2.0-S0960982213001917-mmc1.pdf
      // /272099/FULL/S0960982213001917/b60b292cd91d2846ac711a4e83db83a3/mmc1.pdf
    } else if ((match = /\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/article/pii/S2212671612001011
      result.pii = result.unitid   = 'S' + match[1] + match[2] + match[3];
      result.title_id = match[1] + match[2];
      result.print_identifier = match[1] + '-' + match[2];
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if ((match = /\/science\/article\/pii\/B([0-9]{12}[0-9Xx])([0-9]+)$/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.biblioplanets.gate.inist.fr/science/article/pii/B9780124200029100009
      result.pii = result.unitid   = 'B' + match[1] + match[2];
      result.title_id = match[1];
      result.print_identifier = match[1];
      result.rtype    = 'BOOK';
      result.mime     = 'HTML';
    } else if ((match = /\/(S?([0-9]{4})([0-9]{3}[0-9Xx])([0-9a-zA-Z]+))\/([0-9A-Za-z\-\.]*)-main\.pdf/.exec(path)) !== null) {
      // example : http://ac.els-cdn.com/S0967586808000258/1-s2.0-S0967586808000258-main.pdf?
      // _tid=2146516a-82a7-11e3-a57f-00000aab0f6b&acdnat=1390314188_e595d0b375febbda9fdd48d069be9b55
      // ou
      // http://ac.els-cdn.com/0001871677800035/1-s2.0-0001871677800035-main.pdf?
      // _tid=65623530-1280-11e4-9d32-00000aab0f6b&acdnat=1406130519_9a8661aeed578bd5ef6727f8e65547b2
      result.pii = result.unitid   = match[1];
      result.title_id = match[2] + match[3];
      result.print_identifier  = match[2] + '-' + match[3];
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if ((match = /\/B([0-9]{12}[0-9Xx])([0-9a-zA-Z]+)\/([0-9A-Za-z\-\.]*)-main\.pdf/.exec(path)) !== null) {
      // http://ac.els-cdn.com.gate1.inist.fr/B9780080449241500046/3-s2.0-B9780080449241500046-main.pdf?
      // _tid=c46ad240-215c-11e4-a248-00000aab0f6b&acdnat=1407764484_bb679604d2bb522902776987d43e484e
      result.pii = result.unitid   = 'B' + match[1] + match[2];
      result.title_id = match[1];
      result.print_identifier  = match[1];
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'PDF';
    } else if ((match = /\/science\/publication\?issn=([0-9]{4})([0-9]{4})/.exec(url)) !== null) {
      result.unitid   = match[1] + '-' + match[2];
      result.title_id = match[1] + match[2];
      result.print_identifier  = match[1] + '-' + match[2];
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    } else if ((match = /\/science\/journal\/([0-9]{4})([0-9]{4})/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/journal/22126716
      result.unitid   = match[1] + match[2];
      result.title_id = match[1] + match[2];
      result.print_identifier  = match[1] + '-' + match[2];
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    } else if ((match = /\/science\/bookseries\/([0-9]{8})(\/[0-9]+)?/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/bookseries/00652458
      if (match[2]) {
        result.unitid = match[1] + match[2];
      } else {
        result.unitid = match[1];
      }
      result.print_identifier  = match[1].substr(0, 4) + '-' + match[1].substr(4, 4);
      result.title_id = match[1];
      result.rtype    = 'BOOKSERIE';
      if (match[2]) {
        result.rtype    = 'TOC';
      }
      result.mime     = 'MISC';
    } else if ((match = /\/science\/handbooks\/([0-9]{8})(\/[0-9]+)?/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/handbooks/01673785
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/handbooks/01673785/11
      if (match[2]) {
        result.unitid = match[1] + match[2];
      } else {
        result.unitid = match[1];
      }
      result.print_identifier = match[1].substr(0, 4) + '-' + match[1].substr(4, 4);
      result.title_id = match[1];
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    } else if ((match = /\/science\/book\/([0-9]{13})/.exec(url)) !== null) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/book/9780122694400
      result.unitid   = match[1];
      // ##RN
      result.print_identifier = match[1];
      result.title_id = match[1];
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    }
  }
  return result;
});
