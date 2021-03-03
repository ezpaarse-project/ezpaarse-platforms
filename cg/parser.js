#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CultureGrams
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
  if (/^\/world\/world_([a-z]+)\.php$/i.test(path)) {
    // http://online.culturegrams.com/world/world_region.php?contid=13&wmn=Antarctica
    // http://online.culturegrams.com/world/world_regintro.php?contid=13&wmn=Antarctica
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
  } else if (/^\/main\/search\.php$/i.test(path)) {
    // http://online.culturegrams.com/main/search.php?keywords=Titanium&search_type=w
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/viewfile\.php$/i.test(path) && /^\/(.+)\/(.+)\.jpg$/i.test(param.file)) {
    // http://online.culturegrams.com/viewfile.php?file=/gallery_images/1208301850.jpg
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
  } else if (/^\/downloadFile\.php$/i.test(path) && /^\/([a-z_]+)\/([a-z]+)\/([a-z]+)\/([1-9]+)\/([a-z]+)\.mp4$/i.test(param.file)) {
    // http://online.culturegrams.com/downloadFile.php?file=/axiom_content/multimedia/videos/9/USACentralPark.mp4
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
  } else if (/^\/recipes\/list\.php$/i.test(path)) {
    // http://online.culturegrams.com/recipes/list.php?type=World&id=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  } else if (/^\/world\/country_data\.php$/i.test(path)) {
    // http://online.culturegrams.com/world/country_data.php?selected_data_table_category_id=14
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';
  }

  return result;
});
