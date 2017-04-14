#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Acland's Video Atlas of Human Anatomy
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path = parsedUrl.pathname;
    // uncomment this line if you need parameters
  var param = parsedUrl.query || {};

    // use console.error for debuging
    // console.error(parsedUrl);

  if ((/^\/MultimediaPlayer\.aspx$/.exec(path)) !== null) {
        // http://aclandanatomy.com/MultimediaPlayer.aspx?multimediaId=10528543
    result.rtype = 'VIDEO';
    result.mime = 'HTML';
        //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
        //it described the most fine-grained of what's being accessed by the user
        //it can be a DOI, an internal identifier or a part of the accessed URL
        //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid = param.multimediaId;
  } else if ((/^\/Multimedia\.aspx$/.exec(path)) !== null) {
        // http://aclandanatomy.com/Multimedia.aspx?categoryid=39464
    result.rtype = 'TOC';
    result.mime = 'HTML';

        //see the comment block above
    result.unitid = param.categoryid;
  } else if ((/^\/atozresults\.aspx$/.exec(path)) !== null) {
        // http://aclandanatomy.com/atozresults.aspx?resourceindex=16&displayname=abdominal+arteries
    result.rtype = 'TOC';
    result.mime = 'HTML';

        //see the comment block above
    result.unitid = param.resourceindex;
    result.title_id = param.displayname;
  }
  return result;
});

