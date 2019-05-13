#!/usr/bin/env node

'use strict';

const { lib } = require('../../.lib/utils');

const fs      = lib('fs');
const path    = lib('path');
const moment  = lib('moment');
const request = lib('request');
const Listr   = lib('listr');

const today = moment().format('YYYY-MM-DD');
const pkbDir = path.resolve(__dirname, '..', 'pkb');
const kbartPackages = [
  'IEEEXplore_Global_All-Journals',
  'IEEEXplore_Global_All-Conference-Series',
  'IEEEXplore_Global_All-Conference-Proceedings',
  'IEEEXplore_Global_All-Standards',
  'IEEEXplore_Global_All-eBooks',
  'IEEEXplore_Global_All-Courses'
];

const tasks = [
  {
    title: 'Check PKB directory',
    task () {
      return new Promise((resolve, reject) => {
        fs.mkdir(pkbDir, err => {
          if (err && err.code !== 'EEXIST') { return reject(err); }
          resolve();
        });
      });
    }
  },
  {
    title: 'Download packages',
    task () {
      const downloadTasks = kbartPackages.map(pkg => {
        const file = path.resolve(pkbDir, `${pkg}_${today}.txt`);

        return {
          title: pkg,
          task () {
            return downloadPackage(pkg, file);
          }
        };
      });

      return new Listr(downloadTasks, {
        concurrent: true,
        exitOnError: false
      });
    }
  }
];

const listr = new Listr(tasks, { collapse: false });
listr.run().catch(e => {
  console.error(e.message);
  process.exit(1);
});

/**
 * Download a package
 * @param {Object} packageId  package identifier
 * @param {String} dest destination file
 */
function downloadPackage(packageId, dest) {
  return new Promise((resolve, reject) => {
    request.get(`https://ieeexplore.ieee.org/otherfiles/${packageId}.txt`)
      .on('error', reject)
      .on('response', response => {
        if (response.statusCode !== 200) {
          return reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }

        response.pipe(fs.createWriteStream(dest))
          .on('error', reject)
          .on('finish', resolve);
      });
  });
}
