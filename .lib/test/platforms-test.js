/*global describe, it*/
/*eslint global-require:0, no-sync:0*/
'use strict';

const fs        = require('fs');
const path      = require('path');
const assert    = require('assert');
const Converter = require('csvtojson').Converter;

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
    try { manifest = require(path.resolve(platform, 'manifest.json')); }
    catch (e) { manifest = e; }

    describe(manifest && manifest.longname || path.basename(platform), () => {
      it('works', done => {
        if (manifest instanceof Error) { return done(manifest); }

        const testDir = path.resolve(platform, 'test');

        extractTestData(testDir, (err, testData) => {
          if (err) { return done(err); }

          let parser;
          try {
            parser = require(path.resolve(platform, 'parser.js'));
            parser.debugMode(true);
          }
          catch (e) { done(e); }

          for (let i = testData.length - 1; i >= 0; i--) {
            const record = testData[i];
            assert(record.in.url, 'some entries in the test file have no URL');

            const parsed   = parser.execute(record.in);
            const allProps = Object.keys(record.out).concat(Object.keys(parsed));
            const equal    = allProps.every(p => record.out[p] === parsed[p]);

            if (!equal) {
              return done(new Error(`result does not match
            input: ${JSON.stringify(record.in, null, 2)}
            result: ${JSON.stringify(parsed, null, 2)}
            expected: ${JSON.stringify(record.out, null, 2)}`));
            }
          }

          done();
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
  fs.readdir(testDir, (err, files) => {
    if (err) { return callback(err); }

    const testData = [];

    (function convertFile() {
      const file = files.pop();
      if (!file) { return callback(null, testData); }
      if (!file.endsWith('.csv')) { return convertFile(); }

      const csvConverter = new Converter({
        delimiter: ';',
        checkType: false,
        flatKeys: true,
        ignoreEmpty: true
      });

      csvConverter.fromFile(path.resolve(testDir, file), (err, records) => {
        if (err) { return callback(err); }

        records.forEach(record => {
          const set = { in: {}, out: {} };

          for (const prop in record) {
            if (prop.startsWith('in-'))       { set.in[prop.substr(3)]  = record[prop]; }
            else if (prop.startsWith('out-')) { set.out[prop.substr(4)] = record[prop]; }
          }

          if (set.out.hasOwnProperty('_granted')) {
            set.out._granted = set.out._granted === 'true';
          }

          testData.push(set);
        });

        convertFile();
      });
    })();
  });
}
