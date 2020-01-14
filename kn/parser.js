#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Elsevier Elibrary
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let match;

  if (/^\/web\/search\.v$/i.test(path)) {
    // https://app.knovel.com/web/search.v?q=cancer
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = param.q;
    // result.unitid   = match[2];

  } else if ((match = /^\/web\/toc\.v\/cid:(\w+)\/.*$/i.exec(path)) !== null) {
    // https://app.knovel.com:443/web/toc.v/cid:kpHNGTPPP5/viewerType:toc/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    // result.unitid   = match[2];

  } else if ((match = /^\/hotlink\/pdf\/rcid:(\w+)\/id:(\w+)\/.*$/i.exec(path)) !== null) {
    // https://app.knovel.com:443/hotlink/pdf/rcid:kpPHE00026/id:kt003S1ZW3/polymer-handbook-4th/chemical-abstract-registry?q=vih&b-q=vih&sort_on=default&b-subscription=true&b-group-by=true&page=1&b-sort-on=default&b-content-type=all_references&include_synonyms=no
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/web\/view\/pdf\/showm\.v\/rcid:(\w+)\/cid:(\w+)\/.*$/i.exec(path)) !== null) {
    // https://app.knovel.com:443/web/view/pdf/showm.v/rcid:kpMFATCS01/cid:kt011PU0U6/viewerType:pdf//root_slug:5-manufacturing-defects/url_slug:manufacturing-defects?cid=kt011PU0U6&b-q=failure%20analysis&sort_on=default&b-subscription=true&b-group-by=true&b-sort-on=default&b-content-type=all_references&include_synonyms=no&b-toc-cid=kpMFATCS01&b-toc-root-slug=&b-toc-url-slug=manufacturing-defects&b-toc-title=Metallurgical%20Failure%20Analysis%20-%20Techniques%20and%20Case%20Studies
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/web\/view\/khtml\/show\.v\/rcid:(\w+)\/cid:(\w+)\/.*$/i.exec(path)) !== null) {
    // https://app.knovel.com/web/view/khtml/show.v/rcid:kpNCRPRN01/cid:kt011ND2H6/viewerType:khtml//root_slug:8-elicitation-of-judgments-and-processing-of-probability-density-functions-of-the-effectiveness-ratio/url_slug:elicitation-judgments?b-q=cancer&sort_on=default&b-subscription=true&b-group-by=true&b-sort-on=default&b-content-type=all_references&include_synonyms=no&b-toc-cid=kpNCRPRN01&b-toc-root-slug=&b-toc-url-slug=elicitation-judgments&b-toc-title=NCRP%20Report%20No.%20181%20-%20Evaluation%20of%20the%20Relative%20Effectiveness%20of%20Low-Energy%20Photons%20and%20Electrons%20in%20Inducing%20Cancer%20in%20Humans&page=1&view=collapsed&zoom=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  }

  return result;
});