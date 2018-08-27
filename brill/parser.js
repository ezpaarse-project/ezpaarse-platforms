#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Brill
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;
  let matchinfo;

  if ((match = /^\/content\/journals\/([0-9.]+\/([0-9x-]+))$/i.exec(path)) !== null) {
    // /content/journals/10.1163/157006605774832225
    // /content/journals/10.1163/2405836x-00101001
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[2];
    result.doi    = match[1];
  } else if ((match = /^\/docserver\/([0-9]+[xX]?)\/(v([0-9]+)n([0-9]+)_([a-z0-9]+)).pdf$/i.exec(path)) !== null) {
    // docserver/00224200/v35n4_splitsection3.pdf
    result.rtype             = 'ARTICLE';
    result.mime              = 'PDF';
    result.title_id          = match[1];
    result.online_identifier = match[1].substr(0, 4) + '-' +  match[1].substr(4, 4);
    result.vol               = match[3];
    result.issue             = match[4];
    result.unitid            = match[1] + '/' + match[2];
  } else if ((match = /^\/content\/(?:journals\/)?(([0-9]+[xX]?)(?:\/([0-9]+)\/([0-9]+))?)$/i.exec(path)) !== null) {
    // content/journals/15700666/35/4
    result.rtype             = 'TOC';
    result.mime              = 'HTML';
    result.unitid            = match[1];
    result.title_id          = match[2];
    result.online_identifier = match[2].substr(0, 4) + '-' +  match[2].substr(4, 4);
    result.vol               = match[3];
    result.issue             = match[4];

  } else if ((match = /^\/media\/([a-z0-9]*)\/([^.]+).pdf$/i.exec(path)) !== null) {
    //media/pplrdc/er372_411-412.pdf
    /// nij9789004177512_287-306.pdf
    //9789047409812-008.pdf
    //9789004206823_webready_content_s007.pdf
    //id=id=brills-digital-library-of-world-war-i/volunteers-auxiliaries-and-womens-mobilization-the-firstworld-war-and-beyond-19141939-B9789004206823_007
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'PDF';
    result.unitid = match[1] + '/' + match[2];

    let title;

    if (param.id) {
      matchinfo =  param.id.split('/')[1];
      if ((matchinfo = /([^.]+)-([A-Z0-9]+)_([0-9]+)$/.exec(matchinfo)) !== null) {
        title = matchinfo[1];
      }
    }

    if (/^([a-z0-9]+)_([0-9]+)-([0-9]+)$/i.test(match[2])) {
      result.online_identifier = param.id.split('.')[1];
      if (match[1] !== 'pplrdc') {
        result.online_identifier = /([a-z]+)([0-9]+)_([0-9]+)-([0-9]+)$/i.exec(match[2])[2];
        result.title_id = title;
      }
    } else if (/^([0-9]+)-([0-9]+)/.test(match[2])) {
      result.online_identifier = match[2].split('-')[0];
      result.title_id = title;
    } else if (/^([0-9]+)_([^.]+)/.test(match[2])) {
      result.online_identifier = match[2].split('_')[0];
      result.title_id = title;
    }
  } else if ((match = /^\/entries\/([a-z-]+)\/([a-z0-9._\-*]+)$/i.exec(path)) !== null) {
    // /entries/the-hague-academy-collected-courses/*-ej.9789004289376.395_503
    // /entries/brill-s-encyclopedia-of-hinduism/temple-rituals-north-india-BEHCOM_000378
    result.rtype   = 'TOC';
    result.mime    = 'HTML';

    if ((matchinfo = /^([^.]+)\.([0-9]+)\.(([0-9]+)_([0-9]+))$/i.exec(match[2])) !== null) {
      result.online_identifier = matchinfo[2];
      result.unitid = matchinfo[2] + '.' + matchinfo[3];
    } else {
      result.rtype  = 'ENCYCLOPAEDIA_ENTRY';
      result.unitid = match[1] + '/' + match[2];
    }

  } else if ((match = /^\/(deliver|docserver)\/([0-9]+[xX]?)\/([0-9]+)\/([0-9]+)\/([0-9a-z_]+).(pdf|html)$/i.exec(path)) !== null) {
    //deliver/17087384/4/3/17087384_004_03_S02_text.pdf
    result.rtype             = 'ARTICLE';
    result.mime              = match[6] === 'pdf' ? 'PDF' : 'HTML';
    result.title_id          = match[2];
    result.online_identifier = match[2].substr(0, 4) + '-' + match[2].substr(4, 4);
    result.vol               = match[3];
    result.issue             = match[4];
    result.unitid            = match[5].replace('_text', '');
  } else if ((match = /^\/(abstract|view|downloadpdf|epub)\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-._]+)\.xml/i.exec(path)) !== null) {
    // /abstract/journals/aall/2/1/article-p23_2.xml
    // /view/journals/jjs/5/1/article-p97_97.xml
    // /view/journals/jjs/5/1/jjs.5.issue-1.xml
    // /epub/journals/jjs/5/1/article-p97_97.xml
    // /downloadpdf/journals/jjs/5/1/article-p97_97.xml
    result.title_id = match[2];
    result.vol = match[3];
    result.issue = match[4];
    result.unitid = /article-p/.test(match[5]) ? `${match[2]}/${match[3]}/${match[4]}/${match[5]}` : match[5];

    switch (match[1]) {
    case 'abstract': {
      result.rtype = 'ABS';
      result.mime = 'HTML';

      let tmp = /^article-p([0-9]+)_([0-9]+)$/i.exec(match[5]);
      result.first_page = tmp[1];

      break;
    }

    case 'view': {
      result.rtype = /article-p/.test(match[5]) ? 'ARTICLE' : 'TOC';
      result.mime = 'HTML';
      if (/article-p/.test(match[5])) {
        let tmp = /^article-p([0-9]+)_([0-9]+)$/i.exec(match[5]);
        result.first_page = tmp[1];
      }

      break;
    }

    case 'downloadpdf':
    case 'epub': {
      result.rtype = 'ARTICLE';
      result.mime = match[1] === 'downloadpdf' ? 'PDF' : 'EPUB';
      if (/article-p/.test(match[5]) && match[1] === 'epub') {
        let tmp = /^article-p([0-9]+)_([0-9]+)$/i.exec(match[5]);
        result.first_page = tmp[1];
      }

      break;
    }
    }
  }

  return result;
});
