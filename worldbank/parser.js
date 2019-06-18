#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform World Bank
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/action\/doSearch$/i.test(path)) || (/^\/action\/showPublications$/i.test(path)) || (/^\/topic\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/page\/([a-zA-Z-]+)$/i.test(path)) || (/^\/en\/search$/i.test(path)) || (/^\/en\/country\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/en\/topic\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/author\/([a-zA-Z0-9,+]+)$/i.test(path))) {
    // https://elibrary.worldbank.org:443/action/doSearch?AllField=bananas
    // https://elibrary.worldbank.org:443/action/showPublications?PubType=type-other-research&SeriesKey=kp03
    // https://elibrary.worldbank.org:443/topic/t021
    // https://elibrary.worldbank.org:443/page/wb-other-research
    // http://www.worldbank.org:80/en/search?q=study
    // http://www.worldbank.org:80/en/country/ghana
    // http://www.worldbank.org:80/en/topic/climatechange
    // https://elibrary.worldbank.org:443/author/Figueiredo%2C+Joe
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (((match = /^\/loi\/(.*)/i.exec(path)) !== null) || ((match = /^\/toc\/(.*)/.exec(path)) !== null)) {
    // https://elibrary.worldbank.org:443/loi/deor
    // https://elibrary.worldbank.org:443/toc/wber/24/3
    // https://elibrary.worldbank.org:443/toc/deor/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/handle\/([0-9/]+)\/([a-zA-Z]+)$/i.exec(path)) !== null) {
    // https://openknowledge.worldbank.org/handle/10986/13083/discover?filtertype_1=title&filter_relational_operator_1=contains&filter_1=&rpp=10
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/handle\/([0-9/]+)$/i.exec(path)) !== null) {
    // https://openknowledge.worldbank.org:443/handle/10986/30026
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/en\/topic\/([a-z+-]+)\/publication\/([a-z+-]+)/i.exec(path)) !== null) {
    // http://www.worldbank.org:80/en/topic/health/publication/universal-health-coverage-study-series
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/en\/topic\/([a-z+-]+)\/overview$/i.exec(path)) !== null) {
    // http://www.worldbank.org:80/en/topic/climatechange/overview
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/en\/news\/([a-z+-]+)\/([0-9/]+)\/([a-z+-]+)/i.exec(path)) !== null) {
    // http://www.worldbank.org:80/en/news/press-release/2019/04/13/coalition-of-finance-ministers-for-climate-action
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[3];

  } else if ((match = /^\/bitstream\/handle\/([0-9/]+)\/([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://openknowledge.worldbank.org:443/bitstream/handle/10986/30026/127140.pdf?sequence=1&isAllowed=y
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = match[1] + '/' + match[2];
    result.print_identifier = match[2];

  } else if (/^\/action\/showDataView$/i.test(path)) {
    if (param.download == 'csv') {
    // https://elibrary.worldbank.org:443/action/showDataView?indicator=SH.DYN.MORT&download=csv
      result.mime    = 'CSV';
    }
    if (param.download !== 'csv') {
    // https://elibrary.worldbank.org:443/action/showDataView?indicator=SH.DYN.MORT&download=csv
      result.mime    = 'HTML';
    }
    result.rtype    = 'DATASET';
    result.title_id = param.region || param.indicator;
    result.unitid   = param.region || param.indicator;

  } else if ((match = /^\/en\/([0-9]+)\/([a-zA-Z0-9+-]+).pdf$/i.exec(path)) !== null) {
    // http://pubdocs.worldbank.org:80/en/575341556832785539/CMO-Pink-Sheet-May-2019.pdf
    result.rtype    = 'DATASET';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/country\/([a-z+-]+)$/i.exec(path)) !== null) {
    // http://data.worldbank.org:80/country/faeroe-islands
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/doi\/([a-z]+)\/(.*)\/(.*)/i.exec(path)) !== null) {
    if (match[1] == 'abs') {
    // https://elibrary.worldbank.org:443/doi/abs/10.1596/1020-797X_12_2_19
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
    }
    if (match[1] == 'book') {
      if (param.chapterTab == 'true') {
      // https://elibrary.worldbank.org:443/doi/book/10.1596/978-1-4648-1281-1?chapterTab=true
        result.rtype   = 'TOC';
        result.mime     = 'HTML';
      }
      if (param.chapterTab !== 'true') {
      // https://elibrary.worldbank.org:443/doi/book/10.1596/978-0-8213-9635-3
        result.rtype   = 'ABS';
        result.mime     = 'HTML';
      }
    }
    if (match[1] == 'full') {
    // https://elibrary.worldbank.org:443/doi/full/10.1596/978-1-4648-1002-2_Module2
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    }
    if (match[1] == 'pdf') {
    // https://elibrary.worldbank.org:443/doi/pdf/10.1596/978-1-4648-1281-1_ch3
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    }
    if (match[1] == 'ref') {
    // https://elibrary.worldbank.org:443/doi/pdf/10.1596/978-1-4648-1281-1_ch3
      result.rtype    = 'REF';
      result.mime     = 'HTML';
    }
    result.title_id = match[2] + '/' + match[3];
    result.unitid   = match[2] + '/' + match[3];
    result.doi      = match[2] + '/' + match[3];
    result.print_identifier = match[3];
  }

  return result;
});
