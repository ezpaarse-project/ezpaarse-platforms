#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const patterns = {
  issn: '([0-9]{4}-[0-9]{3}[0-9xX])',
  issn_short: '(([0-9]{4})([0-9]{3}[0-9xX]))',
  doi: '((10[.][0-9]+)/([^.]+))',
  title_id: '([^.]+).',
  ISSN: '[0-9]{4}\\-[0-9]{3}([0-9Xx])?',
  ISBN: '((978[-– ])?[0-9][0-9-– ]{10}[-– ][0-9xX])|((978)?[0-9]{9}[0-9])',
  DOI: '((10[.][0-9]{4,}[^\\s"/<>]*)/([^\\s"<>]+))'
};

/**
 * Identifie les consultations de la plateforme deepdyve (gestion des accès refusés)
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

  if (/^\/rental-link$/i.test(path)) {

    result._granted = false; // These ECs are denied access

    // http://www.deepdyve.com:80/rental-link?docId=10.1016/S1872-1508(08)60082-0&journal=18721508&
    // fieldName=journal_doi&affiliateId=elsevier&format=jsonp&
    // callback=jQuery171039578543696552515_1408449347105&_=140844935716

    // http://www.deepdyve.com:80/rental-link?docId=10.1002/9781118782101.ch8&
    // fieldName=journal_doi&journal=undefined&affiliateId=wiley&
    // format=jsonp&callback=jsonp1408448955682

    // default behavior
    // for example springer (don't need to change platform name)
    if (param.affiliateId) {
      result.platform = param.affiliateId;
      result.rtype    = 'ARTICLE';

      if (param.journal) {
        result.print_identifier = param.journal;
      }
    }

    if (param.docId) {
      result.unitid = param.docId;

      if (param.fieldName === 'journal_doi') {
        result.doi = param.docId;
      }
    }

    // override defaults in same cases
    if (result.platform === 'elsevier' && param.journal) {
      result.platform = 'sd'; // real short name of platform

      if ((match = param.journal.match(new RegExp(patterns.issn_short)))) {
        result.print_identifier = match[2] + '-' + match[3];
      }

    } else if (result.platform === 'nature' && param.docId) {
      result.platform = 'npg'; // real short name of platform

      if ((match = param.docId.match(new RegExp(patterns.DOI)))) {
        let piStringDoi = match[3].match(/[a-z]{2,}/); // 10.1038/ng0692

        if (piStringDoi) {
          result.title_id = piStringDoi[0];
        }
      }

    } else if (result.platform === 'wiley' && param.docId) {

      if ((match = param.docId.match(new RegExp(patterns.DOI)))) {
        // j.1600-0390.2012.00514.x
        // anie.201209878
        // 9781118268117.ch3

        if (param.journal) {
          result.print_identifier = param.journal;
        }

        if (match[3]) {
          let m;
          let r1, r2, r3;
          r1 = new RegExp('^(' + patterns.issn + ')');
          r2 = new RegExp('j.(' + patterns.issn + ')');
          r3 = new RegExp('(' + patterns.title_id + ')([^/]+)');

          if ((m = match[3].match(r1))) {
            result.print_identifier = m[1];
            result.rtype = 'TOC';

          } else if ((m = match[3].match(r2))) {
            result.print_identifier = m[1];
            result.rtype = 'TOC';

          } else if ((m = match[3].match(r3))) {
            result.title_id = m[2];

            if (m[3].match('ch.+')) {
              result.rtype = 'BOOK_SECTION';
              result.print_identifier = m[2];
            } else {
              result.rtype = 'TOC';
            }
          }
        }
      }
    }

    result.mime = 'DEEPDYVE';
  }

  return result;
});

