/* eslint global-require:0 */
'use strict';

const fs      = require('fs');
const path    = require('path');
const co      = require('co');
const request = require('request');

/**
 * Download the packages of a platform, given its root directory
 * @param {String} platformDir platform root directory
 */
exports.downloadPackages = co.wrap(function* (platformDir) {
  if (!platformDir) { return Promise.reject(new Error('no platform directory given')); }

  const { bacon } = require(path.resolve(platformDir, 'manifest.json'));

  if (!bacon || !bacon.provider) {
    console.log('no bacon provider in the manifest');
    return Promise.resolve();
  }

  let list = yield exports.fetchPackagesList();

  list = list.filter(pkg => pkg.provider === bacon.provider);

  if (bacon.filter) {
    let reg = new RegExp(bacon.filter, 'i');
    list = list.filter(pkg => reg.test(pkg.package));
  }

  for (const { package_id } of list) {
    const file = path.resolve(platformDir, 'pkb', `${package_id}.txt`);

    if (yield fileExists(file)) {
      console.log(`  [No changes]  ${package_id}`);
    } else {
      console.log(`  [Downloading] ${package_id}`);
      yield downloadPackage(package_id, file);
    }
  }
});

/**
 * Fetch the list of all packages
 */
exports.fetchPackagesList = function () {
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
};

/**
 * Download a package
 * @param {Object} packageId  bacon package information
 * @param {String} dest destination directorylist
 */
function downloadPackage(packageId, dest) {
  return new Promise((resolve, reject) => {
    request.get(`https://bacon.abes.fr/package2kbart/${packageId}`)
      .pipe(fs.createWriteStream(dest))
      .on('error', reject)
      .on('finish', resolve);
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
