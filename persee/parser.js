#!/usr/bin/env node

// ##EZPAARSE
/*jslint maxlen: 150*/

/**
 * parser for persée platform
 * http://analogist.couperin.org/platforms/persee/
 */
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var match;

  if ((match = /^\/web\/revues\/home\/prescript\/issue\/(([a-z]+)_([0-9]{4}-[0-9]{3}[0-9xX]{1})_[0-9]{4}_.*)\/?$/.exec(path)) !== null) {
    // web/revues/home/prescript/issue/cmr_0008-0160_1975_num_16_2
    result.title_id = match[2];
    result.unitid = match[1];
//    result.online_identifier = match[3];
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.print_identifier = match[3];
  } else if ((match = /^\/web\/revues\/home\/prescript\/article\/(([a-z]+)_([0-9]{4}-[0-9]{3}[0-9xX]{1})_[0-9]{4}_.*)\/?$/.exec(path)) !== null) {
    // /web/revues/home/prescript/article/cmr_0008-0160_1975_num_16_2_1236
    result.unitid = match[1];
    result.title_id = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'MISC';
    result.print_identifier = match[3];
  } else if ((match = /^\/articleAsPDF\/(([a-z]+)_([0-9]{4}-[0-9]{3}[0-9xX]{1})_[0-9]{4}_.*)\/article_.*\.pdf/.exec(path)) !== null) {
    // /articleAsPDF/cmr_0008-0160_1975_num_16_2_1236/article_cmr_0008-0160_1975_num_16_2_1236.pdf
    // /articleAsPDF/cmr_0008-0160_1975_num_16_2_1236/article_cmr_0008-0160_1975_num_16_2_1236.pdf?mode=light
    result.unitid = match[1];
    result.title_id = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.print_identifier = match[3];
  } else if ((match = /^\/doc\/(([a-z]+)_([0-9]{4}-[0-9]{3}[0-9xX]{1})_[0-9]{4}_.*)/.exec(path)) !== null) {
      // http://www.persee.fr/doc/xxs_0294-1759_1994_num_41_1_3263
      //http://www.persee.fr/doc/abpo_0003-391x_1905_num_21_2_1218
    result.unitid = match[1];
    result.title_id = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'MISC';
    result.print_identifier = match[3];
  } else if ((match = /^\/docAsPDF\/(([a-z]+)_([0-9]{4}-[0-9]{3}[0-9xX]{1})_[0-9]{4}_.*)\.pdf/.exec(path)) !== null) {
    // /docAsPDF/abpo_0003-391x_1905_num_21_2_1218.pdf
    result.unitid = match[1];
    result.title_id = match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.print_identifier = match[3];
  }
  return result;
});
