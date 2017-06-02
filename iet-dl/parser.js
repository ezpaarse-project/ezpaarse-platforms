#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IET Digital Library
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
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/deliver\/fulltext\/conference\/(([0-9a-zA-Z]+)\/([0-9a-zA-Z]+).pdf)$/.exec(path)) !== null) {
  	//http://digital-library.theiet.org/deliver/fulltext/conference/ibc2015/20150030.pdf?itemId=/content/conferences/10.1049/ibc.2015.0030&mimeType=pdf&isFastTrackArticle=
  	result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[3];
    
    var matchDoi = /^\/content\/conferences\/([0-9a-zA-Z./]+)$/.exec(param.itemId);
    if (matchDoi) {
    	result.doi   = matchDoi[1];
    }
    
	} else if ((match = /^\/deliver\/fulltext\/books\/(([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+).pdf)$/.exec(path)) !== null) {
		//http://digital-library.theiet.org/deliver/fulltext/books/se/perics1e/PERICS1E.pdf?itemId=/content/books/se/perics1e&mimeType=pdf&isFastTrackArticle=
		result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = match[4];       
    result.title_id = match[4];
  
  } else if ((match = /^\/deliver\/fulltext\/(([0-9a-zA-Z.]+)\/([0-9a-zA-Z.]+)\/([0-9a-zA-Z.]+).pdf)$/.exec(path)) !== null) {
    //http://digital-library.theiet.org/deliver/fulltext/10.1049/etr.2013.9002/ETR.2013.9002.pdf?itemId=/content/reference/10.1049/etr.2013.9002&mimeType=pdf&isFastTrackArticle=
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[4];
    
    var matchDoi = /^\/content\/reference\/([0-9a-zA-Z./]+)$/.exec(param.itemId);
    if (matchDoi) {
    	result.doi   = matchDoi[1];
    }
    
  } else if ((match = /^\/deliver\/fulltext\/(([a-zA-Z]+)\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+).pdf)$/.exec(path)) !== null) {
    //http://digital-library.theiet.org/deliver/fulltext/et/9/1/20140116.pdf?itemId=/content/journals/10.1049/et.2014.0116&mimeType=pdf&isFastTrackArticle=
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[5];
    
    var matchDoi = /^\/content\/journals\/([0-9a-zA-Z./]+)$/.exec(param.itemId);
    if (matchDoi) {
    	result.doi   = matchDoi[1];
    }
        
	} else if ((match = /^\/content\/books\/([a-zA-Z]+)\/([a-zA-Z0-9]+)$/.exec(path)) !== null) {
  	//http://digital-library.theiet.org/content/books/cs/pbcs026e
  	//http://digital-library.theiet.org/content/books/se/perics1e
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[2];
       
    result.title_id   = match[2];
    
  } else if ((match = /^\/content\/(journals|conferences|reference)\/(.+)$/.exec(path)) !== null) {
  	//http://digital-library.theiet.org/content/journals/10.1049/et.2014.0116
  	//http://digital-library.theiet.org/content/conferences/10.1049/ibc.2015.0030
  	//http://digital-library.theiet.org/content/reference/10.1049/etr.2013.9002
		//http://digital-library.theiet.org/content/journals/10.1049/iet-pel.2013.0030
  	result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi   = match[2];
    result.title_id   = match[2];    
    var titleID = /\/([0-9a-zA-Z-?]+)/.exec(match[2]);
    if (titleID) {
    	result.title_id   = titleID[1];
    }
    
  }

  return result;
});

