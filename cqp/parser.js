#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CQ Press Library
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

  if ((/^\/scc\/document\.php$/i.test(path))) {
    // http://library.cqpress.com:80/scc/document.php?id=hsdc96-0000035287
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.id;
    result.unitid = param.id;
  } else if ((/^\/pia\/document\.php$/i.test(path))) {
    // http://library.cqpress.com:80/pia/document.php?id=CQs_Politics_in_America_2016_OE/2_PIA_2016_Intro_Preface_01.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.id;
    result.unitid   = param.id;
  } else if ((/^\/(.+)\/file\.php$/i.test(path))) {
    // http://library.cqpress.com:80/cqalmanac/file.php?path=Floor%20Votes%20Tables/cqal60_1960_House_Floor_Votes_34-37.pdf
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'PDF';
    result.title_id = param.path;
    result.unitid   = param.path;
  } else if ((/^\/(.+)\/static\.php$/i.test(path))) {
    // http://library.cqpress.com:80/congress/static.php?page=interestgroups
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.title_id = param.page;
    result.unitid   = param.page;
  } else if ((/^\/cqresearcher\/search\.php$/i.test(path))) {
    // http://library.cqpress.com:80/cqresearcher/search.php?fulltext=trump&action=newsearch&sort=custom%3Asorthitsrank%2Cd&x=0&y=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((/^\/([a-z]+)\/toc\.php$/i.test(path))) {
    // http://library.cqpress.com:80/cqpac/toc.php?parent_id=E8738544-11C4-4C82-AFEE-687E2760CE94
    // http://library.cqpress.com:80/cqresearcher/toc.php?mode=cqres-topic&level=3&values=Social+Movements%7ECivil+Rights+Movement
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    let item = '';
    if (param.parent_id) {
      item = param.parent_id;
    } else {
      item = param.values;
    }
    result.title_id = item;
    result.unitid   = item;

  } else if ((/^\/cqpac\/imagelib\.php$/i.test(path))) {
    // http://library.cqpress.com:80/cqpac/imagelib.php?imageid=130&topicid=19
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = param.imageid;
    result.unitid   = param.imageid;
  }

  return result;
});
