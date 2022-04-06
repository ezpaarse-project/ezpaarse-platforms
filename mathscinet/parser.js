#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MathSciNet
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

  if ((match = /^\/mathscinet\/pdf\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://mathscinet.ams.org/mathscinet/pdf/4217755.pdf?agg_journal_Amer.%20Math.%20Monthly=Amer.%20Math.%20Monthly&arg3=&batch_title=Selected%20Matches%20for%3A%20Title%3D%28proof%29&co4=AND&co5=AND&co6=AND&co7=AND&dr=all&fmt=doc&mx-pid=4217755&pg4=AUCN&pg5=TI&pg6=PC&pg7=ALLF&pg8=ET&r=6&review_format=html&s4=&s5=proof&s6=&s7=&s8=All&searchin=&sort=newest&vfpref=html&yearRangeFirst=&yearRangeSecond=&yrop=eq
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if (/^\/mathscinet\/search\/publdoc.html$/i.test(path)) {
    // https://mathscinet.ams.org/mathscinet/search/publdoc.html?agg_journal_Amer.%20Math.%20Monthly=Amer.%20Math.%20Monthly&arg3=&batch_title=Selected%20Matches%20for%3A%20Title%3D%28proof%29&co4=AND&co5=AND&co6=AND&co7=AND&dr=all&fmt=doc&pg4=AUCN&pg5=TI&pg6=PC&pg7=ALLF&pg8=ET&review_format=html&s4=&s5=proof&s6=&s7=&s8=All&searchin=&sort=newest&vfpref=html&yearRangeFirst=&yearRangeSecond=&yrop=eq&r=6&mx-pid=4217755
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param['mx-pid'];
  } else if (/^\/mathscinet\/search\/author.html$/i.test(path)) {
    // https://mathscinet.ams.org:443/mathscinet/search/author.html?mrauthid=785234
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.mrauthid;
  } else if (/^\/mathscinet\/search\/publications.html$/i.test(path)) {
    // https://mathscinet.ams.org:443/mathscinet/search/publications.html?pg1=INDI&s1=1005949
    // https://mathscinet.ams.org/mathscinet/search/publications.html?pg4=AUCN&s4=&co4=AND&pg5=TI&s5=proof&co5=AND&pg6=PC&s6=&co6=AND&pg7=ALLF&s7=&co7=AND&dr=all&yrop=eq&arg3=&yearRangeFirst=&yearRangeSecond=&pg8=ET&s8=All&review_format=html&Submit=Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
