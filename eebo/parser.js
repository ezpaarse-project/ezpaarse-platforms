#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Early English Books Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/downloadpdf$/.exec(path)) !== null) {
    // https://eebo-chadwyck-com.bibliopam-evry.univ-evry.fr/downloadpdf?id=12330237&vid=59632&filename=A_M_Gent-
    //A_most_choice_historical_compendium-Wing-
    ///M3-640_03&pages=1&rectype=MONOGRAPH&database=Early%20English%20Books%201641-1700&pubyear=0
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = param.id;
    result.unitid   = param.id;
  } else if ((match = /^\/downloadtiff$/.exec(path)) !== null) {
    // https://eebo-chadwyck-com.bibliopam-evry.univ-evry.fr/downloadtiff?vid=59632&eeboid=12330237&filename=A_M_Gent
    //-A_most_choice_historical_compendium-Wing-
    //M3-640_03&page=1&database=Early%20English%20Books%201641-1700&rectype=MONOGRAPH&pubyear=0
    result.rtype    = 'BOOK';
    result.mime     = 'MISC';
    result.title_id = param.eeboid;
    result.unitid   = param.eeboid;
  } else if ((match = /^\/search\/toc$/.exec(path)) !== null) {
    //https://eebo-chadwyck-com.bibliopam-evry.univ-evry.fr/search/toc?ACTION=ExpandID&LEVEL=1&
    //ID=D00000123302370000&FILE=../session/1446462957_4884&SEARCHSCREEN=CITATIONS&
    //DISPLAY=AUTHOR&RESULTCLICK=default&SOURCE=var_spell.cfg
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.ID.substr(6,8);
    result.unitid   = param.ID;
  } else if ((match = /^\/search\/([^.]+)$/.exec(path)) !== null) {
    //https://eebo-chadwyck-com.bibliopam-evry.univ-evry.fr/search/full_rec?SOURCE=pgthumbs.
    //cfg&ACTION=ByID&ID=12330237&FILE=../session/1446462957_4884&SEARCHSCREEN=CITATIONS&SEARCHCONFIG=var_spell.
    //cfg&DISPLAY=AUTHOR


    //https://eebo-chadwyck-com.bibliopam-evry.univ-evry.fr/search/full_rec?SOURCE=pgimages.
    //cfg&ACTION=ByID&ID=12330237&FILE=../
    //session/1446462957_4884&SEARCHSCREEN=CITATIONS&VID=59632&PAGENO=1&ZOOM=&VIEWPORT=&SEARCHCONFIG=var_spell.
    //cfg&DISPLAY=AUTHOR&HIGHLIGHT_KEYWORD=
    result.title_id = param.ID;
 
    result.unitid   = param.ID;
    if (param.SOURCE && param.SOURCE === 'pgthumbs.cfg') {
      result.rtype    = 'BOOK';
    } else if (param.SOURCE === 'pgimages.cfg' ) {
      result.rtype    = 'PREVIEW';
    } else if (param.source === 'configpr.cfg' ) {
      result.rtype    = 'BOOK';
      result.title_id = param.ID.substr(6,8);
    } else if (param.SOURCE === 'var_spell.cfg' ) {
      result.rtype    = 'ABS';
    }
    result.mime     = 'HTML';
    
  }

  return result;
});

