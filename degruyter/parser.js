#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme De Gruyter
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
  var info;

  if ((match = /^\/view\/([a-z]+)\/(([a-z]+)\.([0-9]+)\.([0-9]+)\.([a-z]+)\-([0-9]+))\/([a-z\-]+)\/([^]*).xml$/.exec(path)) !== null) {
    // https://www-degruyter-com.bibliopam-evry.univ-evry.fr/view/j/jtms.2014.1.issue-2/issue-files/jtms.2014.1.
    //issue-2.xml
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[3];
     result.vol = match[5];
    result.issue= match[7];
    result.publication_date = match[4];
    result.unitid   = match[2];
  } else if ((match = /^\/view\/([a-z]+)\/(([a-z]+)\.([0-9]+)\.([0-9]+)\.([a-z]+)\-([0-9]+))\/([a-z0-9\-]+)\/([^]*).xml$/.exec(path)) !== null) {
    // https://www-degruyter-com.bibliopam-evry.univ-evry.fr/view/j/jtms.2014.1.issue-2/jtms-2014-0026/jtms-2014-0026
    //.xml?format=INT
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
    result.title_id = match[3];
    result.unitid   = match[8];
    result.vol = match[5];
    result.issue= match[7];
    result.publication_date = match[4];
    result.doi = '10.1515/' + match[8];
  } else if ((match = /^\/dg\/([^]*)\/([^]*).$/.exec(path)) !== null) {
    // https://www-degruyter-com.bibliopam-evry.univ-evry.fr/dg/viewarticle.
    //fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.200$002f9783110239423.200.
    //pdf?format=INT&t:ac=j$002fetly.2011.2011.issue-1$002f9783110239423.200$002f9783110239423.200.xml 



    ////$002fj$002fjtms.2015.2.issue-1$002fjtms-2015-frontmatter1$002fjtms-2015-frontmatter1.pdf
    info = match[2].split('.');
    result.publication_date = info[1];

    result.mime     = 'PDF';

    result.issue = info[3].split('$002f')[0].split('-')[1];
    result.title_id = info[4].split('$002f')[1];
    result.unitid   = info[4].split('$002f')[1] + '.' + info[4].split('$002f')[0]  ;
    if (match[1].split('.')[0] ===  "viewarticle") {
    result.rtype    = 'ARTICLE';
      if (info[4].split('$002f')[1] !== undefined ) {    
      result.unitid   = info[4].split('$002f')[1] + '.' + info[4].split('$002f')[0] + '.pdf' ;
      } else {
      result.title_id = info[3].split('$002f')[1].split('-')[0];
      result.unitid   = info[3].split('$002f')[2] + '.pdf' ;
      }
    } else {
       if (info[4].split('$002f')[1] !== undefined ) {
       
      result.unitid   = info[4].split('$002f')[1] + '.' + info[4].split('$002f')[0] ;
      } else {
      result.title_id = info[3].split('$002f')[1].split('-')[0];
      result.unitid   = info[3].split('$002f')[2] + '.pdf' ;
      }
    result.rtype = 'TOC';  
    }
    
  }

  return result;
});

