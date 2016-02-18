#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Artstor Digital Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
   //console.error(path);

  var match;

  if ((match = /^\/library\/([a-z0-9]+)\.html$/.exec(path)) !== null) {
    //http://library.artstor.org/library/iv2.html?parent=true

    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[1];
  } else if ((match = /^\/library\/([a-zA-Z]+)\.jsp/.exec(path)) !== null) {
    // http://library.artstor.org/library/printImage.jsp?imageurl=http%3A//imgserver.artstor.net/ucsd/d0554/41822000605996.fpx/2sT5h8273vyCDgz3zjXLWw/1418307806/%3Fcell%3D400%2C400%26rgnn%3D0%2C0%2C1%2C1%26cvt%3DJPEG
   //   console.error(match);
    result.rtype    = 'PRINT';
    result.mime     = 'HTML';
    var parametre =param.imageurl;
    var matchparam ;
    if ((matchparam  = /.*\/ucsd\/([a-z0-9]+)\/([0-9]+).([a-z]+)\/([a-zA-Z0-9]+)\/([0-9]+)\/.*/.exec(parametre)) !== null) {
   //imageurl=http%3A//imgserver.artstor.net/ucsd/d0554/41822000605996.fpx/2sT5h8273vyCDgz3zjXLWw/1418307806/%3Fcell%3D400%2C400%26rgnn%3D0%2C0%2C1%2C1%26cvt%3DJPEG
   //   console.error(match);
      result.title_id = matchparam[1];
      result.unitid   = matchparam[1];
    }

    //see the comment block above
    //result.unitid   = '';
  } else if ((match = /^\/library\/([A-Za-z]*)Print([A-Za-z]*)\.html$/.exec(path)) !== null)
  {
  //http://library.artstor.org/library/IGDescPrintTemplate.html
    result.rtype    = 'PRINT';
    result.mime     = 'HTML';
   // result.title_id = '';
    //see the comment block above
    result.unitid   = match[1]+ 'Print' + match[2];


  }  else if ((match = /^\/library\/([A-Za-z]+)\.html$/.exec(path)) !== null)
  {
    //http://library.artstor.org/library/CitationsWindow.html
    result.rtype    = 'CITATION';
    result.mime     = 'HTML';
    //result.title_id = '';
    //see the comment block above
    result.unitid   = match[1];


  }  else if ((match = /^\/library\/([a-z]+)\/([a-z]+)\/([0-9]+)$/.exec(path)) !== null)
  {
    //http://library.artstor.org/library/secure/ppreview/736355?name=Arena%20Chapel,%20Giotto%20di%20Bondone
    // lien de test modifier, on a remplacer la virgule avec un plus pour que le teste marche .La virgule entre dans la
    //catégorie  des caractères spéciaux qui bloque les test

    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }
  return result;
});
