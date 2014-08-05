#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 250*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Oxford Handbooks
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;

  path = path.replace(/\$002f/g, '/');

  var match;

  if ((match = /^(?:\/mobile)?\/view\/([0-9]+\.[0-9]+\/([a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+)\/[a-z]+\-[0-9]+(\-e\-[0-9]+)?$/.exec(path)) !== null) {
    // http://www.oxfordhandbooks.com/view/10.1093/oxfordhb/9780195188059.001.0001/oxfordhb-9780195188059?rskey=X02O1L&result=1
    // http://www.oxfordhandbooks.com/view/10.1093/oxfordhb/9780195188059.001.0001/oxfordhb-9780195188059-e-2
    result.rtype            = match[4] ? 'BOOK_SECTION' : 'TOC';
    result.mime             = 'HTML';
    result.doi              = match[1];
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.print_identifier = match[3];

    // if the size is less than 18ko, it's not the actual article
    if (result.rtype === 'BOOK_SECTION' && ec.size && ec.size < 18000) {
      result._granted = false;
    }
  } else if ((match = /^\/[a-z]+\/download[a-z]+\/\/?([0-9]+\.[0-9]+\/([a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+)\/[a-z]+\-[0-9]+\-e\-[0-9]+\/.*/.exec(path)) !== null) {
    // http://www.oxfordhandbooks.com/oso/downloaddoclightbox/$002f10.1093$002foxfordhb$002f9780195188059.001.0001$002foxfordhb-9780195188059-e-2/An$0020American$0020Conundrum:$0020Race$002c$0020Sociology$002c$0020And$0020The$0020African$0020American$0020Road$0020To$0020Citizenship?nojs=true
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'PDF';
    result.doi              = match[1];
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.print_identifier = match[3];
  }


  return result;
});
