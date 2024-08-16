#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Company of Biologists
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

  if (/^\/[a-zA-Z0-9]+\/search-results$/i.test(path)) {
    // https://journals.biologists.com/jcs/search-results?page=1&q=Pathogens&fl_SiteID=1000007
    // https://journals.biologists.com/jeb/search-results?page=1&q=Mapping&fl_SiteID=1000009
    // https://journals.biologists.com/dmm/search-results?page=1&q=Macrophages&fl_SiteID=1000003
    // https://journals.biologists.com/bio/search-results?page=1&q=stimuli&fl_SiteID=1000001
    // https://journals.biologists.com/journals/search-results?page=1&q=Mapping&fl_SiteID=3&allJournals=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/Toolbox\/DownloadCombinedArticleAndSupplmentPdf$/i.exec(path)) !== null && param.resourceId !== undefined && param.pdfUrl !== undefined) {
    // https://journals.biologists.com/Toolbox/DownloadCombinedArticleAndSupplmentPdf?resourceId=361490&multimediaId=3558762&pdfUrl=/cob/content_public/journal/bio/13/8/10.1242_bio.060205/2/bio060205.pdf
    // https://journals.biologists.com/Toolbox/DownloadCombinedArticleAndSupplmentPdf?resourceId=361492&multimediaId=3558644&pdfUrl=/cob/content_public/journal/dmm/17/8/10.1242_dmm.050693/2/dmm050693.pdf
    // https://journals.biologists.com/Toolbox/DownloadCombinedArticleAndSupplmentPdf?resourceId=224739&multimediaId=3511707&pdfUrl=/cob/content_public/journal/jcs/133/1/10.1242_jcs.236489/5/jcs236489.pdf
    // https://journals.biologists.com/Toolbox/DownloadCombinedArticleAndSupplmentPdf?resourceId=361243&multimediaId=3555465&pdfUrl=/cob/content_public/journal/jeb/227/14/10.1242_jeb.247419/1/jeb247419.pdf
    // https://journals.biologists.com/Toolbox/DownloadCombinedArticleAndSupplmentPdf?resourceId=361248&multimediaId=3555541&pdfUrl=/cob/content_public/journal/jeb/227/14/10.1242_jeb.247043/1/jeb247043.pdf
    result.rtype    = 'SUPPL';
    result.mime     = 'PDF';
    let temp = param.pdfUrl.split('/');
    result.db_id    = temp[4];
    result.issue    = temp[6];
    result.vol      = temp[5];
    result.unitid   = param.resourceId;

  } else if ((match = /^\/[a-zA-Z]+\/article-pdf\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9]+)\/([0-9]+)\/([a-zA-Z0-9]+).pdf$/i.exec(path)) !== null) {
    // https://journals.biologists.com/bio/article-pdf/13/8/bio060543/3560201/bio060543.pdf
    // https://journals.biologists.com/dmm/article-pdf/17/8/dmm050693/3558644/dmm050693.pdf
    // https://journals.biologists.com/jeb/article-pdf/227/14/jeb247043/3555541/jeb247043.pdf
    // https://journals.biologists.com/jcs/article-pdf/137/14/jcs262042/3555318/jcs262042.pdf
    // https://journals.biologists.com/jcs/article-pdf/137/14/jcs261532/3555571/jcs261532.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.issue    = match[2];
    result.vol      = match[1];
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/${match[4]}/${match[5]}.pdf`;

  } else if ((match = /^\/[a-zA-Z]+\/article\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://journals.biologists.com/bio/article/13/8/bio060543/361624/A-fast-fish-swimming-protocol-that-provides
    // https://journals.biologists.com/dmm/article/17/8/dmm050693/361492/Macrophages-directly-kill-bladder-cancer-cells
    // https://journals.biologists.com/jeb/article/227/14/jeb247043/361248/Ice-in-the-intertidal-patterns-and-processes-of
    // https://journals.biologists.com/jcs/article/137/14/jcs262042/361233/Simple-prerequisite-of-presequence-for
    // https://journals.biologists.com/jcs/article/137/14/jcs261532/361251/Tetraspanin-proteins-in-membrane-remodeling
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[5];
    result.issue    = match[2];
    result.vol      = match[1];
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/${match[4]}/${match[5]}`;

  } else if ((match = /^\/[a-zA-Z]+\/issue\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://journals.biologists.com/jcs/issue/137/14
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.issue    = match[2];
    result.vol      = match[1];
    result.unitid   = `${match[1]}/${match[2]}`;

  }

  return result;
});
