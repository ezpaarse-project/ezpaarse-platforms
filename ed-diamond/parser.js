#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Edition Diamond
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

  if ((match = /\/content\/search/i.exec(path)) !== null) {
    // https://connect.ed-diamond.com/content/search?SearchText=openvpn
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';


  } else if ((match = /\/GNU-Linux-Magazine\/GLMF-\d+$/i.exec(path)) !== null) {
    // https://connect.ed-diamond.com/GNU-Linux-Magazine/GLMF-218
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.print_identifier     = '1291-7834';
    result.publication_title    = 'GNU/Linux Magazine';

  } else if ((match = /\/GNU-Linux-Magazine\/GLMF-\d+\/(\S+)$/i.exec(path)) !== null) {
    // https://connect.ed-diamond.com/GNU-Linux-Magazine/GLMF-218/Gestion-de-conteneurs-en-Bash
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.print_identifier     = '1291-7834';
    result.publication_title    = 'GNU/Linux Magazine';


  } else if ((match = /\/Hackable\/HK-\d+$/i.exec(path)) !== null) {
    //
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.print_identifier     = '2427-4631';
    result.publication_title    = 'Hackable';

  } else if ((match = /\/Hackable\/HK-\d+\/(\S+)$/i.exec(path)) !== null) {
    //
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.print_identifier     = '2427-4631';
    result.publication_title    = 'Hackable';


  } else if ((match = /\/Linux-Pratique\/LP-\d+$/i.exec(path)) !== null) {
    //
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.print_identifier     = '0183-0872';
    result.publication_title    = 'Linux Pratique';

  } else if ((match = /\/Linux-Pratique\/LP-\d+\/(\S+)$/i.exec(path)) !== null) {
    // https://connect.ed-diamond.com/Linux-Pratique/LP-109/Combien-de-temps-passez-vous-sur-vos-taches
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.print_identifier     = '0183-0872';
    result.publication_title    = 'Linux Pratique';


  } else if ((match = /\/Linux-Essentiel\/LPE-\d+$/i.exec(path)) !== null) {
    //
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.print_identifier     = '1969-2463';
    result.publication_title    = 'Linux Essentiel';

  } else if ((match = /\/Linux-Essentiel\/LPE-\d+\/(\S+)$/i.exec(path)) !== null) {
    //
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.print_identifier     = '1969-2463';
    result.publication_title    = 'Linux Essentiel';


  } else if ((match = /\/Open-Silicium\/OS-\d+$/i.exec(path)) !== null) {
    //
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.print_identifier     = '2116-3324';
    result.publication_title    = 'Open Silicium';

  } else if ((match = /\/Open-Silicium\/OS-\d+\/(\S+)$/i.exec(path)) !== null) {
    //
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.print_identifier     = '2116-3324';
    result.publication_title    = 'Open Silicium';

  }

  return result;
});
