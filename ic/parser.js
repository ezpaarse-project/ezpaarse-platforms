#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ingenta Connect
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;


  if ((match = /^\/deliver\/connect\/(([a-z]+)\/([0-9]{4})([0-9]{3}[0-9x])\/v([0-9]+)n([0-9]+)\/[a-z0-9]+)\.(pdf|html)$/i.exec(path)) !== null) {
    // http://docserver.ingentaconnect.com/deliver/connect/iapt/00400262/v66n5/s6.pdf
    // http://docserver.ingentaconnect.com/deliver/connect/cog/10522166/v14n5/s4.html

    result.rtype            = 'ARTICLE';
    result.mime             = match[7].toUpperCase();
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.print_identifier = `${match[3]}-${match[4]}`;
    result.vol              = match[5];
    result.issue            = match[6];

  } else if ((match = /^\/content\/([a-z]+\/([a-z]+))$/i.exec(path)) !== null) {
    // http://www.ingentaconnect.com/content/tandf/umgd
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];

  } else if ((match = /^\/content\/([a-z]+\/([a-z]+)\/([0-9]{4})\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // http://www.ingentaconnect.com/content/schweiz/rs/2010/00000019/00000001
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.vol              = parseInt(match[4]).toString();
    result.issue            = parseInt(match[5]).toString();

  } else if ((match = /^\/contentone\/([a-z]+\/([a-z]+)\/([0-9]{4})\/([0-9]+)\/([0-9]+)\/[a-z0-9_.-]+)$/i.exec(path)) !== null) {
    // http://www.ingentaconnect.com/contentone/springer/usw/2017/00000001/00000001/art00005
    result.rtype            = 'ABS';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.vol              = parseInt(match[4]).toString();
    result.issue            = parseInt(match[5]).toString();
  }

  return result;
});
