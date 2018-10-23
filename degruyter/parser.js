#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const doiPrefix = '10.1515';

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

  if ((match = /^\/view\/[a-z]+\/([a-z]+)\.([0-9]+)\.([0-9]+)\.issue-([0-9]+)\/([a-z0-9-]+)\/([a-z0-9._-]+).xml$/i.exec(path)) !== null) {
    // /view/j/jtms.2014.1.issue-2/issue-files/jtms.2014.1.issue-2.xml
    // /view/j/jtms.2014.1.issue-2/jtms-2014-0026/jtms-2014-0026.xml?format=INT
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.title_id         = match[1];
    result.publication_date = match[2];
    result.vol              = match[3];
    result.issue            = match[4];
    result.unitid           = match[6];

    if (match[5] !== 'issue-files') {
      result.doi   = `${doiPrefix}/${match[5]}`;
      result.rtype = 'PREVIEW';
    }

  } else if ((match = /^\/dg\/view(article|journalissue)[a-z.:]+\/\$002f[a-z]+\$002f([a-z]+)\.([0-9]{4})[0-9.]+issue-([0-9-]+)\$002f.+?\$002f(.+?)\.pdf(\/[a-z0-9._-]+)?$/i.exec(path)) !== null) {
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.200$002f9783110239423.200.pdf
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fkant.1957.48.issue-1-4$002fkant.1957.48.1-4.185$002fkant.1957.48.1-4.185.pdf
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fling.2012.50.issue-4$002fling-2012-0026$002fling-2012-0026.pdf/ling-2012-0026.pdf
    // /dg/viewjournalissue.articlelist.resultlinks.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.vii$002f9783110239423.vii.pdf

    result.mime             = 'PDF';
    result.rtype            = match[1] === 'article' ? 'ARTICLE' : 'TOC';
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.issue            = match[4];
    result.unitid           = match[5];

    match = /^[a-z]+\.[0-9]{4}\.([0-9]+)\.[0-9-]+\.([0-9]+)+$/i.exec(result.unitid);

    if (match) {
      result.vol = match[1];
      result.first_page = match[2];
    }

  } else if ((match = /^\/downloadpdf\/[a-z]{1}\/([a-z]+)\.([0-9]{4})\.[a-z0-9.-]+\/[a-z0-9.-]+\/([a-z0-9.-]+)\.(xml|pdf)$/i.exec(path)) !== null) {
    // /downloadpdf/j/acs.2016.9.issue-1/acs-2016-0003/acs-2016-0003.xml
    // /downloadpdf/j/etly.2011.2011.issue-1/9783110239423.121/9783110239423.121.pdf

    result.mime             = 'PDF';
    result.rtype            = 'ARTICLE';
    result.title_id         = match[1];
    result.publication_date = match[2];
    result.unitid           = match[3];
    result.doi              = `${doiPrefix}/${match[3]}`;

  } else if ((match = /^(\/printpdf)?\/view\/([a-z]+)\/([0-9a-z_]+)$/i.exec(path)) !== null) {
    // /printpdf/view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND
    // /view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND

    result.rtype    = 'BIO';
    result.mime     = match[1] ? 'PDF' : 'HTML';
    result.title_id = match[2].toLowerCase();
    result.unitid   = match[3];
  }


  return result;
});

