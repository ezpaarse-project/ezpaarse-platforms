#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme European Mathematical Society
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  var match;

  if (param.issn) {
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.print_identifier = result.title_id = result.unitid = param.issn;
    if (param.vol) {
      result.unitid += '_' + param.vol;
    }
    if (param.iss) {
      result.unitid += '_' + param.iss;
    }
  }

  if (/^\/journals\/(all_issues\.php)|(show_issue\.php)$/.test(path)) {
    // https://www-ems--ph-org.bibliopam-evry.univ-evry.fr/journals/all_issues.php?issn=1435-9855
    // https://www-ems--ph-org.bibliopam-evry.univ-evry.fr/journals/show_issue.php?issn=1435-9855&vol=16&iss=6
    result.rtype = 'TOC';
    result.mime  = 'HTML';
  } else if ((match = /^\/journals\/show_(abstract|pdf)\.php$/.exec(path)) !== null) {
    // https://www-ems--ph-org.bibliopam-evry.univ-evry.fr/journals/show_abstract.php?issn=1435-9855&vol=16&iss=6&rank=1

    switch (match[1]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  }
  return result;
});
