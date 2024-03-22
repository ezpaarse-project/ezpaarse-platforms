#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Medica Panamericana
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

  if (/^\/digital\/ebooks\/buscador$/i.test(path)) {
    // https://www.medicapanamericana.com/digital/ebooks/buscador#%7B%24%7Cebook%22%2C%3C%25%24%25%7B%40%25%7B%7C%25417565%2C%25%7Cnucle%C3%B3nica%22%2C%26%7Cnucle%C3%B3nica%22%2C%26%25true%2C%22DtmDefinition%22%3A%22%5Cn%3Cspan%20id%3D%5C%22lema%5C%22%3E%5Cnnucle%26%23243%3Bnico%2C%20-ca%3C%2Fspan%3E%5Cn%5Cn%5Cn%5Cn%5Cn%3Cp%20class%3D%5C%22acepcion%5C%22%3E%3Cspan%20id%3D%5C%22color%5C%22%3E1%3C%2Fspan%3E%26%238194%3B%5Bingl.%20%3Cstrong%3E%3Ci%3Enucleonic%3C%2Fi%3E%3C%2Fstrong%3E%5D%20adj.%20%20De%20los%20nucleones%20o%20relacionado%20con%20ellos.%3C%2Fp%3E%3Cp%20class%3D%5C%22acepcion%5C%22%3E%3Cspan%20id%3D%5C%22color%5C%22%3E2%3C%2Fspan%3E%26%238194%3B%5Bingl.%20%3Cstrong%3E%3Ci%3Enucleonic%3C%2Fi%3E%3C%2Fstrong%3E%5D%20adj.%20%20De%20la%20f%26%23237%3Bsica%20nuclear%20o%20relacionado%20con%20ella.%3C%2Fp%3E%3Cp%20class%3D%5C%22acepcion%5C%22%3E%3Cspan%20id%3D%5C%22color%5C%22%3E3%3C%2Fspan%3E%26%238194%3Bs.f.%20%3D%20%3Ca%20href%3D%5C%22ver.php%3Fid%3D417570%26cual%3D0%5C%22%3E%3Cspan%20id%3D%5C%22color%5C%22%3Ef%26%23237%3Bsica%20nuclear%3C%2Fspan%3E%3C%2Fa%3E.%3C%2Fp%3E%5Cn%5Cn%5Cn%5Cn%5Cn%5Cn%22%7D%2C%7B%7C%250%2C%25%7Cnuclear%20physics%22%2C%26%7Cnuclear%20physics%22%2C%26%25true%2C%22DtmDefinition%22%3A%22%22%7D%5D%2C%22type%22%3A0%2C%25%7Cf%C3%ADsica%20nuclear%22%2C%22order%22%3A0%7D%5D%2C%22page%22%3A0%2C%22order%22%3A%22relevancia%22%2C%22topicIds%22%3Anull%2C%22authorIds%22%3Anull%2C%22ctyIds%22%3Anull%2C%22pubIds%22%3Anull%2C%22minDate%22%3Anull%2C%22maxDate%22%3Anull%2C%22searchAll%22%3Afalse%7D%7D
    // https://www.medicapanamericana.com/digital/ebooks/buscador#%7B%24%7Cebook%22%2C%3C%25%24%25%7B%40%25%7B%7C%250%2C%25%7Cpiel%22%2C%26%7Cpiel%22%2C%26%25true%2C%22DtmDefinition%22%3A%22%22%7D%2C%7B%7C%250%2C%25%7Cdermatology%22%2C%26%7Cdermatology%22%2C%26%25true%2C%22DtmDefinition%22%3A%22%22%7D%5D%2C%22type%22%3A0%2C%25%7Cdermatolog%C3%ADa%22%2C%22order%22%3A0%7D%5D%2C%22page%22%3A0%2C%22order%22%3A%22relevancia%22%2C%22topicIds%22%3Anull%2C%22authorIds%22%3Anull%2C%22ctyIds%22%3Anull%2C%22pubIds%22%3Anull%2C%22minDate%22%3Anull%2C%22maxDate%22%3Anull%2C%22searchAll%22%3Afalse%7D%7D
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/VisorEbookV2\/Ebook\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.medicapanamericana.com/VisorEbookV2/Ebook/9786079356972?token=c7e0efef-b440-4a1f-b4af-5bba8087be48#{"Pagina":"1","Vista":"Indice","Busqueda":""}
    // https://www.medicapanamericana.com/VisorEbookV2/Ebook/9788491103639?token=b39355fa-1f60-43ba-b863-8fc1e2eedabe#{"Pagina":"1","Vista":"Indice","Busqueda":""}
    let decodedHash = decodeURI(parsedUrl.hash);
    let decodedStr = decodedHash.replace('#', '');

    let decodedObj = {};
    try {
      decodedObj = JSON.parse(decodedStr);
    } catch (e) {
      decodedObj = {};
    }
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.first_page = decodedObj.Pagina;
    result.db_id = match[1];
    result.unitid = param.token;
  } else if ((match = /^\/viewer\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://mieureka.medicapanamericana.com/viewer/comunicacion-clinica/ix
    // https://mieureka.medicapanamericana.com/viewer/emergencias-en-anestesiologia/7
    // https://mieureka-filiales.medicapanamericana.com/viewer/aprendizaje-centrado-en-el-paciente/5
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.first_page = match[2];
    result.title_id = match[1];
    result.unitid = `${match[1]}/${match[2]}`;
  } else if ((parsedUrl.hostname === 'mieureka.medicapanamericana.com' || parsedUrl.hostname === 'mieureka-filiales.medicapanamericana.com') && (path === '/' || path === null)) {
    // https://mieureka.medicapanamericana.com/
    // https://mieureka-filiales.medicapanamericana.com/
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
