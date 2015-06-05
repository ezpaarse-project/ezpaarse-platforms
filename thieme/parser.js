#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme maitron
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
 
  // use console.error for debuging

  var match;

  

  if ((match = /^\/products\/([a-z]+)\/([a-z]+)\/([0-9]{2}.[0-9]+)\/(([a-z]{1})-([0-9]+)-([0-9]+))$/.exec(path)) !== null) {
   // https://www.thieme-connect.com/products/ejournals/html/10.1055/s-0033-1357180
    
	if (match[2]==="html") {result.mime     = 'HTML'; 
	result.rtype = 'ARTICLE';}
	else {result.mime = 'MISC';
	result.rtype = 'TOC';}
	
	result.unitid   = match[3] + "/" + match[4];
 
    result.title_id = match[3] + "/" + match[4];   
   
    
  } else if((match = /^\/products\/([a-z]+)\/([a-z]+)\/([0-9]{2}.[0-9]+)\/(([a-z]{1})-([0-9]+)-([0-9]+)).pdf$/.exec(path)) !== null) {
   // https://www.thieme-connect.de/products/ejournals/pdf/10.1055/s-0034-1369742.pdf
    result.unitid   = match[3] + "/" + match[4];
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[3] + "/" + match[4];   
       
  } 

  return result;
});

