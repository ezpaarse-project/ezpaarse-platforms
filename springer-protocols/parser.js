#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SpringerProtocols
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/(Abstract|Full|Pdf)\/doi\/([0-9]+\.[0-9]+\/([^/]+))$/i.exec(path)) !== null) {
    // Abstract http://www.springerprotocols.com/Abstract/doi/10.1007/978-1-59259-128-2_1
    // Fulltext HTML  http://www.springerprotocols.com/Full/doi/10.1007/978-1-59259-128-2_1?encCode=T0lCOjFfMi04MjEtOTUyOTUtMS04Nzk=
    // Fulltext PDF	http://www.springerprotocols.com/Pdf/doi/10.1007/978-1-59259-128-2_1?encCode=T0lCOjFfMi04MjEtOTUyOTUtMS04Nzk=

    result.doi    = match[2];
    result.unitid = match[3];

    if (result.unitid) {
      result.online_identifier = result.unitid.split('_')[0];
    }

    switch (match[1]) {
    case 'Abstract':
      // Example: http://www.springerprotocols.com/Abstract/doi/10.1007/978-1-59259-128-2_1
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'Full':
      // Example: http://www.springerprotocols.com/Full/doi/10.1007/978-1-59259-128-2_1
      result.rtype = 'BOOK';
      result.mime  = 'HTML';
      break;
    case 'Pdf':
      // Example: http://www.springerprotocols.com/Pdf/doi/10.1007/978-1-59259-128-2_1?encCode=T0lCOjFfMi04MjEtOTUyOTUtMS04Nzk=
      result.rtype = 'BOOK';
      result.mime  = 'PDF';
      break;
    }
  }

  return result;
});

