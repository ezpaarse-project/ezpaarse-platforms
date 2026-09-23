#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bloomsbury
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  let match;

  if (/^\/app\/downloadpdf$/i.test(path)) {
    // https://www.bloomsburycollections.com/app/downloadpdf?type=monograph&xmlPath=collections/60/content-types/xml//9781509982806_txt_xml.xml&xsltPath=/content-types/monograph/monograph-detail-download.xsl&productLogo=bloomsbury_assets/collections/images/BBY_Collections_420x75_COLOUR.png&mlaCitation=&lang=en&documentId=b-9781509982806&currentTime=Fri%20Sep%2018%202026%2009:48:37%20Central%20European%20Summer%20Time&tocId=b-9781509982806-chapter2&productName=collections&citationExist=true&workloc=$workPath&territory=LU&cachepagetype=monodet&chapterPdfId=9781509982806.ch-002.pdf&tocPage=false&epdfIsbn=undefined&docIdS=b-9781509982806&openAccess=false
    const idMatch = /^((97[89][0-9]{10})(\.ch-[0-9]+)?)/.exec(param.chapterPdfId) || {};

    result.rtype = idMatch[3] ? 'BOOK_SECTION' : 'BOOK';
    result.mime = 'PDF';
    result.unitid = idMatch[1] || param.docid;
    result.online_identifier = idMatch[2];

    if (!result.online_identifier) {
      const isbnMatch = /^b-(97[89][0-9]{10})$/.exec(param.docid);
      if (isbnMatch) {
        result.online_identifier = isbnMatch[1];
      }
    }

  } else if (/^\/monograph-detail$/i.test(path)) {
    // https://www.bloomsburycollections.com/monograph-detail?docid=b-9781509982806&pdfid=9781509982806.ch-002.pdf&tocid=b-9781509982806-chapter2

    const idMatch = /^((97[89][0-9]{10})(\.ch-[0-9]+)?)/.exec(param.pdfid) || {};

    result.rtype = idMatch[3] ? 'BOOK_SECTION' : 'BOOK';
    result.mime = 'HTML';
    result.unitid = idMatch[1] || param.docid;
    result.online_identifier = idMatch[2];

    if (!result.online_identifier) {
      const isbnMatch = /^b-(97[89][0-9]{10})$/.exec(param.docid);
      if (isbnMatch) {
        result.online_identifier = isbnMatch[1];
      }
    }
  } else if (/^\/monograph$/i.test(path) && param.docid) {
    // https://www.bloomsburycollections.com/monograph?docid=b-9781509982806&st=EU+anti-money+laundering
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.docid;

    const isbnMatch = /^b-(97[89][0-9]{10})$/.exec(param.docid);
    if (isbnMatch) {
      result.online_identifier = isbnMatch[1];
    }
  } else if ((match = /^\/book\/([a-z0-9-]+)\.pdf$/i.exec(path)) !== null) {
    // //www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature.pdf?dl
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/book\/([a-z0-9-]+)\/([a-z0-9-]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature/ch1-concepts-of-the-afterlife.pdf?dl
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/book\/([a-z0-9-]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature/ch1-concepts-of-the-afterlife
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/book\/([a-z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/search(?:-results)?$/i.test(path)) {
    // https://www.bloomsburycollections.com/search?searchString=rocks&newSearchRecord=
    // https://www.bloomsburycollections.com/search-results?any=EU%20Anti-Money%20Laundering
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
