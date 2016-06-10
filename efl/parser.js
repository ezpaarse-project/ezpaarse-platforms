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

  if (path === '/EFL2/DOCUMENT/VIEW/documentViewUDFrame.do' ||
      path === '/EFL2/DOCUMENT/VIEW/documentViewUDContent.do') {
    // http://abonnes.efl.fr/EFL2/DOCUMENT/VIEW/documentViewUDFrame.do?key=BF1511&refId=_JVID_BF1511_1
    // http://abonnes.efl.fr/EFL2/DOCUMENT/VIEW/documentViewUDFrame.do?key=RJF15
    result.rtype = 'JURISPRUDENCE';
    result.mime  = 'HTML';

    if (param.key) {
      result.title_id = param.key.replace('DOC$', '');
      result.unitid   = result.title_id;
    }
    if (param.refId) { result.unitid = param.refId; }

  } else if (path === '/portail/actusdetail.no') {
    // http://abonnes.efl.fr/portail/actusdetail.no?ezId=73387&mode=nav
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.ezId) {
      result.title_id = param.ezId.replace('DOC$', '');
      result.unitid   = result.title_id;
    }

  } else if ((match = /^\/PDF\/[0-9]{4}\/([a-z]+\d+)\/Default\.html$/i.exec(path)) !== null) {
    // http://abonnes.efl.fr/PDF/2015/FR1546/Default.html
    result.rtype    = 'BOOK';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
