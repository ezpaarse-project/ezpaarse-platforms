#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform UpToDate
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

  if ((match = /^\/contents\/table-of-contents\/([a-z0-9-]+)\/?([a-z0-9-]+)?/i.exec(path)) !== null) {
    // /contents/table-of-contents/drug-information/patient-drug-information
    // /contents/table-of-contents/allergy-and-immunology
    // /contents/table-of-contents/patient-education/cancer

    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2] || match[1];
  } else if ((match = /^\/contents\/calculator-([a-z0-9-]+)\/?/i.exec(path)) !== null) {
    // /contents/calculator-cha2ds2-vasc-risk-stratification-score-for-estimation-of-stroke-risk-for-nonvalvular-atrial-fibrillation-in-adults
    // /contents/calculator-lean-body-weight-lbw-adult-female

    result.rtype    = 'FORMULES';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/contents\/(search|image|[a-z0-9-]+|)\/?(abstract)?\/?([0-9,]+)?/i.exec(path)) !== null) {
    // /contents/coronaviruses?search=coronavirus&source=search_result&selectedTitle=1~56&usage_type=default&display_rank=1
    // /contents/acetaminophen-paracetamol-and-codeine-pediatric-drug-information
    // /contents/search?search=coronavirus
    // /contents/image?imageKey=DRUG/57469&topicKey=DRUG_PED%2F13092&source=outline_link
    // /contents/coronavirus-disease-2019-covid-19/abstract/23,25
    // /contents/coronaviruses/abstract/11

    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    switch (match[1]) {
    case 'search':
      result.rtype  = 'SEARCH';
      break;

    case 'image':
      result.rtype  = 'TABLE';
      result.unitid = param.imageKey.split('/')[1];
      break;

    default:
      result.unitid = match[1];
      break;
    }

    if (match[2]) {
      result.rtype  = 'ABS';
      result.unitid = `${match[1]}-${match[3]}`;
    }
  }
  else if ((match = /^\/services\/app\/([a-z0-9-]+)\/?/i.exec(path)) !== null) {
    // /services/app/drug/interaction/search/json?drug=g12b0&drug=g1051b4060&search=null

    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.unitid   = `${match[1]}=${param[match[1]].join(`&${match[1]}=`)}`;
  }

  return result;
});
