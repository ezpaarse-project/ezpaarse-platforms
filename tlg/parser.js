#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Thesaurus Linguae Graecae
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};
  let hash = new Map((parsedUrl.hash || '').replace('#', '').split('&').map(s => s.split('=')));
  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/Iris\/inst\/browser\.jsp$/i.test(path)) {
    // /Iris/inst/browser.jsp#doc=tlg&aid=0537&wid=010&st=0&l=20
    // /Iris/inst/browser.jsp#doc=tlg&aid=0537&wid=016&q=EPICURUS&st=0
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.title_id = hash.get('aid');
    result.pii = hash.get('doc');
    result.unitid = hash.get('wid');

  } else if (/^\/Iris\/inst\/csearch\.jsp$/i.test(path)) {
    // /Iris/inst/csearch.jsp#doc=tlg&aid=&wid=&q=Enter%20your%20selection&dt=list&cs_sort=1_sortname_asc&st=author_text&aw=&verndipl=0&filter_ds=00&per=50&c=3&acp=&editid=
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
