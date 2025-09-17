#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform My Cow
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  const categories = [
    'test-de-certification/premiers-pas',
    'exercices-anglais',
    'exercices-anglais/lesson',
    'videos-en-anglais/archives',
    'thats-life',
    'lexical/family',
    'pronounce/beginner',
    'dictees-en-anglais',
    'point-culture',
  ];

  if ((match = /^\/([a-z-]+)\/?$/i.exec(path)) !== null) {
    // /exercices-anglais
    if (categories.includes(match[1])) {
      result.rtype   = 'TOC';
      result.mime   = 'HTML';
    }
  } else if ((match = /^\/(([a-z-]+)\/[a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    if (categories.includes(match[1])) {
      // /videos-en-anglais/archives
      result.rtype   = 'TOC';
      result.mime   = 'HTML';
    } else {
      // /article-a-lire-et-a-ecouter-en-anglais/sur-pourquoi-le-cerveau-reve
      result.rtype  = 'ARTICLE';
      result.mime   = 'MISC';
      result.unitid = match[1];

      if (/videos/i.test(match[2])) {
        result.rtype = 'VIDEO';
      }
    }
  } else if ((match = /^\/espace-pro\/(kit-survie\/[0-9]+)\/show\/public\/?$/i.exec(path)) !== null) {
    // /espace-pro/kit-survie/5/show/public
    result.rtype  = 'EXERCISE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/(premiers-pas\/reading\/[a-z-]+\/[0-9]+)\/?$/i.exec(path)) !== null) {
    // /premiers-pas/reading/sentence-completion/672
    result.rtype  = 'EXERCISE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
