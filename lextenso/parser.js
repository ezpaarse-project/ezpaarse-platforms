#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lextenso
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  // nouvelle plateforme
  if ((match = /^\/revue(\/([A-Z]+)\/\d+\/\d+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/revue/BJB/2018/05
    //https://www.lextenso.fr/revue/DFF/2018/39
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
  }

  else if ((match = /^\/jurisprudence\/(([A-Z]+).+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/jurisprudence/CONSTEXT000031256027
    //https://www.lextenso.fr/jurisprudence/CAPARIS-18042013-10_21459
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
  }

  else if ((match = /^\/[a-z-]+\/(([A-Z]+).+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/lessentiel-droit-des-contrats/EDCO-116023-11602
    //https://www.lextenso.fr/petites-affiches/PA199902103
    //https://www.lextenso.fr/petites-affiches/PA201602202
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
  }

  return result;
});
