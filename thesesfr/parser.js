#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Theses.fr
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  //console.error(parsedUrl);

  const apiPersonRegex = /\/api\/v1\/personnes\/personne\/([0-9]{8}[0-9X])/ig;
  const apiOrganismeRegex = /\/api\/v1\/theses\/organisme\/([0-9]{8}[0-9X])/ig;
  const apiThesisRegex = /\/api\/v1\/theses\/these\/(([0-9]{4})([a-z]{2}[0-9a-z]{2})[0-9a-z]+)/ig;
  const apiSubjectRegex = /\/api\/v1\/theses\/these\/(s[0-9]+)/ig;

  const apiDocumentRegex = /\/api\/v1\/document\/(([0-9]{4})([a-z]{2}[0-9a-z]{2})[0-9a-z]+)/ig;
  const apiProtectedDocRegex = /\/api\/v1\/document\/protected\/(([0-9]{4})([a-z]{2}[0-9a-z]{2})[0-9a-z]+)/ig;

  const baseReferer ='https://www.theses.fr/';
  const baseRefererShort ='https://theses.fr/';

  /**
   * Returns true if the request comes from a browser (based on the referer)
   * @param {string} unitid - ID of the resource being accessed
   * @returns {boolean}
   */
  const isHumanBrowsing = function (unitid) {
    return (
      ec['Referer'] === `${baseReferer}${unitid}` ||
      ec['Referer'] === `${baseRefererShort}${unitid}`
    );
  };

  let match;

  if (ec['User-Agent'] === 'node') {
    //NOP

  } else if (
    ((match = /^\/(([0-9]{4})([a-z]{2}[0-9a-z]{2})[0-9a-z]+)\/(document|abes)$/i.exec(path)) !== null) ||
    ((match = apiDocumentRegex.exec(path)) !== null)
  ) {
    // https://theses.fr/2020EMAC0007/document Accès au PDF d’une thèse soutenue PHD_THESIS disponible en ligne
    // /api/v1/document/2020EMAC0007 Accès au PDF d’une thèse soutenue PHD_THESIS disponible en ligne
    result.rtype = 'PHD_THESIS';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];

    switch (Number.parseInt(ec.status, 10)) {
    case 200:
      result.mime = 'PDF';
      break;
    case 302:
      result.mime = 'HTML';
      break;
    default:
      result.mime = 'MISC';
      break;
    }

  } else if ((match = apiProtectedDocRegex.exec(path)) !== null) {
    // /api/v1/document/protected/2014PA070043  Accès au PDF d’une thèse PHD_THESIS sur l’intranet national
    result.rtype = 'PHD_THESIS';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];

  } else if ((match = apiPersonRegex.exec(path)) !== null) {
    // RECORD person JSON, will be changed to BIO in middleware thesesfr-personne
    // /api/v1/personnes/personne/264066944
    result.rtype = 'RECORD';
    result.mime = isHumanBrowsing(match[1]) ? 'HTML' : 'JSON';
    result.unitid = match[1];
    result.ppn = match[1];

  } else if ((match = apiOrganismeRegex.exec(path)) !== null) {
    // RECORD organism JSON
    // /api/v1/theses/organisme/159502497
    result.rtype = 'RECORD';
    result.mime = isHumanBrowsing(match[1]) ? 'HTML' : 'JSON';
    result.unitid = match[1];
    result.ppn = match[1];

  } else if ((match = /^\/([0-9]{8}[0-9X])$/i.exec(path)) !== null) {
    // /258987731 RECORD HTML undeterminable person or organism, will eventually set to BIO in middleware thesesfr-personne
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.ppn = match[1];

  } else if ((match = apiSubjectRegex.exec(path)) !== null) {
    // ABStract notice d’une thèse en préparation
    // /api/v1/theses/these/s383095
    result.rtype = 'ABS';
    result.mime = isHumanBrowsing(match[1]) ? 'HTML' : 'JSON';
    result.unitid = match[1];

  } else if ((match = /^\/(s[0-9]+)$/i.exec(path)) !== null) {
    // /s366354 ABStract notice d’une thèse en préparation HTML
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = apiThesisRegex.exec(path)) !== null) {
    // ABStract notice d’une thèse soutenue JSON
    // /api/v1/theses/these/2023UPASP097
    result.rtype = 'ABS';
    result.mime = isHumanBrowsing(match[1]) ? 'HTML' : 'JSON';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];

  } else if ((match = /^\/(([0-9]{4})([a-z]{2}[0-9a-z]{2})[0-9a-z]+)$/i.exec(path)) !== null) {
    // /2023UPASP097 ABStract notice d’une thèse soutenue HTML
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];
  }

  return result;
});