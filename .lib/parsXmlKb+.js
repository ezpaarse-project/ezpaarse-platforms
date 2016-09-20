'use strict';

const path    = require('path');
const csv     = require('csv');
const request = require('request');
const PkbRows = require('./pkbrows.js');

exports.generatePkbKbp = function (packageID, platformName, packageName, rowModifier) {

  if (typeof rowModifier !== 'function' && rowModifier !== null) {
    // eslint-disable-next-line global-require
    const parser = require(path.resolve('../..', platformName, 'parser'));
    rowModifier = function (row) {
      if (!row.title_id && row.title_url) {
        const ec = parser.execute({ url: row.title_url});
        if (ec && ec.title_id) { row.title_id = ec.title_id; }
      }
      return row;
    };
  }

  const pkb = new PkbRows(platformName);
  pkb.packageName = packageName;
  pkb.setKbartName();

  const opt = {
    url: `http://www.kbplus.ac.uk/kbplus/publicExport/pkg/${packageID}`,
    qs: { format: 'xml', transformId: 'kbart2' }
  };

  const csvParser = csv.parse({
    'delimiter': '\t',
    'columns': true,
    'relax_column_count': true
  });

  request.get(opt).pipe(csvParser);

  csvParser.on('readable', () => {
    let record;
    while ((record = csvParser.read())) {
      const kbartRow = pkb.initRow(record);
      pkb.addRow(rowModifier(kbartRow));
    }
  });

  csvParser.on('finish', () => {
    pkb.writeKbart(err => {
      if (err) { throw err; }
      console.log('PKB %s generated', pkb.kbartFileName);
    });
  });
};
