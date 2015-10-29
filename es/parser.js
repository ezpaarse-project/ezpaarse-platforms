#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme endocrine society
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/journal\/([a-z]+)$/.exec(path)) !== null) {
   // http://press.endocrine.org/journal/jcem
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else   if ((match = /^\/toc\/([a-z]+)\/([a-z]+)$/.exec(path)) !== null) {
   // http://press.endocrine.org/toc/jcem/current
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] +'/'+ match[2];
  }else   if ((match = /^\/toc\/([a-z]+)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    //http://press.endocrine.org/toc/jcem/99/12
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] +'/'+ match[2]+'/'+ match[3];
    result.vol = match[2];
    result.issue =  match[3];
  }else   if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}).([0-9]+)\/([a-z]+).([0-9]+)(-)([0-9]+)$/.exec(path)) !== null) {
    //http://press.endocrine.org/doi/abs/10.1210/jc.2014-3282
     result.doi = match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];
    
    ///result.unitid   =match[1] +'/'+ match[2]+'/'+ match[3];
    switch (match[1]) {
    case 'abs':
        // http://press.endocrine.org/doi/abs/10.1210/jc.2014-3282
       result.rtype    = 'ABS';
       result.mime     = 'MISC';
       result.unitid   = match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];
      break;
    case 'full':
      //http://press.endocrine.org/doi/full/10.1210/jc.2014-3282
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = match[1] +'/'+ match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];
      break;
    
    case 'pdf':
      // http://press.endocrine.org/doi/pdf/10.1210/jc.2014-4153
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      result.unitid   = match[1] +'/'+ match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];

      break;
    case 'figure':
      // http://press.endocrine.org/doi/figure/10.1210/jc.2014-3282

      result.mime = 'MISC';
      result.unitid  = match[1] +'/'+ match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];
      break;
    case 'suppl':
      // http://press.endocrine.org/doi/suppl/10.1210/jc.2014-3282

      result.unitid  = match[1] +'/'+ match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];
      break;
    case 'citedby':
      // http://press.endocrine.org/doi/citedby/10.1210/jc.2014-3282
      result.rtype = 'REF';
      result.mime = 'MISC';
      result.unitid  = match[1] +'/'+ match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'-'+ match[7];
      break;
    }

    result.title_id = match[4];
   }else   if ((match = /^\/doi\/([0-9]{2}).([0-9]+)\/([A-Z1-9]+).([0-9]+)$/.exec(path)) !== null) {
    //http://press.endocrine.org/doi/10.1210/MN1.9781936704842
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[4];
    result.unitid  = match[1]+'.'+ match[2] +'/'+ match[3]+'.'+ match[4];
    result.doi =  match[1]+'.'+ match[2] +'/'+ match[3]+'.'+ match[4];
  }else   if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}).([0-9]+)\/([A-Z1-9]+).([0-9]+).([a-z0-9]+)$/.exec(path)) !== null) {
    
    switch (match[1]) {
      case 'abs':
          // http://press.endocrine.org/doi/abs/10.1210/MN1.9781936704842.ch4
         result.rtype    = 'ABS';
         result.mime     = 'MISC';
        break;
      case 'full':
        //http://press.endocrine.org/doi/full/10.1210/MN1.9781936704842.ch4
        result.rtype    = 'BOOK_SECTION';
        result.mime     = 'MISC';
        break;
    }
    result.title_id = match[5];
      result.unitid  = match[1] +'/'+ match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'.'+ match[6];
        result.doi = match[2]+'.'+ match[3] +'/'+ match[4]+'.'+ match[5]+'.'+ match[6];
  }


  return result;
});

