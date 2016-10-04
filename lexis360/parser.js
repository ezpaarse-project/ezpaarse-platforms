#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lexis 360
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
  //console.error(parsedUrl);
  //console.error(param.citationData);


  var match;

  if ((match = /^\/Docview.aspx$/.exec(path)) !== null) {
    // http://www.lexis360.fr:80/Docview.aspx?&tsid=docview4_&citationData={%22citationId%22:%22PS_SJG_201639SOMMAIREPS_2_0KTZS19%22,%22title%22:%221012%22,%22docId%22:%22PS_SJG_201639SOMMAIREPS_2_0KTZ%22}
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    var u = JSON.parse(param.citationData);
    //console.log(u);
    result.unitid   = u.citationId;
    var match1;
    if (u.citationId && (match1 = /^PS_([A-Z]+)_[0-9]{4}[0-9]+/.exec(u.citationId)) !== null) {
      result.title_id = match1[1];
    }
      // PS_SJG_201639SOMMAIREPS_2_0KTZS19
      // console.error(match[1]);
  
    
    var v = JSON.parse(param.citationData);
    //console.log(v);
    var match2;
    result.publication_date = v.citationId;
    if (v.citationId && (match2 = /^PS_[A-Z]+_([0-9]{4})[0-9]+/.exec(v.citationId)) !== null) {
      // PS_SJG_201639SOMMAIREPS_2_0KTZS19
      // console.error(match[1]);
      result.publication_date = match2[1];

    }
  }

  return result;
});

