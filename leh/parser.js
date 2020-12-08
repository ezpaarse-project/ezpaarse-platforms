#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Learning Express Hub
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/ProductEngine\/LELIndex.html$/i.test(path) == true && parsedUrl.hash.includes('search-results') == true) {
    // https://www.learningexpresshub.com/ProductEngine/LELIndex.html#/collection/learningexpresslibrary/search-results/ACT/0
    // https://www.learningexpresshub.com/ProductEngine/LELIndex.html#/collection/learningexpresslibrary/search-results/SAT%2520Subject/0
    // https://www.learningexpresshub.com/ProductEngine/LELIndex.html#/ohio-means-jobs/search-results/Math/0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/ProductEngine\/LELIndex.html$/i.test(path) == true && parsedUrl.hash.includes('resources') == true) {
    // https://www.learningexpresshub.com/ProductEngine/LELIndex.html#/ohio-means-jobs/resources/college-test-preparation/advanced-placement-preparation/ap-french-language-and-culture-test-study-guidance
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/productengine\/player\/index.html$/i.test(path) == true || /^\/productengine\/index.html$/i.test(path) == true) {
    // https://www.learningexpresshub.com/productengine/player/index.html#/testEngine/startTest/ae55ea3c-239c-11eb-bd69-123a238c2c8d/yes/be9a6a52-433b-42ad-8a59-3febdfe4e18b/yes/ohio-means-jobs
    // https://www.learningexpresshub.com/productengine/player/index.html#/testEngine/startTest/46da6440-239d-11eb-91ba-123a238c2c8d/yes/5e522ddc-7011-4edc-96f9-8097af207fd7/yes/ohio-means-jobs
    // https://www.learningexpresshub.com/productengine/index.html#/startCourse/64b58e6d-9dc2-4aac-9405-b1e41a7d0453/ohio-means-jobs
    result.rtype    = 'EXERCISE';
    result.mime     = 'HTML';
  }

  return result;
});
