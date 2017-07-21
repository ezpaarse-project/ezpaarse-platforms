#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme De Gruyter
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;
  let info;

  // letiable qui va contenir le volume l'issue et numéro de page
  let infodetail;

  if ((match = /^\/view\/([a-z]+)\/(([a-z]+)\.([0-9]+)\.([0-9]+)\.([a-z]+)-([0-9]+))\/([a-z0-9-]*)\/([^]*).xml$/i.exec(path)) !== null) {
    //view/j/jtms.2014.1.issue-2/issue-files/jtms.2014.1.
    //issue-2.xml
    //view/j/jtms.2014.1.issue-2/jtms-2014-0026/jtms-2014-0026.xml?format=INT
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.title_id         = match[3];
    result.vol              = match[5];
    result.issue            = match[7];
    result.unitid           = match[9];
    result.publication_date = match[4];

    if (match[8] !== 'issue-files') {
      result.doi   = '10.1515/' + match[8];
      result.rtype = 'PREVIEW';
    }

  } else if ((match = /^\/dg\/([^]*)\/([^]*)\/([a-z0-9-]+).pdf$/i.exec(path)) !== null) {
    ///dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fling.2012.50.issue-4$002fling-2012-0026$002fling-2012-0026.pdf/ling-2012-0026.pdf

    info = match[2].split('$002f');

    result.publication_date = info[2].split('.')[1];
    result.title_id         = info[2].split('.')[0];
    result.issue            = info[2].split('.')[3].replace('issue-', '');
    result.unitid           = info[4];

    if ((infodetail = /^([a-z]+)\.([0-9]+)\.([0-9]+)\.([0-9-]+)\.([0-9]+)\.([a-z]+)/.exec(info[4])) !== null) {
      result.vol        = infodetail[3];
      result.first_page = infodetail[5];
    }

    result.mime             = 'PDF';

    if (match[1].split('.')[0] === 'viewarticle') {
      result.rtype = 'ARTICLE';
    } else {
      result.rtype = 'TOC';
    }

  } else if ((match = /^\/dg\/([^]*)\/([^]*)$/i.exec(path)) !== null) {
    //dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.
    //issue-1$002f9783110239423.200$002f9783110239423.200.pdf?

    //dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fkant.1957.48.
    //issue-1-4$002fkant.1957.48.1-4.185$002fkant.1957.48.1-4.185.pdf

    ////$002fj$002fjtms.2015.2.issue-1$002fjtms-2015-frontmatter1$002fjtms-2015-frontmatter1.pdf

    info = match[2].split('$002f');

    result.publication_date = info[2].split('.')[1];
    result.title_id         = info[2].split('.')[0];
    result.issue            = info[2].split('.')[3].replace('issue-', '');
    result.unitid           = info[4];

    if ((infodetail = /^([a-z]+)\.([0-9]+)\.([0-9]+)\.([0-9-]+)\.([0-9]+)\.([a-z]+)/.exec(info[4])) !== null) {
      result.vol        = infodetail[3];
      result.first_page = infodetail[5];
    }

    result.mime = 'PDF';

    if (match[1].split('.')[0] === 'viewarticle') {
      result.rtype = 'ARTICLE';
    } else {
      result.rtype = 'TOC';
    }

  } else if ((match = /^\/downloadpdf\/([a-z]{1})\/([^]*)\/([^]*)\/([^]*).xml$/i.exec(path)) !== null) {
    // /downloadpdf/j/acs.2016.9.issue-1/acs-2016-0003/acs-2016-0003.xml

    info                    = match[2].split('.');
    result.publication_date = info[1];
    result.title_id         = info[0];
    result.doi              = '10.1515/' + match[3];
    result.unitid           = match[2];
    result.mime             = 'PDF';
    result.rtype            = 'ARTICLE';

  }

  return result;
});

