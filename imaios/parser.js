#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform e-Anatomy
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

  let match;

  if (/^\/en\/content\/search$/i.test(path)) {
    // https://www.imaios.com:443/en/content/search?SearchText=thyroid
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/en\/e-Anatomy\/(.*)$/i.exec(path)) !== null) {
    // https://www.imaios.com:443/en/e-Anatomy/Anatomical-Parts/10L-11L-Left-hilar-and-interlobar-nodes
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/en\/e-Courses\/(.*)$/i.exec(path)) !== null) {
    // https://www.imaios.com:443/en/e-Courses/e-MRI/MRI-instrumentation-and-MRI-safety
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/en\/vet-Anatomy\/(.*)$/i.exec(path)) !== null) {
    // https://www.imaios.com:443/en/vet-Anatomy/Dog/Canine-elbow-CT
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/en\/e-Cases$/i.test(path)) {
    // https://www.imaios.com:443/en/e-Cases
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/en\/e-Cases\/Channels\/(.*)$/i.exec(path)) !== null) {
    // https://www.imaios.com:443/en/e-Cases/Channels/Radiology/Pediatric-PET-CT-cases/Synovial-sarcoma
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/en\/e-Cases\/Public-channels\/(.*)$/i.exec(path)) !== null) {
    // https://www.imaios.com:443/en/e-Cases/Public-channels/Thorax
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
