#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Oxford Art Online (Grove, Benezit et 3 autres)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};

  let match;


  if ((match = /^\/[a-z]+\/(?:view|display)\/10\.\d+\/[a-z]+\/([0-9]+)[\d.]*\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /benezit/view/10.1093/benz/9780199773787.001.0001/acref-9780199773787-e-00000023?rskey=PkGWDp&result=5
    // /groveart/view/10.1093/gao/9781884446054.001.0001/oao-9781884446054-e-7000000064?print=pdf

    result.rtype  = 'ARTICLE';
    result.mime   = /^pdf$/i.test(param.print) ? 'PDF' : 'HTML';
    result.unitid = match[2];

    result.online_identifier = match[1];

  } else if ((match = /^\/subscriber\/article\/grove\/art\/([TF][0-9]+)$/i.exec(path)) !== null) {
    // Grove Art Online
    // http://www.oxfordartonline.com/subscriber/article/grove/art/T000015
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = 'grove';
    result.unitid   = match[1];
  } else if ((match = /^\/subscriber\/(article|article_citations)\/benezit\/(.+)$/i.exec(path)) !== null) {
    // Benezit
    // http://www.oxfordartonline.com/subscriber/article/benezit/B00088821
    // http://www.oxfordartonline.com/subscriber/article_citations/benezit/B00052634?q=donatello&search=quick&source=oao_benz&pos=1&_start=1
    result.rtype    = (match[1] === 'article') ? 'ARTICLE' : 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.title_id = 'benezit';
    result.unitid   = match[2];
  } else if ((match = /^\/subscriber\/article\/opr\/(t4|t234|t118)\/(.+)$/i.exec(path)) !== null) {
    // http://www.oxfordartonline.com/subscriber/article/opr/t118/e2515 (The Oxford Companion to Western Art)
    // http://www.oxfordartonline.com/subscriber/article/opr/t4/e1014 (The Concise Oxford Dictionary of Art Terms)
    // http://www.oxfordartonline.com/subscriber/article/opr/t234/e0287 (Encyclopedia of Aesthetics)
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/subscriber\/(article|popup_fig)\/img\/grove\/art\/([F][0-9]+)$/i.exec(path)) !== null) {
    // Grove Art Online : accès à la page d'une image, à l'image
    // http://www.oxfordartonline.com/subscriber/article/img/grove/art/F017567
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = 'grove';
    result.unitid   = match[2];
  } else if ((match = /^\/subscriber\/article\/img\/opr\/(t4|t234|t118)\/(.+)$/i.exec(path)) !== null) {
    // Encyclopedia of Aesthetics : accès à une image
    // http://www.oxfordartonline.com/subscriber/article/img/opr/t234/0195113071_abstraction_2
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/subscriber\/page\/themes\/([a-z]+)$/i.exec(path)) !== null) {
    // http://www.oxfordartonline.com/subscriber/page/themes/renaissanceartandarchitecture
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});

