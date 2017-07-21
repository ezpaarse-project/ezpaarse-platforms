#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let param  = parsedUrl.query || {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/bibliotheque\/([^.]+)\.htm/i.exec(path)) !== null) {
    // http://www.dalloz-bibliotheque.fr/bibliotheque/Droit_des_suretes-12621.htm
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/fr\/pvpage2\.asp/i.exec(path)) !== null) {
    // http://dallozbndpro-pvgpsla6.dalloz-bibliotheque.fr ...
    // /fr/pvpage2.asp?puc=4294&nu=77&selfsize=1&tmpid=3c41e7b9369c330db460588a28b12a21&atype=corp
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.unitid = result.title_id = 'puc:' + param['puc'] + '-nu:' + param['nu'];
  }

  return result;
});
