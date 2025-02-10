#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform elDial.com
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

  if (/^\/nuevo\/nuevo_diseno\/(v|V)2\/fallo1\.asp$/i.test(path) && param.id != null) {
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/fallo1.asp?id=62739&base=14&referencia=1&Total_registros2_1=5718&buscar=retiro&resaltar=retiro,retira,retiraba,retiraban,retirada,retiradas,retirado,retirados,retiran,retirando,retirandola,retir%C3%A1ndola,retirandolo,retir%C3%A1ndolo,retirandose,retir%C3%A1ndose,retirar,retirara,retiraran,retirare,retiraria,retirar%C3%ADa,retirarla,retirarlas,retirarles,retirarlo,retirarlos,retiraron,retirarse,retirarsela,retir%C3%A1rsela,retirarseles,retir%C3%A1rseles,retirase,retirasen,retire,retiren,retiro,retiros
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/fallo1.asp?id=62648&base=14&referencia=4&Total_registros2_1=5718&buscar=retiro&resaltar=retiro,retira,retiraba,retiraban,retirada,retiradas,retirado,retirados,retiran,retirando,retirandola,retir%C3%A1ndola,retirandolo,retir%C3%A1ndolo,retirandose,retir%C3%A1ndose,retirar,retirara,retiraran,retirare,retiraria,retirar%C3%ADa,retirarla,retirarlas,retirarles,retirarlo,retirarlos,retiraron,retirarse,retirarsela,retir%C3%A1rsela,retirarseles,retir%C3%A1rseles,retirase,retirasen,retire,retiren,retiro,retiros
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if (/^\/nuevo\/nuevo_diseno\/(v|V)2\/doctrina1\.asp$/i.test(path) && param.id != null) {
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/doctrina1.asp?base=50&id=15770&t=d
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/doctrina1.asp?base=50&id=15764&t=d
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if (/^\/nuevo\/nuevo_diseno\/(v|V)2\/ver-archivo-pdf\.asp$/i.test(path) && param.archivo != null) {
    // https://www.eldial.com/nuevo/nuevo_diseno/V2/ver-archivo-pdf.asp?archivo=DC355C.pdf
    // https://www.eldial.com/nuevo/nuevo_diseno/V2/ver-archivo-pdf.asp?archivo=DC3556.pdf
    // https://www.eldial.com/nuevo/nuevo_diseno/V2/ver-archivo-pdf.asp?archivo=aviso_317785.pdf
    // https://www.eldial.com/nuevo/nuevo_diseno/V2/ver-archivo-pdf.asp?archivo=aviso_317421.pdf
    let str = param.archivo.split('.');
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'PDF';
    result.unitid   = str[0];
  } else if ((match = /^\/publicador\/pdf\/([A-Za-z0-9]+)\.docx$/i.exec(path)) != null) {
    // https://www.eldial.com/publicador/pdf/DC355C.docx
    // https://www.eldial.com/publicador/pdf/DC3556.docx
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if (/^\/nuevo\/nuevo_diseno\/(v|V)2\/legislacion1\.asp$/i.test(path) && param.id != null && param.fecha_publicar != null) {
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/legislacion1.asp?base=99&id=35725&id_publicar=106077&fecha_publicar=06/12/2024
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/legislacion1.asp?base=99&id=35712&id_publicar=106068&fecha_publicar=27/11/2024
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'HTML';
    result.publication_date = param.fecha_publicar;
    result.unitid   = param.id;
  } else if (/^\/nuevo\/nuevo_diseno\/v2\/interna\.asp$/i.test(path)) {
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/interna.asp?vd=j&publicdial=1&total=1&buscar=Penal
    // https://www.eldial.com/nuevo/nuevo_diseno/v2/interna.asp?vd=j&publicdial=1&total=1&buscar=retiro
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
