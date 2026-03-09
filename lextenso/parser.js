#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

// For some reason, there can be more than one title_id for each title
// So we convert those title_ids into the one that is used in the PKB
const titleIdMatching = {
  'EDPI': 'DPI',
  'EDAA': 'DAA',
  'PA': 'LPA',
  'QJ': 'LPA',
  'JBE': 'BJE',
  'EDCO': 'DCO',
  'EDBA': 'DBA',
  'JBT': 'BJT',
  'EDFP': 'DFP',
  'JBB': 'BJB',
  'EDUC': 'DIU',
  'EDED': 'DED',
  'EDAS': 'DAS',
  'AD': 'DEF',
  'QP': 'DEF',
  'JP': 'DEF',
  'CJ': 'DEF',
  'IA': 'DEF',
  'RM': 'DEF',
  'JBS': 'BJS',
};

// Extracted from the title_url column of the PKB
const titlePages = new Set([
  'lessentiel-droit-de-la-propriete-intellectuelle',
  'lessentiel-droits-africains-des-affaires',
  'petites-affiches',
  'lessentiel-droit-de-la-distribution-et-de-la-concurrence',
  'gazette-du-palais',
  'bulletin-joly-entreprises-en-difficulte',
  'lessentiel-droit-des-contrats',
  'lessentiel-droit-bancaire',
  'penant',
  'revue-des-contrats',
  'revue-francaise-de-finances-publiques',
  'bulletin-joly-travail',
  'revue-generale-du-droit-des-assurances',
  'flash-defrenois',
  'les-nouveaux-cahiers-du-conseil-constitutionnel',
  'revue-du-droit-public',
  'les-cahiers-sociaux',
  'cahiers-de-larbitrage',
  'lessentiel-droit-de-la-famille-et-des-personnes',
  'bulletin-joly-bourse',
  'lessentiel-droit-de-limmobilier-et-urbanisme',
  'revue-pratique-droit-des-affaires',
  'lessentiel-droit-des-entreprises-en-difficulte',
  'lessentiel-droit-des-assurances',
  'defrenois',
  'bulletin-joly-societes',
]);

/**
 * Recognizes the accesses to the platform Lextenso
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  /**
   * Ancienne plateforme : www.lextenso.fr
   */
  if ((match = /^\/revue(\/([A-Z]+)\/\d+\/\d+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/revue/BJB/2018/05
    //https://www.lextenso.fr/revue/DFF/2018/39
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = titleIdMatching[match[2]] || match[2];
  }

  else if ((match = /^\/jurisprudence\/(([A-Z]+).+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/jurisprudence/CONSTEXT000031256027
    //https://www.lextenso.fr/jurisprudence/CAPARIS-18042013-10_21459
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
  }

  else if ((match = /^\/[^magazine-issues][a-z-]+\/(([A-Z]+).+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/lessentiel-droit-des-contrats/EDCO-116023-11602
    //https://www.lextenso.fr/petites-affiches/PA199902103
    //https://www.lextenso.fr/petites-affiches/PA201602202
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = titleIdMatching[match[2]] || match[2];
  }

  /**
   * Nouvelle plateforme : www.labase-lextenso.com
   */
  else if (/^\/recherche$/i.test(path)) {
    // /recherche?prod-recherche%5Bquery%5D=droit%20au%20bail
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  else if ((match = /^\/ouvrages\/([a-z0-9_-]+)-(\d{4})-(\d{13})\/?$/i.exec(path)) !== null) {
    // /ouvrages/droit-du-travail-2026-9782297288026/
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[3];
    result.publication_date = match[2];
    result.online_identifier = match[3];
  }

  else if ((match = /^\/ouvrages\/([a-z0-9_-]+)-(\d{4})-(\d{13})\/([a-z0-9_-]+)\/?$/i.exec(path)) !== null) {
    // /ouvrages/droit-du-travail-2026-9782297288026/chapitre-1-l-objet-de-la-negociation-collective-9782297288026-33#ref_titre_0033
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[4];
    result.publication_date = match[2];
    result.online_identifier = match[3];
  }

  else if ((match = /^\/[a-z0-9_-]+\/(\d{4})-n(\d+)\/([a-z0-9_-]+-([A-Z]+)[a-z0-9_-]+)(\/PDF-revue)?$/.exec(path)) !== null) {
    // /gazette-du-palais/2026-n2/l-intelligence-artificielle-generative-a-la-faculte-de-droit-s-adapter-pour-ne-pas-se-faire-depasser-GPL486a4/PDF-revue
    // /gazette-du-palais/2026-n2/l-intelligence-artificielle-generative-a-la-faculte-de-droit-s-adapter-pour-ne-pas-se-faire-depasser-GPL486a4
    result.rtype = 'ARTICLE';
    result.mime = match[5] ? 'PDF' : 'HTML';
    result.unitid = match[3];
    result.title_id = match[4];
    result.publication_date = match[1];
    result.issue = match[2];
  }

  else if ((match = /^\/([a-z0-9_-]+)\/?$/i.exec(path)) !== null && titlePages.has(match[1])) {
    // /bulletin-joly-bourse
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
