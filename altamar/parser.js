#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Altamar
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/recursoc2\/([a-zA-Z0-9]+)$/i.exec(path)) !== null && param.centeruid !== undefined) {
    // https://www.recursos.altamar.es/recursoc2/59fe7b9e3ce243acf7f7484b445a437f?centeruid=ec32beb6502ad101b634ad8b70b5030d2173b436632fd88b6553d6630f3b0957
    // https://www.recursos.altamar.es/recursoc2/e6be2fc9b14e6faaf4b6f083ac4266c4?centeruid=ec32beb6502ad101b634ad8b70b5030d2173b436632fd88b6553d6630f3b0957
    // https://www.recursos.altamar.es/recursoc2/e2e513c8f820342f85164c67330ed48e?centeruid=ec32beb6502ad101b634ad8b70b5030d2173b436632fd88b6553d6630f3b0957
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = param.centeruid;
  } else if ((match = /^\/catalogos\/listado\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.altamar.es/catalogos/listado/CFGM-Actividades-ecuestres-230
    // https://www.altamar.es/catalogos/listado/CFGM-Cocina-y-gastronomia-239
    // https://www.altamar.es/catalogos/listado/CFGM-Instalaciones-Electricas-y-Automaticas-62
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
