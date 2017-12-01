  #!/usr/bin/env node

  /**
   * parser for wiley platform
   * http://analogist.couperin.org/platforms/wiley/
   */
  'use strict';
  const Parser = require('../.lib/parser.js');

  module.exports = new Parser(function analyseEC(parsedUrl) {
    let result = {};
    let path   = parsedUrl.pathname;
    let param  = parsedUrl.query || {};
    let match;

    if ((match = /\/journal\/(10\.[0-9]+\/(\(ISSN\)([0-9]{4}-[0-9]{3}[0-9xX])))/i.exec(path)) !== null) {
      // /journal/10.1111/%28ISSN%291600-5724
      result.doi    = match[1];
      result.unitid = match[2];
      result.rtype  = 'TOC';
      result.mime   = 'MISC';

      result.online_identifier = match[3];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(([^.]+)\.([0-9]{4})\.[^.]+\.[^.]+))\/issuetoc$/i.exec(path)) !== null) {
      // /doi/10.1111/aar.2012.83.issue-1/issuetoc
      // title_id is upper case in PKB from wiley site
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'TOC';
      result.mime     = 'MISC';

      result.publication_date = match[4];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(j\.([0-9]{4}-[0-9]{3}[0-9xX])\.([0-9]{4})\.[^.]+\.[^.]+))\/abstract$/i.exec(path)) !== null) {
      // /doi/10.1111/j.1600-0390.2012.00514.x/abstract
      result.doi    = match[1];
      result.unitid = match[2];
      result.rtype  = 'ABS';
      result.mime   = 'MISC';

      result.online_identifier = match[3];
      result.publication_date  = match[4];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(([^.]+)\.([0-9]{4})[0-9]+))\/abstract$/i.exec(path)) !== null) {
      // /doi/10.1002/anie.201209878/abstract
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'ABS';
      result.mime     = 'MISC';

      result.publication_date = match[4];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(([^.]+)\.[0-9]+))\/full$/i.exec(path)) !== null) {
      // /doi/10.1111/acv.12024/full
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(j\.([0-9]{4}-[0-9]{3}[0-9xX])\.([0-9]{4})\.[^.]+\.[^.]+))\/pdf$/i.exec(path)) !== null) {
      // /doi/10.1111/j.1600-0390.2012.00514.x/pdf
      result.doi    = match[1];
      result.unitid = match[2];
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';

      result.online_identifier = match[3];
      result.publication_date  = match[4];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(([^.]+)\.[0-9]+))\/pdf$/i.exec(path)) !== null) {
      // /doi/10.1002/anie.201209878/pdf
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';

    } else if ((match = /^\/book\/(10\.[0-9]+\/([0-9]+))$/i.exec(path)) !== null) {
      // /book/10.1002/9781118268117
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[2].toUpperCase();
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'MISC';

      result.print_identifier = match[2];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(([0-9]+)\.[^.]+))\/pdf$/i.exec(path)) !== null) {
      // /doi/10.1002/9781118268117.ch3/pdf
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'PDF';

      result.print_identifier = match[3];

    } else if ((match = /^\/enhanced\/doi\/(10\.[0-9]+\/(([^.]+)\.[^/]+))\/?$/i.exec(path)) !== null) {
      // /enhanced/doi/10.1002/cjg2.20083/
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';

    } else if ((match = /^\/enhanced\/doi\/(10\.[0-9]+\/(([0-9]{4})([a-z0-9]{2})[a-z0-9]+))\/?$/i.exec(path)) !== null) {
      // /enhanced/doi/10.1002/2013WR014994/

      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[4].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';

      result.publication_date = match[3];

    } else if ((match = /^\/agu\/issue\/(10\.[0-9]+\/(([^.]+)\.[^/]+))\/?$/i.exec(path)) !== null) {
      // /agu/issue/10.1002/jgrd.v119.14/
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.rtype    = 'TOC';
      result.mime     = 'HTML';

    } else if (/^\/readcube$/i.test(path)) {
      // /readcube?callback=jQuery21009089781963266432_1408430129173&resource=10.1002%2F2014GC005230&_=1408430129174
      result.rtype = 'ARTICLE';
      result.mime  = 'READCUBE';

      if (param.resource) {
        result.doi    = param.resource;
        result.unitid = param.resource.split('/')[1];
        if ((match = /(10\.[0-9]+)\/([0-9]{4})([a-z0-9]{2})([^/]+)$/i.exec(param.resource)) !== null) {
          result.title_id = match[3].toUpperCase();
        }
      }
    } else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z]{1}[0-9]{8}([0-9]{2})[a-z0-9]+))\/pdf$/i.exec(path)) !== null) {
      // /doi/10.1107/S1399004715000292/pdf
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[2].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';

      result.publication_date = '20' + match[3];

    } else if ((match = /^\/iucr\/(10\.[0-9]+\/([a-z]{1}[0-9]{8}([0-9]{2})[0-9a-z]+))/i.exec(path)) !== null) {
      // /iucr/10.1107/S1399004715000292
      // /iucr/10.1107/S139900471402286X
      result.doi      = match[1];
      result.unitid   = match[2] ;
      result.title_id = match[2].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';

      result.publication_date = '20' + match[3];

    }  else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z]{1}[0-9]{8}([0-9]{2})[0-9a-z]+))\/([a-z]+)$/i.exec(path)) !== null) {
      // /doi/10.1107/S1399004715000292/abstract
      // /doi/10.1107/S139900471402286X/pdf
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[2].toUpperCase();

      result.publication_date = '20' + match[3];

      switch (match[4]) {
      case 'abstract':
        result.rtype = 'ABS';
        result.mime  = 'MISC';
        break;
      case 'pdf':
        result.rtype = 'ARTICLE';
        result.mime  = 'PDF';
        break;
      case 'full':
        result.mime  = 'PDF';
        result.rtype = 'HTML';
        break;
      }


    } else if ((match = /^\/store\/(10\.[0-9]+\/(([a-z]+)\.([0-9]{4})[0-9]+))\/asset\/[a-z]+[0-9]+.pdf$/i.exec(path)) !== null) {
      // /store/10.15252/embr.201439742/asset/embr201439742.pdf
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[3].toUpperCase();
      result.mime     = 'PDF';

      result.publication_date = match[4];

    } else if ((match = /^\/doi\/(10\.[0-9]+\/(([0-9]{2,4})([a-z]+)[0-9]+))\/(pdf|full)$/i.exec(path)) !== null) {
      // /doi/10.1002/2015TC003829/pdf
      result.doi      = match[1];
      result.unitid   = match[2];
      result.title_id = match[4].toUpperCase();
      result.rtype    = 'ARTICLE';
      result.mime     = match[5] === 'pdf' ? 'PDF' : 'HTML';

      result.publication_date = match[3];

      if (match[3].length === 2) {
        result.publication_date = '19' + match[3];
      }

    } else if ((match = /^\/doi\/(10\.[0-9]+\/([^.]+))\/(pdf|full)$/i.exec(path)) !== null) {
      // /doi/10.1029/JZ072i023p05799/pdf
      result.doi    = match[1];
      result.unitid = match[2];
      result.rtype  = 'ARTICLE';
      result.mime   = match[3] === 'pdf' ? 'PDF' : 'HTML';
    }

    return result;
  });
