#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Anatomy TV
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let hash = (parsedUrl.hash || '').replace('#', '');
  let match;

  if (/^\/search$/i.test(path)) {
    // https://www.anatomy.tv/search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/anatomytv\/html5ui_2018\/$/i.test(path)) {
    result.mime = 'HTML';

    if ((match = /^\/product\/har_hand_2014\/type\/Views\/id\/([0-9]+)\/layer\/([0-9]+)\/angle\/([0-9]+)\/structureID\/([0-9]+)$/i.exec(hash)) !== null) {
      // https://www.anatomy.tv/anatomytv/html5ui_2018/#/product/har_hand_2014/type/Views/id/39255/layer/0/angle/0/structureID/275504
      result.rtype  = 'FIGURE';
      result.unitid = match[1];
    } else if ((match = /^\/product\/har_hand_2014\/type\/MRI%20Views\/id\/([0-9]+)\/layer\/([0-9]+)\/angle\/([0-9]+)\/structureID\/([0-9]+)$/i.exec(hash)) !== null) {
      // https://www.anatomy.tv/anatomytv/html5ui_2018/#/product/har_hand_2014/type/MRI Views/id/39296/layer/0/angle/0/structureID/263184
      result.rtype  = 'IMAGE';
      result.unitid = match[1];
    } else if ((match = /^\/product\/har_hand_2014\/type\/Slides\/id\/([0-9]+)\/structureID\/-([0-9]+)$/i.exec(hash)) !== null) {
      // https://www.anatomy.tv/anatomytv/html5ui_2018/#/product/har_hand_2014/type/Slides/id/7888532/structureID/-1
      result.rtype  = 'SUPPL';
      result.unitid = match[1];
    } else if ((match = /^\/product\/har_hand_2014\/type\/Movies\/id\/([0-9]+)$/i.exec(hash)) !== null) {
      // https://www.anatomy.tv/anatomytv/html5ui_2018/#/product/har_hand_2014/type/Movies/id/7888394
      result.rtype  = 'VIDEO';
      result.unitid = match[1];
    } else if ((match = /^\/product\/har_hand_2014\/type\/Text%20articles\/id\/([0-9]+)\/layer\/([0-9]+)\/angle\/([0-9]+)\/structureID\/([0-9]+)$/i.exec(hash)) !== null) {
      // https://www.anatomy.tv/anatomytv/html5ui_2018/#/product/har_hand_2014/type/Text articles/id/39256/layer/3/angle/8/structureID/1835224
      result.rtype  = 'ARTICLE';
      result.unitid = match[1];
    }
  }

  return result;
});
