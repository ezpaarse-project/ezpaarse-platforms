#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform International Monetary Fund
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if (((match = /^\/category\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) || ((match = /^\/([a-z]+)\/(countries|news\/searchnews|publications|publications\/search|Publications\/Publications-By-Subject|search)$/i.exec(path)) !== null) || ((match = /^\/([a-z]+)\/Countries\/([a-zA-Z]+)$/i.exec(path)) !== null)) {
    // https://blogs.imf.org:443/category/government-2/
    // https://blogs.imf.org:443/category/inclusive-growth/
    // https://www.imf.org:443/en/countries
    // https://www.imf.org:443/en/Countries/PAN
    // https://www.imf.org:443/en/news/searchnews
    // https://www.imf.org:443/en/publications
    // https://www.imf.org:443/en/publications/search?when=After&series=IMF Working Papers
    // https://www.imf.org:443/en/Publications/Publications-By-Subject?subject=Financial%20institutions
    // https://www.imf.org:443/en/search?NewQuery=potatoes
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/$/i.test(path)) {
    if (param.s != null) {
      // https://blogs.imf.org:443/?s=brain
      result.rtype  = 'SEARCH';
      result.mime   = 'MISC';
    }
    else if (param.sk != null) {
      // http://data.imf.org:80/?sk=E5DCAB7E-A5CA-4892-A6EA-598B5463A34C
      result.rtype  = 'DATASET';
      result.mime   = 'MISC';
      result.unitid = param.sk;
    }

  } else if (/^\/api\/document\/download$/i.test(path)) {
    // http://data.imf.org:80/api/document/download?key=61622605&checkOnly=true
    result.rtype  = 'DATASET';
    result.mime   = 'MISC';
    result.unitid = param.key;

  } else if (/^\/external\/mmedia\/view.aspx$/i.test(path)) {
    if (param.st != null) {
      // https://www.imf.org:443/external/mmedia/view.aspx?st=Categories&variable=Africa&variableId=2
      result.rtype  = 'SEARCH';
      result.mime   = 'MISC';
    }
    else if (param.vid != null) {
      // https://www.imf.org:443/external/mmedia/view.aspx?vid=6085402166001
      result.rtype  = 'VIDEO';
      result.mime   = 'MISC';
      result.unitid = param.vid;
    }

  } else if ((match = /^\/(annual-and-spring-meetings|b-roll|features|press-briefings)\/([a-z]+)\/([a-z-]+)\/([a-z]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // http://mediacenter.imf.org:80/annual-and-spring-meetings/all/imf-family-photo-imfc/s/7f7727d5-fddc-45bc-b626-1d027eccbfd8
    // http://mediacenter.imf.org:80/b-roll/all/imf-b-roll/a/89d5796c-40be-47d0-a9fa-df429c912678
    // http://mediacenter.imf.org:80/b-roll/news/imf-world-economic-outlook-update/a/fcefb869-506e-4fd3-854b-e264f5752536
    // http://mediacenter.imf.org:80/features/all/imf-lagarde---trade---us-economy/s/c74e8f12-14d5-4cc8-a5bb-e9d9db6b3a55
    // http://mediacenter.imf.org:80/press-briefings/all/imf-ecb---jordan---china---venezuela/s/1a779bb9-be5b-4f36-b423-b088e5993b15
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1] + '/' + match[2] + '/' + match[3];
    result.unitid   = match[5];

  } else if ((match = /^\/([a-z]+)\/Publications\/([a-zA-Z0-9-]+)\/Issues\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.imf.org:443/en/Publications/Annual-Report-on-Exchange-Arrangements-and-Exchange-Restrictions/Issues/2018/08/10/Annual-Report-on-Exchange-Arrangements-and-Exchange-Restrictions-2017-44930
    // https://www.imf.org:443/en/Publications/Books/Issues/2016/12/31/Measuring-the-Non-Observed-Economy-A-Handbook-31025
    // https://www.imf.org:443/en/Publications/CR/Issues/2016/12/31/Panama-Report-on-Observance-of-Standards-and-Codes-FATF-Recommendations-for-Anti-Money-41349
    // https://www.imf.org:443/en/Publications/GFSR/Issues/2018/09/25/Global-Financial-Stability-Report-October-2018
    // https://www.imf.org:443/en/Publications/WP/Issues/2019/09/13/Financial-Openness-and-Capital-Inflows-to-Emerging-Markets-In-Search-of-Robust-Evidence-48553
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.publication_title = match[2];
    result.title_id = match[2] + '/Issues/' + match[3] + '/' + match[4] + '/' + match[5];
    result.unitid   = match[6];

  } else if ((match = /^\/~\/media\/Files\/Publications\/([a-zA-Z0-9]+)\/([0-9]+)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\/doc\/(sum1|text).ashx$/i.exec(path)) !== null) {
    if (match[5] === 'sum1') {
      // https://www.imf.org:443/~/media/Files/Publications/GFSR/2018/Oct/CH1/doc/sum1.ashx?la=en
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
      result.publication_title = match[1];
      result.title_id = match[1] + '/' + match[2] + '/' + match[3];
      result.unitid   = match[4] + '/doc/' + match[5];
    }
    else if (match[5] === 'text') {
      // https://www.imf.org:443/~/media/Files/Publications/GFSR/2018/Oct/CH1/doc/text.ashx?la=en
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
      result.publication_title = match[1];
      result.title_id = match[1] + '/' + match[2] + '/' + match[3];
      result.unitid   = match[4] + '/doc/' + match[5];
    }

  } else if ((match = /^\/~\/media\/Files\/Publications\/([a-zA-Z0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+).ashx$/i.exec(path)) !== null) {
    // https://www.imf.org:443/~/media/Files/Publications/WP/2019/wpiea2019194-print-pdf.ashx
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.publication_title = match[1];
    result.title_id = 'media/Files/Publications/' + match[1] + '/' + match[2];
    result.unitid   = match[3];

  } else if ((match = /^\/~\/media\/Websites\/([a-zA-Z0-9]+)\/([a-zA-Z0-9-]+)\/([a-z/-]+)\/([0-9]+)\/([a-zA-Z0-9_-]+).ashx$/i.exec(path)) !== null) {
    // https://www.imf.org:443/~/media/Websites/IMF/imported-full-text-pdf/external/pubs/ft/scr/2008/_cr08201.ashx
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.publication_title = match[1];
    result.title_id = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4];
    result.unitid   = match[5];

  } else if ((match = /^\/bloggers\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://blogs.imf.org:443/bloggers/christine-lagarde/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = 'bloggers';
    result.unitid   = match[1];

  } else if ((match = /^\/([0-9/]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://blogs.imf.org:443/2019/05/03/getting-real-on-meeting-paris-climate-change-commitments/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = 'blog/' + match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/([a-z]+)\/News\/Articles\/([0-9/]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.imf.org:443/en/News/Articles/2018/10/03/mcs1032018-panama-staff-concluding-statement-of-the-2018-article-iv-mission
    // https://www.imf.org:443/en/News/Articles/2018/12/28/pr18499-panama-imf-executive-board-concludes-2018-article-iv-consultation
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = 'News/Articles/' + match[2];
    result.unitid   = match[3];

  }

  return result;

});
