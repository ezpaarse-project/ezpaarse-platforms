/*global describe, it*/
/*eslint global-require:0, no-sync:0*/
'use strict';

const fs        = require('fs');
const Papa      = require('papaparse');
const path      = require('path');
const assert    = require('assert');
const table     = require('table').table;

const platformsDir = path.resolve(__dirname, '../..');

let platforms;

if (process.env.EZPAARSE_PLATFORM_TO_TEST) {
  platforms = process.env.EZPAARSE_PLATFORM_TO_TEST.split(/\s+/);
} else {
  platforms = fs.readdirSync(platformsDir);
}

platforms
  .filter(item => !item.startsWith('.'))
  .map(item => path.resolve(platformsDir, item))
  .filter(item => fs.statSync(item).isDirectory())
  .forEach(platform => {

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(path.resolve(platform, 'manifest.json')));
    } catch (e) {
      manifest = e;
    }

    let parser;
    try {
      parser = require(path.resolve(platform, 'parser.js'));
      parser.debugMode(true);
    } catch (e) {
      return new Error(e);
    }

    describe(manifest && manifest.longname || path.basename(platform), () => {
      extractTestData(path.resolve(platform, 'test'), (err, testData) => {
        testData.forEach((record) => {
          it(`Test ${record.in.url}`, (done) => {
            assert(record.in.url, 'some entries in the test file have no URL');

            const parsed   = parser.execute(record.in);
            const allProps = Array.from(new Set(Object.keys(parsed).concat(Object.keys(record.out))));
            const equal    = allProps.every(p => {
              const expected = record.out[p];
              let actual = parsed[p];

              if (actual === false || actual === 0 || (actual && typeof actual.toString === 'function')) {
                // Stringify parser result so that we can compare them with CSV values which are all strings
                actual = actual.toString();
              }

              return expected === actual;
            });

            if (equal) { return done(); }

            let errMsg = 'Result does not match';

            /**
             * Input props
             */
            errMsg += '\n\nInput\n----------';

            for (const p in record.in) {
              errMsg += `\n${p}: ${record.in[p]}`;
            }

            /**
             * Result Table
             */
            const rows = [['Property', 'Expected', 'Actual', 'Test']];

            allProps.forEach(p => {
              rows.push([p, record.out[p], parsed[p], record.out[p] === parsed[p] ? 'OK' : 'FAIL']);
            });


            errMsg += '\n\n';
            errMsg += table(rows, {
              columns: {
                0: { width: 15 },
                1: { width: 25 },
                2: { width: 25 },
                3: { width: 4 },
              }
            });

            return done(new Error(errMsg));
          });
        });
      });
    });
  });

/**
 * Takes a test directory and extracts parse the CSV files
 * @param  {String}   testDir  test directory
 * @param  {Function} callback(err, records)
 */
function extractTestData(testDir, callback) {
  const files = fs.readdirSync(testDir);

  const testData = [];
  for (let i = 0; i < files.length; i += 1) {
    if (!files[i].endsWith('.csv')) { continue; }

    const csvContent = fs.readFileSync(path.resolve(testDir, files[i]), 'utf8');

    const { data } = Papa.parse(csvContent, {
      delimiter: ';',
      skipEmptyLines: true,
      header: true,
    });

    data.forEach((line) => {
      const set = { in: {}, out: {} };

      Object.entries(line).forEach(([prop, value]) => {
        const propName = prop.trim();

        if (value.length === 0) { return; }
        if (propName.startsWith('in-'))       { set.in[propName.substr(3)]  = value; }
        else if (propName.startsWith('out-')) { set.out[propName.substr(4)] = value; }
      });

      testData.push(set);
    });
  }

  return callback(null, testData);
}
