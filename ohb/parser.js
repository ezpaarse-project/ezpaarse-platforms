#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Oxford Handbooks
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname.replace(/\$002f/g, '/');
  let param = parsedUrl.query || {};
  let match;

  if ((match = /^(?:\/mobile)?\/view\/([0-9]+\.[0-9]+\/([a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+)\/[a-z]+-[0-9]+(-e-[0-9]+)?$/.exec(path)) !== null) {
    // http://www.oxfordhandbooks.com/view/10.1093/oxfordhb/9780195188059.001.0001/oxfordhb-9780195188059?rskey=X02O1L&result=1
    // http://www.oxfordhandbooks.com/view/10.1093/oxfordhb/9780195188059.001.0001/oxfordhb-9780195188059-e-2
    result.rtype = match[4] ? 'BOOK_SECTION' : 'TOC';
    result.mime = param && param.print === 'pdf' ? 'PDF' : 'HTML';
    result.doi = match[1];
    result.unitid = match[1];
    result.title_id = match[2];
    result.print_identifier = match[3];

    // if the size is less than 18ko, it's not the actual article
    if (result.rtype === 'BOOK_SECTION' && ec.size && ec.size < 18000) {
      result._granted = false;
    }
  } else if ((match = /^\/[a-z]+\/download[a-z]+\/\/?([0-9]+\.[0-9]+\/([a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+)\/[a-z]+-[0-9]+-e-[0-9]+\/.*/.exec(path)) !== null) {
    // http://www.oxfordhandbooks.com/oso/downloaddoclightbox/$002f10.1093$002foxfordhb$002f9780195188059.001.0001$002foxfordhb-9780195188059-e-2/An$0020American$0020Conundrum:$0020Race$002c$0020Sociology$002c$0020And$0020The$0020African$0020American$0020Road$0020To$0020Citizenship?nojs=true
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.doi = match[1];
    result.unitid = match[1];
    result.title_id = match[2];
    result.print_identifier = match[3];
  } else if ((match = /^\/search-results?$/.exec(path)) !== null) {
    // https://academic.oup.com/search-results?page=1&q=the%20oxford%20handbook%20of%20war&fl_SiteID=191&SearchSourceType=1
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/edited-volume\/([0-9]+)?$/.exec(path)) !== null) {
    // https://academic.oup.com/edited-volume/34362?searchresult=1
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/edited-volume\/([0-9]+)\/chapter\/([0-9]+)?$/.exec(path)) !== null) {
    // https://academic.oup.com/edited-volume/34362/chapter/291466745
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[2];
  }

  return result;
});
