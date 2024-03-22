#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Therapeutic Guidelines
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

  // let match;

  if (/^\/topicTeaser$/i.test(path)) {
    // https://tgldcdp.tg.org.au/topicTeaser?guidelinePage=Wilderness+Medicine&etgAccess=true
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.guidelinePage.replace(' ', '+');
  } else if (/^\/searchAction$/i.test(path)) {
    // https://tgldcdp.tg.org.au/searchAction?appendedinputbuttons=hyperventilation
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/viewTopic$/i.test(path)) {
    // https://tgldcdp.tg.org.au/viewTopic?etgAccess=true&guidelinePage=Wilderness%20Medicine&topicfile=altitude-illness&guidelinename=auto&sectionId=c_WMG_Alititude_illness_topic_4#c_WMG_Alititude_illness_topic_4
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.db_id    = param.topicfile;
    result.unitid   = param.sectionId;
  }

  return result;
});
