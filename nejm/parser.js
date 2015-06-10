#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme NEJM - New England Journal of Medicine
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
  var matchparam;
  if ((match = /^\/toc\/([a-z]+)\/(([a-z]+)-([a-z]+))$/.exec(path)) !== null) {
    // http://www.nejm.org.ezproxy.unilim.fr/toc/nejm/medical-journal
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = "toc/" + match[1] + "/" + match[2];
  } else if ((match = /^\/doi\/([a-z]+)\/(([0-9]+).([0-9]+))\/(([A-Z]+)([a-z]+)([0-9]+))$/.exec(path)) !== null) {
    // http://www.nejm.org.ezproxy.unilim.fr/doi/full/10.1056/NEJMp1501140
    //http://www.nejm.org.ezproxy.unilim.fr/doi/pdf/10.1056/NEJMra1403672
    result.title_id = match[2] + "/" + match[5];
    result.unitid   = match[2] + "/" + match[5];
    result.rtype    = 'ARTICLE';

    if (match[1] === 'pdf') {
      result.mime = 'PDF';
    } else if (match[1] === 'ref') {
      result.mime     = 'HTML';
      result.rtype    = 'REF';
      result.title_id = "ref/" + match[2]  + "/" + match[5];
      result.unitid   = result.title_id;
    } else {
        if (match[7] === "vcm") { 
          result.mime  = 'MISC';
          result.rtype = 'VIDEO';
        } else if (match[7] === "icm") { 
          result.mime  = 'MISC';
          result.rtype = 'IMAGE';
        } else {
          result.mime = 'HTML';
        }
    }

  } else if ((match = /^\/action\/(([A-Za-z]+))$/.exec(path)) !== null) {
    // http://www.nejm.org.ezproxy.unilim.fr/action/showIssueAudio?a=nejm_2015.372.issue-23.summary.mp3
    
    result.mime = 'MISC';

    if ((matchparam = /nejm_([0-9]+).([0-9]+).([a-z]+)-([0-9]+).([a-z]+).mp3$/.exec(param.a)) !== null) {
      result.rtype    = 'TOC';
      result.title_id = "nejm_" + matchparam[1]+ "." +matchparam[2] + "." + matchparam[3]  + "-" + matchparam[4] ;
      result.unitid   = "nejm_"+ matchparam[1]+ "." +matchparam[2] + "." + matchparam[3]  + "-" + matchparam[4] + "." + matchparam[5];
     } else if (param.doi) {
      result.title_id = param.doi;
      result.unitid   =  param.doi;
     }

  } else if ((match = /^\/doi\/([a-z]+)\/(([0-9]+).([0-9]+))\/(([a-z]+)_([0-9]+).([0-9]+).([a-z]+)-([0-9]+))$/.exec(path)) !== null) {
    // http://www.nejm.org.ezproxy.unilim.fr/doi/audio/10.1056/nejm_2015.372.issue-23
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[2] + "/" + match[5];
    result.unitid   =  match[2] + "/" + match[5];
  } else if ((match = /^\/doi\/([a-z]+)\/(([0-9]+).([0-9]+))\/(([A-Z]+)([a-z]+)([0-9]+))\/([a-z_]+)\/(([a-z0-9]+)_([a-z]+)).pdf$/.exec(path)) !== null) {
    // http://www.nejm.org.ezproxy.unilim.fr/doi/suppl/10.1056/NEJMoa1410489/suppl_file/nejmoa1410489_appendix.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[10];
    result.unitid   = match[5];
  }

  return result;
});

