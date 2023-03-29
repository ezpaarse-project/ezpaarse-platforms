#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Quintessence Publishing
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let query  = parsedUrl.query || {};
  let match;


  if ((match = /^\/journals\/([a-z]+)\/(fulltext|abstract)\.php$/i.exec(path)) !== null) {
    // http://www.quintpub.com/journals/qi/fulltext.php?article_id=22947
    // http://www.quintpub.com/journals/ijp/abstract.php?iss2_id=1845&article_id=22891&article=3&title=Predoctoral%20Student%20Performance%20in%20a%20Restorative%20Dentistry%20Course%20During%20the%20COVID-19%20Pandemic

    result.rtype    = match[2] === 'fulltext' ? 'ARTICLE' : 'ABS';
    result.mime     = match[2] === 'fulltext' ? 'PDF' : 'HTML';
    result.title_id = match[1];

    if (query.article_id) {
      result.unitid = query.article_id;
    }
  } else if ((match = /^\/journals\/([a-z]+)\/journal_contents\.php$/i.exec(path)) !== null) {
    // http://www.quintpub.com/journals/ijp/journal_contents.php?iss_id=1845&journal_name=IJP&vol_year=2022&vol_num=35

    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = `${result.title_id}/${query.vol_num}/${query.iss_id}`;
    result.vol      = query.vol_num;
    result.publication_date = query.vol_year;
  }

  return result;
});
