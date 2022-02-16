#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const dbRtypes = require('./db-rtypes.json');

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
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/document\/doi\/(10\.[0-9]+\/([a-z0-9_.-]+))\/(html|pdf)$/i.exec(path)) !== null) {
    // Article: /document/doi/10.1515/bd-2021-0084/html
    // Article: /document/doi/10.1515/bd-2021-0050/pdf

    // Chapter: /document/doi/10.7312/ferr14880-003/html
    // Monograph: /document/doi/10.14361/9783839456897/pdf
    // Book: /document/doi/10.1515/9783110690491/pdf

    result.mime = match[3] === 'pdf' ? 'PDF' : 'HTML';
    result.doi = match[1];
    result.unitid = match[2];

    if (/^[a-z]+-[0-9]{4}-[a-z0-9]+$/i.test(result.unitid)) {
      result.rtype = 'ARTICLE';
    } else if (/^[a-z]+\.[0-9]+\.[0-9]+\.[a-z0-9]+$/i.test(result.unitid)) {
      result.rtype = 'ARTICLE';
    } else if (/^[0-9]{13}$/i.test(result.unitid)) {
      result.rtype = 'BOOK';
    } else if (/^([0-9]{13}|[a-z]+[0-9]+)-[a-z0-9]+$/i.test(result.unitid)) {
      result.rtype = 'BOOK_SECTION';
    }

  } else if ((match = /^\/document\/database\/([a-z0-9]+)\/entry\/([a-z0-9]+)\/(html|pdf)$/i.exec(path)) !== null) {
    // /document/database/BTL/entry/AIUVETSAT/html

    result.rtype = 'OTHER';
    result.mime = match[3] === 'pdf' ? 'PDF' : 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/view\/[a-z]+\/([a-z]+)\.([0-9]+)\.([0-9]+)\.issue-([0-9]+)\/([a-z0-9-]+)\/([a-z0-9._-]+).xml$/i.exec(path)) !== null) {
    // /view/j/jtms.2014.1.issue-2/issue-files/jtms.2014.1.issue-2.xml
    // /view/j/jtms.2014.1.issue-2/jtms-2014-0026/jtms-2014-0026.xml?format=INT
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.publication_date = match[2];
    result.vol = match[3];
    result.issue = match[4];
    result.unitid = match[6];

    if (match[5] !== 'issue-files') {
      result.doi = `${doiPrefix}/${match[5]}`;
      result.rtype = 'PREVIEW';
    }

  } else if ((match = /^\/dg\/view(article|journalissue)[a-z.:]+\/\$002f[a-z]+\$002f([a-z]+)\.([0-9]{4})[0-9.]+issue-([0-9-]+)\$002f.+?\$002f(.+?)\.pdf(\/[a-z0-9._-]+)?$/i.exec(path)) !== null) {
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.200$002f9783110239423.200.pdf
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fkant.1957.48.issue-1-4$002fkant.1957.48.1-4.185$002fkant.1957.48.1-4.185.pdf
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fling.2012.50.issue-4$002fling-2012-0026$002fling-2012-0026.pdf/ling-2012-0026.pdf
    // /dg/viewjournalissue.articlelist.resultlinks.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.vii$002f9783110239423.vii.pdf

    result.mime = 'PDF';
    result.rtype = match[1] === 'article' ? 'ARTICLE' : 'TOC';
    result.title_id = match[2];
    result.publication_date = match[3];
    result.issue = match[4];
    result.unitid = match[5];

    match = /^[a-z]+\.[0-9]{4}\.([0-9]+)\.[0-9-]+\.([0-9]+)+$/i.exec(result.unitid);

    if (match) {
      result.vol = match[1];
      result.first_page = match[2];
    }

  } else if ((match = /^\/downloadpdf\/[a-z]{1}\/([a-z]+)\.([0-9]{4})\.[a-z0-9.-]+\/[a-z0-9.-]+\/([a-z0-9.-]+)\.(xml|pdf)$/i.exec(path)) !== null) {
    // /downloadpdf/j/acs.2016.9.issue-1/acs-2016-0003/acs-2016-0003.xml
    // /downloadpdf/j/etly.2011.2011.issue-1/9783110239423.121/9783110239423.121.pdf

    result.mime = 'PDF';
    result.rtype = 'ARTICLE';
    result.title_id = match[1];
    result.publication_date = match[2];
    result.unitid = match[3];
    result.doi = `${doiPrefix}/${match[3]}`;

  } else if ((match = /^\/view\/title\/([0-9a-z_]+)$/i.exec(path)) !== null) {
    // /printpdf/view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND
    // /view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND

    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^(\/printpdf)?\/view\/([a-z]+)\/([0-9a-z_]+)$/i.exec(path)) !== null) {
    // /printpdf/view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND
    // /view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND

    result.rtype = dbRtypes[match[2].toUpperCase()];
    result.mime = match[1] ? 'PDF' : 'HTML';
    result.title_id = match[2].toLowerCase();
    result.unitid = match[3];
  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z]+\.[0-9]+\.(issue)-[0-9]+|article-p([0-9]+)).xml$/i.exec(path)) !== null) {
    // /view/journals/jtph/1/2/article-p219.xml
    // /view/journals/etly/1/1/etly.1.issue-1.xml

    result.rtype = 'ARTICLE';
    if (match[5] && match[5].toLowerCase() === 'issue') {
      result.rtype = 'TOC';
    }

    result.mime = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = `${match[1]}/${match[2]}/${match[3]}/${match[4]}`;

    if (match[6]) {
      result.first_page = match[6];
    }
  } else if ((match = /^\/downloadpdf\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/(article-p([0-9]+))\.(xml|pdf)$/i.exec(path)) !== null) {
    // /downloadpdf/journals/etly/2/1/article-p95.xml
    // /downloadpdf/journals/jtph/1/3/article-p313.pdf

    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = `${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
    result.first_page = match[5];
  } else if ((match = /^\/download(pdf|epub)\/title\/([0-9]+)(?:\.pdf|\.xml)?$/i.exec(path)) !== null) {
    // /downloadpdf/title/551480
    // /downloadepub/title/551480
    // /downloadpdf/title/561828.pdf

    result.rtype = 'BOOK';
    result.mime = match[1].toUpperCase();
    result.unitid = match[2];
  } else if ((match = /^\/(downloadpdf|view)\/book\/([0-9]+)\/(10.[0-9]+\/([0-9-]+))\.(xml|pdf)$/i.exec(path)) !== null) {
    // /view/book/9783110638202/10.1515/9783110638202-005.xml
    // /downloadpdf/book/9783110638202/10.1515/9783110638202-005.xml

    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.doi = match[3];
    result.unitid = match[4];
    result.online_identifier = match[2];
  } else if ((match = /^\/database\/([a-z0-9]+)\/entry\/([a-z0-9.]+)\/(html|pdf)$/i.exec(path)) !== null) {
    // /database/VDBO/entry/vdbo.killy.1962/html

    result.rtype = 'RECORD_VIEW';
    result.db_id = match[1];
    result.mime = match[3] === 'pdf' ? 'PDF' : 'HTML';
    result.unitid = match[2];

  }

  return result;
});

