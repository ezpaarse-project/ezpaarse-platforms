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
  let hostname = parsedUrl.hostname;

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/\/search$/i.test(path)) {
    // https://search.alexanderstreet.com:443/search?searchstring=barth
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/avon\/browse/i.test(path)) {
    // https://search.alexanderstreet.com:443/avon/browse/discipline
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
    for (var x in param) {
      result.unitid   = x;
    }
  } else if (/\/getdoc.pl$/i.test(path)) {
    // https://cwld.alexanderstreet.com:443/cgi-bin/asp/philo/cwld/getdoc.pl?S109-D112
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    for (var y in param) {
      result.unitid = y;
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
  } else if ((match = /^\/([a-z]*)\/view\/(.*)$/.exec(path)) !== null) {
    // http://lit.alexanderstreet.com:80/lali/view/1000029515
    // http://lit.alexanderstreet.com:80/blfi/view/1000067868
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    if (match[1] === 'lali') {
      result.publication_title = 'Latino Literature';
    } else if (match[1] === 'blfi') {
      result.publication_title = 'Black Short Fiction and Folklore';
    } else if (match[1] === 'blww') {
      result.publication_title = 'Black Women Writers';
    } else if (match[1] === 'cali') {
      result.publication_title = 'Caribbean Literature';
    } else if (match[1] === 'iwrp') {
      result.publication_title = 'Irish Women Poets of the Romantic Period';
    } else if (match[1] === 'laww') {
      result.publication_title = 'Latin American Women Writers';
    } else if (match[1] === 'swrp') {
      result.publication_title = 'Scottish Women Poets of the Romantic Period';
    } else if (match[1] === 'sali') {
      result.publication_title = 'South and Southeast Asian Literature';
    }
  }

  if (hostname === 'aadr.alexanderstreet.com') {
    result.publication_title = 'Asian American Drama';
  } else if (hostname === 'aamr.alexanderstreet.com') {
    result.publication_title = 'African American Music Reference';
  } else if (hostname === 'afso.alexanderstreet.com') {
    result.publication_title = 'American Film Scripts';
  } else if (hostname === 'area.alexanderstreet.com') {
    result.publication_title = 'Area Studies Video Online';
  } else if (hostname === 'bld2.alexanderstreet.com') {
    result.publication_title = 'Black Drama Second Edition';
  } else if (hostname === 'bldr.alexanderstreet.com') {
    result.publication_title = 'Black Drama';
  } else if (hostname === 'bltc.alexanderstreet.com') {
    result.publication_title = 'Black Thought and Culture';
  } else if (hostname === 'bwl2.alexanderstreet.com') {
    result.publication_title = 'British and Irish Women\'s Letters and Diaries';
  } else if (hostname === 'bwld.alexanderstreet.com') {
    result.publication_title = 'British and Irish Women\'s Letters and Diaries';
  } else if (hostname === 'comx.alexanderstreet.com') {
    result.publication_title = 'Underground and Independent Comics';
  } else if (hostname === 'cwld.alexanderstreet.com') {
    result.publication_title = 'The American Civil War: Letters and Diaries';
  } else if (hostname === 'divo.alexanderstreet.com') {
    result.publication_title = 'Ethnic Studies Video Online';
  } else if (hostname === 'dkbl.alexanderstreet.com') {
    result.publication_title = 'The Digital Karl Barth Library';
  } else if (hostname === 'dlcr.alexanderstreet.com') {
    result.publication_title = 'The Digital Library of the Catholic Reformation';
  } else if (hostname === 'eena.alexanderstreet.com') {
    result.publication_title = 'Early Encounters in North America';
  } else if (hostname === 'eenz.alexanderstreet.com') {
    result.publication_title = 'Early Experiences in Australasia';
  } else if (hostname === 'imld.alexanderstreet.com') {
    result.publication_title = 'North American Inmmigrant Letters, Diaries, and Oral Histories';
  } else if (hostname === 'indr.alexanderstreet.com') {
    result.publication_title = 'North American Indian Drama';
  } else if (hostname === 'lrho.alexanderstreet.com') {
    result.publication_title = 'Images of America';
  } else if (hostname === 'nadr.alexanderstreet.com') {
    result.publication_title = 'Twentieth Century North American Drama';
  } else if (hostname === 'nwld.alexanderstreet.com') {
    result.publication_title = 'North American Women\'s Letters and Diaries';
  } else if (hostname === 'rom2.alexanderstreet.com') {
    result.publication_title = 'Romanticism Redefined';
  } else if (hostname === 'soth.alexanderstreet.com') {
    result.publication_title = 'Social Theory';
  } else if (hostname === 'tcpt.alexanderstreet.com') {
    result.publication_title = 'The Digital Library of Classical Protestant Texts';
  } else if (hostname === 'tcr1.alexanderstreet.com') {
    result.publication_title = 'Twentieth Century Religious Thought: Volume I, Christianity';
  } else if (hostname === 'tcrb.alexanderstreet.com') {
    result.publication_title = 'Tentieth Century Religious Thought Library';
  } else if (hostname === 'wodr.alexanderstreet.com') {
    result.publication_title = 'North American Women\'s Drama';
  }

  return result;
});
