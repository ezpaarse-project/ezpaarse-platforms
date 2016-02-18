#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;
  var title_id;

  if ((match = /\/bibliotheque\/([^\.]+)\.htm/.exec(path)) !== null) {
    // http://www.dalloz-bibliotheque.fr/bibliotheque/Droit_des_suretes-12621.htm
    title_id =  match[1];
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.title_id    = title_id;
    result.unitid = title_id;

  } else if ((match = /\/fr\/pvpage2.asp/.exec(path)) !== null) {
    // http://dallozbndpro-pvgpsla6.dalloz-bibliotheque.fr ...
    // /fr/pvpage2.asp?puc=4294&nu=77&selfsize=1&tmpid=3c41e7b9369c330db460588a28b12a21&atype=corp
    // console.log(param);
    title_id =  'puc:' + param['puc'] + '-nu:' + param['nu'];
    result.rtype = 'BOOK';
    result.mime  = 'PDF';
    result.title_id    = title_id;
    result.unitid = title_id;
  }
  return result;
});
