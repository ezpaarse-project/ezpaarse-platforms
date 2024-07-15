#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chilton
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search\/[a-zA-Z0-9]+$/i.test(path)) {
    // https://app.chiltonlibrary.com/search/bulletins
    // https://app.chiltonlibrary.com/search/repair
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/TSBs\/GM\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://appcontent.chiltonlibrary.com/TSBs/GM/6523447.pdf
    // https://appcontent.chiltonlibrary.com/TSBs/GM/6520490.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/Videos_Animations\/VideoLibrary\/([0-9]+)\/([a-zA-Z0-9\s%]+)\.mp4$/i.exec(path)) !== null) {
    // https://appcontent.chiltonlibrary.com/Videos_Animations/VideoLibrary/05/Installation of the brakes.mp4
    // https://appcontent.chiltonlibrary.com/Videos_Animations/VideoLibrary/09/Sensor inputs help the PCM establish the engine operating conditions.mp4
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    let decoded_title = decodeURI(match[2]);
    result.title_id = decoded_title;
    result.unitid = `${match[1]}/${decoded_title}`;
  } else if ((match = /^\/testprepquiz\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://app.chiltonlibrary.com/testprepquiz/a1
    // https://app.chiltonlibrary.com/testprepquiz/a10
    result.rtype    = 'EXERCISE';
    result.mime     = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
