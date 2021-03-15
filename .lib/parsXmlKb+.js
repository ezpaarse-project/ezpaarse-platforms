'use strict';

const path    = require('path');
const csv     = require('csvtojson');
const request = require('request');
const KBart   = require('./kbart.js');

exports.generatePkbKbp = function (packageID, platformName, packageName, rowModifier) {

  if (typeof rowModifier !== 'function' && rowModifier !== null) {
    // eslint-disable-next-line global-require
    const parser = require(path.resolve(__dirname, '..', platformName, 'parser'));

    rowModifier = function (row) {
      if (!row.title_id && row.title_url) {
        const ec = parser.execute({ url: row.title_url });
        if (ec && ec.title_id) { row.title_id = ec.title_id; }
      }
      return row;
    };
  }

  const kbart = new KBart({
    directory: path.resolve(__dirname, '..', platformName, 'pkb'),
    provider: platformName,
    package: packageName
  });

  const opt = {
    url: `http://www.kbplus.ac.uk/kbplus/publicExport/pkg/${packageID}`,
    qs: { format: 'xml', transformId: 'kbart2' }
  };

  const parser = csv({ delimiter: '\t' }).fromStream(request.get(opt));

  parser.on('json', (row) => {
    const result = kbart.add(rowModifier(row));

    if (result instanceof Error) {
      console.error(`Error: ${result}`);
    }
  });

  parser.on('end', () => {
    kbart.save().then(() => kbart.summarize());
  });
};
