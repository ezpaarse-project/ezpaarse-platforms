#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Al-Manhal Electronic Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/Tools\/(PreperingPDF|DownloadPDF)$/i.test(path)) {
    // https://platform.almanhal.com/Tools/PreperingPDF?Org=13441&StartPage=1&EndPage=19&_=1698085040614
    //https://platform.almanhal.com/Tools/DownloadPDF?id=2310230921332123506&fileName=The+Silence+of+Gifted+Women++An+Analytical+Study+of+Virgi....zip
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    if (param.fileName) {
      result.title_id = param.fileName;
    }
    if (param.id) {
      result.unitid = param.id;
    } else if (param.Org) {
      result.unitid = param.Org;
    }

    if (param.StartPage) {
      result.first_page = param.StartPage;
    }

    if (param.EndPage) {
      result.last_page = param.EndPage;
    }

  } else if ((match = /^\/Reader\/Article\/([0-9]+)$/i.exec(path)) !== null) {
    // https://platform.almanhal.com/Reader/Article/123506
    // https://platform.almanhal.com/Reader/Article/13441
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/Reader\/Thesis\/([0-9]+)$/i.exec(path)) !== null) {
    // https://platform.almanhal.com/Reader/Thesis/48454
    // https://platform.almanhal.com/Reader/Thesis/45982?search=Virginia%20Woolf
    result.rtype = 'MASTER_THESIS';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/Reader\/Book\/([0-9]+)$/i.exec(path)) !== null) {
    // https://platform.almanhal.com/Reader/Book/2269
    // https://platform.almanhal.com/Reader/Book/121352
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/Browse\/Subject$/i.test(path)) {
    // https://platform.almanhal.com/Browse/Subject
    result.rtype = 'TOC';
    result.mime = 'HTML';
  } else if (/^\/Search\/Result$/i.test(path)) {
    // https://platform.almanhal.com/Search/Result?q=&f_maintopics_ids=89%5B%7C%7C%5D102%5B%7C%7C%5D94%5B%7C%7C%5D925%5B%7C%7C%5D938%5B%7C%7C%5D9%5B%7C%7C%5D20%5B%7C%7C%5D13%5B%7C%7C%5D26%5B%7C%7C%5D27%5B%7C%7C%5D66%5B%7C%7C%5D63%5B%7C%7C%5D45&sf_40_1_2=%D8%A7%D9%84%D8%A3%D8%AF%D8%A8%20%D9%88%D8%A7%D9%84%D9%84%D8%BA%D8%A9
    // https://platform.almanhal.com/Search/Result?q=&sf_40_0_2=%d8%a7%d9%84%d8%a3%d8%af%d8%a8+%d9%88%d8%a7%d9%84%d9%84%d8%ba%d8%a9&f_maintopics_ids=89%5b%7c%7c%5d102%5b%7c%7c%5d94%5b%7c%7c%5d925%5b%7c%7c%5d938%5b%7c%7c%5d9%5b%7c%7c%5d20%5b%7c%7c%5d13%5b%7c%7c%5d26%5b%7c%7c%5d27%5b%7c%7c%5d66%5b%7c%7c%5d63%5b%7c%7c%5d45&f_language_exact_loc_ar=%d8%a7%d9%84%d8%a5%d8%b3%d8%a8%d8%a7%d9%86%d9%8a%d8%a9%5b%7c%7c%5d%d8%a7%d9%84%d8%a5%d9%86%d8%ac%d9%84%d9%8a%d8%b2%d9%8a%d8%a9&opf_language_exact_loc_ar=2&voa=1

    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
