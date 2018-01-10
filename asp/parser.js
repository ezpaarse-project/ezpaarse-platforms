#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Alexander Street Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search$/i.test(path)) {
    // https://search.alexanderstreet.com:443/search?searchstring=barth
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/view\/work\/bibliographic_entity%7C(([a-z_]*)%7C([0-9]*))$/i.exec(path)) !== null) {
    // https://search.alexanderstreet.com:443/view/work/bibliographic_entity%7Cvideo_work%7C1790283
    // https://search.alexanderstreet.com:443/view/work/bibliographic_entity%7Crecorded_track%7C367256
    if (match[2] === 'recorded_track') {
      result.rtype  = 'AUDIO';
    } else if (match[2] === 'video_work') {
      result.rtype    = 'VIDEO';
    }
    result.mime     = 'MISC';
    result.unitid   = match[3];
  } else if (/\/volumes_toc.pl$/i.test(path)) {
    // https://dkbl.alexanderstreet.com:443/cgi-bin/asp/philo/dkbl/volumes_toc.pl?&church=ON
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/\/works_toc.pl$/i.test(path)) {
    // https://dkbl.alexanderstreet.com:443/cgi-bin/asp/philo/dkbl/works_toc.pl?&volumeID=CD0101&church=ON
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.volumeID;
  } else if (/\/search3t$/i.test(path)) {
    // https://dkbl.alexanderstreet.com:443/cgi-bin/asp/philo/dkbl/search3t?word=catholic&CONJUNCT=PHRASE&DISTANCE=3&dbname=barth&CONJUNCT=PHRASE&DISTANCE=2&PROXY=or+fewer&OUTPUT=conc&philodocid=828%3A1.barth&sortorder=&verbose=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /\/details_toc.pl$/i.exec(path)) !== null) {
    // https://dkbl.alexanderstreet.com:443/cgi-bin/asp/philo/dkbl/details_toc.pl?&philodocid=4563&showfullrecord=ON&kirch=ON
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = param.philodocid;
  } else if (/\/getvolume.pl$/i.test(path)) {
    // https://bltc.alexanderstreet.com:443/cgi-bin/asp/philo/bltc/getvolume.pl?S7673
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    for (var i in param) {
      result.unitid   = i;
    }
  } else if (/\/getdoc.pl$/i.test(path)) {
    // https://cwld.alexanderstreet.com:443/cgi-bin/asp/philo/cwld/getdoc.pl?S109-D112
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    for (var i in param) {
      result.unitid = i;
    }
  } else if (/\/sourceidx.pl$/i.test(path)) {
    // https://cwld.alexanderstreet.com:443/cgi-bin/asp/philo/cwld/sourceidx.pl?sourceid=S109&showfullrecord=ON
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = param.sourceid;
  } else if ((match = /^\/bios\/(.*).html$/i.exec(path)) !== null) {
    // https://cwld.alexanderstreet.com:443/bios/A3BIO.html
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
