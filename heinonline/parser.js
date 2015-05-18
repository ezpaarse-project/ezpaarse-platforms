#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme HeinOnline
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

  if ((match = /^\/HOL\/(P[^]*)/.exec(path)) !== null) {
    // http://heinonline.org.faraway.u-paris10.fr/HOL/Page?handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=1&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=2&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=3&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=4&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=5&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=6&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/PageMulti?collection=journals&number_of_pages=7&handle=hein.journals/antil77&id=53
    //http://heinonline.org.faraway.u-paris10.fr/HOL/Print?collection=journals&handle=hein.journals/antil77&id=53
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if(param.handle){
      result.title_id = param.handle.split('/')[1];
      result.unitid = param.handle +"/"+param.id ;
      if(param.number_of_pages){
        result.unitid += "/"+ param.number_of_pages;
      }
    }
  } else if((match =/^\/HOL\/Index/.exec(path))!== null) {
    //http://heinonline.org.faraway.u-paris10.fr/HOL/Index?index=journals/antil&collection=usjournals
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if(param.index){
      result.title_id = param.index.split('/')[1];
      result.unitid = param.index ;
    }
  }else if ((match =/^\/HOL\/.*/.exec(path))!== null) {
    //http://heinonline.org.faraway.u-paris10.fr/HOL/Contents?handle=hein.journals/antil77&id=1&size=2&index=&collection=journals
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if(param.handle){
      result.title_id = param.handle.split('/')[1];
      result.unitid = param.handle +"/"+param.id ;
      if(param.number_of_pages){
        result.unitid += "/"+ param.number_of_pages;
      }
    }
  }

  return result;
});

