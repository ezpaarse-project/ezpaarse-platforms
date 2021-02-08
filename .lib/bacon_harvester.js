/* eslint global-require:0 */
'use strict';

const fs      = require('fs');
const path    = require('path');
const request = require('request');
const Listr   = require('listr');

/**
 * Download the packages of a platform, given its root directory
 * @param {String} platformDir platform root directory
 */
exports.downloadPackages = function (platformDir) {
  if (!platformDir) {
    console.error('no platform directory given');
    process.exit(1);
  }

  const { bacon } = require(path.resolve(platformDir, 'manifest.json'));
  const baconProvider = bacon && bacon.provider;

  if (typeof baconProvider !== 'string' && !Array.isArray(baconProvider)) {
    return console.log('no bacon provider in the manifest');
  }

  const providers = new Set(Array.isArray(baconProvider) ? baconProvider : [baconProvider]);

  const tasks = [
    {
      title: 'Fetch Bacon packages list',
      task (ctx) {
        return fetchPackagesList().then(list => {
          list = list.filter(pkg => providers.has(pkg.provider));

          if (Array.isArray(bacon.matches)) {
            let regs = bacon.matches.map(match => new RegExp(match, 'i'));
            list = list.filter(pkg => regs.some(reg => reg.test(pkg.package)));
          }

          ctx.list = list;
        });
      }
    },
    {
      title: 'Check PKB folder',
      task (ctx) {
        return makeDir(path.resolve(platformDir, 'pkb'));
      }
    },
    {
      title: 'Download packages',
      task (ctx) {
        const downloadTasks = ctx.list.map(pkg => {
          const file = path.resolve(platformDir, 'pkb', `${pkg.package_id}.txt`);

          return {
            title: pkg.package_id,
            skip () {
              return fileExists(file).then(exists => {
                return exists && 'Package already exists';
              });
            },
            task () {
              return downloadPackage(pkg.package_id, file);
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
};

/**
 * Fetch the list of all packages
 */
function fetchPackagesList () {
  return new Promise((resolve, reject) => {
    request.get('https://bacon.abes.fr/list.json', (err, res, body) => {
      if (err) { return reject(err); }

      let list;
      try {
        list = JSON.parse(body).bacon.query.results;
      } catch (e) {
        return reject(e);
      }

      resolve(list.map(pkg => pkg.element));
    });
  });
}

/**
 * Download a package
 * @param {Object} packageId  bacon package information
 * @param {String} dest destination directorylist
 */
function downloadPackage(packageId, dest) {
  return new Promise((resolve, reject) => {
    request.get(`https://bacon.abes.fr/package2kbart/${packageId}.txt`)
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

/**
 * Create a directory
 * @param {String} dir path of the directory
 */
function makeDir(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err && err.code !== 'EEXIST') { return reject(err); }
      resolve();
    });
  });
}

/**
 * Check that a file exists
 * @param {String} file path of the file
 */
function fileExists(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stat) => {
      if (err && err.code !== 'ENOENT') { return reject(err); }
      resolve(!!stat);
    });
  });
}
