#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ficesa
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/sites\/default\/files\/eu\/([a-z_]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.fac-ficesa.com/sites/default/files/eu/EUWhoiswho_EP_ES.pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if (/^\/admin\/consultas\/listado-por-nombre-xlsx$/i.test(path)) {
    // https://www.fac-ficesa.com/admin/consultas/listado-por-nombre-xlsx?combine=Hern%C3%A1ndez&type_1%5B0%5D=person&field_relation_honorific_tid=All&field_boe_value=&field_first_name_value=&field_fecha_nombramiento_value%5Bmin%5D%5Bdate%5D=&field_fecha_nombramiento_value%5Bmax%5D%5Bdate%5D=&field_last_name_value=&title=&title_1=&field_address_line1_value=&field_city_value=&field_provincia_tid=All&field_region_tid=All&field_country_tid=All&field_postal_code_value=&nid=&sort_by=field_first_name_value&sort_order=ASC
    result.rtype = 'RECORD';
    result.mime = 'XLS';
    result.unitid = param.combine;
  } else if (/^\/admin\/consultas\/listado-por-cargo-xlsx$/i.test(path)) {
    // https://www.fac-ficesa-com/admin/consultas/listado-por-cargo-xlsx?combine=Hern%C3%A1ndez&type_1%5B0%5D=person&field_relation_honorific_tid=All&field_boe_value=&field_first_name_value=&field_fecha_nombramiento_value%5Bmin%5D%5Bdate%5D=&field_fecha_nombramiento_value%5Bmax%5D%5Bdate%5D=&field_last_name_value=&title=&title_1=&field_address_line1_value=&field_city_value=&field_provincia_tid=All&field_region_tid=All&field_country_tid=All&field_postal_code_value=&nid=&sort_by=field_first_name_value&sort_order=ASC
    result.rtype = 'TABLE';
    result.mime = 'XLS';
    result.unitid = param.combine;
  } else if ((match = /^\/node\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.fac-ficesa.com/node/61958
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/admin\/consultas\/listado-por-nombre-pdf$/i.test(path)) {
    // https://www.fac-ficesa.com/admin/consultas/listado-por-nombre-pdf?combine=Hern%C3%A1ndez&type_1%5B0%5D=person&field_relation_honorific_tid=All&field_boe_value=&field_first_name_value=&field_fecha_nombramiento_value%5Bmin%5D%5Bdate%5D=&field_fecha_nombramiento_value%5Bmax%5D%5Bdate%5D=&field_last_name_value=&title=&title_1=&field_address_line1_value=&field_city_value=&field_provincia_tid=All&field_region_tid=All&field_country_tid=All&field_postal_code_value=&nid=&sort_by=field_first_name_value&sort_order=ASC
    result.rtype = 'RECORD';
    result.mime = 'PDF';
    result.unitid = param.combine;
  } else if (/^\/admin\/consultas\/general$/i.test(path)) {
    // https://www.fac-ficesa.com/admin/consultas/general?combine=Administraci%C3%B3n&field_relation_honorific_tid=All&field_boe_value=&field_first_name_value=&field_fecha_nombramiento_value%5Bmin%5D%5Bdate%5D=&field_fecha_nombramiento_value%5Bmax%5D%5Bdate%5D=&field_last_name_value=&title=&title_1=&field_address_line1_value=&field_city_value=&field_provincia_tid=All&field_region_tid=All&field_country_tid=All&field_postal_code_value=&nid=&sort_by=field_first_name_value&sort_by=field_first_name_value&sort_order=ASC&sort_order=ASC
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
