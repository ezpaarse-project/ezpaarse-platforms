#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SciVal
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
  let param_match;

  if (/^\/home$/i.test(path)) {
    // https://scival.com/home
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';
  } else if (/^\/benchmarking\/analyse$/i.test(path)) {
    // https://scival.com/benchmarking/analyse
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
  } else if ((match = /^\/overview\/([a-zA-Z0-9]+)$/i.exec(path)) !== null && (param_match = /^Institution\/([0-9]+)$/i.exec(param.uri)) !== null) {
    // https://scival.com/overview/summary?uri=Institution%2F201011
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.db_id = match[1];
    result.unitid   = param_match[1];
  } else if (/^\/trends\/summary$/i.test(path) && (param_match = /^Customer\/[0-9]+\/ResearchArea\/([0-9]+)$/i.exec(param.uri)) !== null) {
    // https://scival.com/trends/summary?uri=Customer/0/ResearchArea/165664
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.unitid   = param_match[1];
  } else if ((match = /^\/([a-zA-Z0-9]+)\/currentCollabMap$/i.exec(path)) !== null && (param_match = /^Institution\/([0-9]+)$/i.exec(param.uri)) !== null) {
    // https://scival.com/collaboration/currentCollabMap?uri=Institution/508179
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.db_id    = match[1];
    result.unitid   = `Institution/${param_match[1]}`;
  } else if ((match = /^\/([a-zA-Z0-9]+)\/policy$/i.exec(path)) !== null && (param_match = /^Institution\/([0-9]+)$/i.exec(param.uri)) !== null) {
    // https://scival.com/impact/policy?uri=Institution/201011
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.db_id    = match[1];
    result.unitid   = param_match[1];
  }
  return result;
});
