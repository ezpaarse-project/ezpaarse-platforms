'use strict';

/*
* CLI platform initializer
* Creates a platform directory with basic files
*/

const fs       = require('fs');
const path     = require('path');
const co       = require('co');
const URL      = require('url');
const moment   = require('moment');
const request  = require('request');
const inquirer = require('inquirer');
const Listr    = require('listr');

const platformsDir = path.resolve(__dirname, '..');
const skeletonFile = path.resolve(__dirname, '..', 'js-parser-skeleton/parser.js');

co(function* () {
  const { docurl, docid } = yield askForAnalysisURL();
  const remoteData = docid ? yield fetchRemoteData(docid) : {};

  const manifest   = yield askForGeneralInfo(remoteData.cardInfo);
  manifest.docurl  = docurl;
  manifest.domains = yield co(askForDomains(remoteData.analyses));

  initializeParser(manifest, remoteData.analyses);
});

/**
 * Generate the structure
 */
function initializeParser (manifest, remoteAnalyses) {
  console.log();
  console.log('Ready... go!');
  console.log();

  const rootDir = path.resolve(__dirname, '..', manifest.name);

  const tasks = new Listr([
    {
      title: 'Create root directory',
      task () { return createDirectory(rootDir); }
    },
    {
      title: 'Create test directory',
      task () { return createDirectory(path.resolve(rootDir, 'test')); }
    },
    {
      title: 'Create pkb directory',
      task () { return createDirectory(path.resolve(rootDir, 'pkb')); }
    },
    {
      title: 'Create scrapers directory',
      task () { return createDirectory(path.resolve(rootDir, 'scrapers')); }
    },
    {
      title: 'Create manifest.json',
      task () { return createManifest(rootDir, manifest); }
    },
    {
      title: 'Create parser.js',
      task () { return createSkeleton(rootDir, manifest); }
    },
    {
      title: 'Create test file',
      task () { return createTestFile(rootDir, manifest, remoteAnalyses); }
    },
  ]);

  tasks.run().then(() => {
    console.log();
    console.log(`Parser generated at ${rootDir}`);
  }).catch(err => {
    console.error();
    console.error('An error occurred during the initialization');
    process.exit(1);
  });
}

/**
 * Ask for the analysis URL and try to figure out the ID
 */
function askForAnalysisURL () {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'docurl',
      message: 'What\'s the URL of the analysis?'
    },
    {
      type: 'input',
      name: 'docid',
      message: 'Confirm analysis ID',
      default (answers) {
        const match = /\/([a-z0-9]{24})/.exec(answers.docurl);
        return match && match[1];
      },
      when (answers) {
        return /\/platforms\/[a-z0-9]{24}/.test(answers.docurl);
      }
    }
  ]);
}

/**
 * Ask for generic informations
 * @param {Object} cardInfo data extracted from the Trello card
 */
function askForGeneralInfo (cardInfo = {}) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'longname',
      message: 'What\'s the full name of the platform?',
      default () { return cardInfo.longname; }
    },
    {
      type: 'input',
      name: 'name',
      message: 'What\'s the abbreviated name of the platform?',
      default () { return cardInfo.name; },
      validate (name) {
        if (!name) {
          return 'Please enter a name';
        }

        if (!/^[a-z0-9-]+$/i.test(name)) {
          return 'Name should only contain letters, digits and hyphens';
        }

        return new Promise((resolve, reject) => {
          fs.stat(path.resolve(platformsDir, name), err => {
            if (err && err.code === 'ENOENT') { return resolve(true); }

            reject(err || `${name} already exists`);
          });
        });
      }
    },
    {
      type: 'input',
      name: 'describe',
      message: 'How would you describe this parser?',
      default (answers) {
        return `Recognizes the accesses to the platform ${answers.longname}`;
      }
    },
    {
      type: 'input',
      name: 'contact',
      message: 'Who\'s the contact for this parser?',
      default () { return cardInfo.contact; }
    },
    {
      type: 'confirm',
      name: 'pkb',
      default: false,
      message: 'Does it have a knowledge base?'
    },
    {
      type: 'input',
      name: 'pkb-domains',
      message: 'If domains are taken from the knowledge base, which column contains them?',
      when (answers) {
        return answers.pkb;
      }
    },
  ]);
}

/**
 * Ask for supported domains
 */
function* askForDomains (remoteAnalyses) {
  console.log();
  console.log('Now we are going to list the fully qualified domain names that should be handled by the parser.');
  console.log('(eg. www.example.org, test.example.org, etc...)');
  console.log('(in addition to those found in the knowledge base)');
  console.log();

  const domains = new Set();

  if (remoteAnalyses) {
    const remoteDomains = new Set(remoteAnalyses.filter(a => a.url)
                                                .map(a => URL.parse(a.url).hostname)
                                                .filter(host => host));
    if (remoteDomains.size > 0) {
      console.log('The following domain names were extracted from the remote analysis.');
      console.log();
      const confirmedDomains = yield confirmDomains(Array.from(remoteDomains));
      confirmedDomains.forEach(d => domains.add(d));
      console.log();
      console.log('If some domains are missing, enter them now.');
    }
  }

  console.log('(empty answer to stop)');

  let domain;
  while ((domain = yield askForDomain())) {
    domains.add(domain);
  }

  return Array.from(domains);
}

/**
 * Ask for a domain
 */
function askForDomain () {
  return inquirer.prompt([{
    type: 'input',
    name: 'domain',
    message: 'Enter a domain name'
  }]).then(answers => answers.domain);
}

function confirmDomains (domains) {
  return inquirer.prompt([{
    type: 'checkbox',
    name: 'domains',
    message: 'Check the domains that should be handled',
    choices: domains,
    default: domains
  }]).then(answers => answers.domains);
}

/**
 * Fetch data from Trello and ANG
 */
function fetchRemoteData (docid) {
  const remoteData = {};

  const tasks = new Listr([
    {
      title: 'Fetch data from Trello',
      task () {
        return fetchTrelloCard(docid).then(trelloCard => {
          const match = /^(.*?)(?:\[(.*?)\])?$/.exec(trelloCard.name);

          if (match) {
            remoteData.cardInfo = {
              name: (match[2] || '').trim().toLocaleLowerCase(),
              longname: match[1].trim(),
              contact: (trelloCard.members || []).map(m => m.fullName).join(', ')
            };
          }
        });
      }
    },
    {
      title: 'Fetch analyses from ANG',
      task () {
        return fetchRemoteAnalyses(docid).then(analyses => {
          remoteData.analyses = analyses;
        });
      }
    },
  ], {
    concurrent: true,
    exitOnError: false
  });

  return tasks.run()
    .then(() => remoteData)
    .catch(() => remoteData);
}

/**
 * Get an analysis from ANG with the ID of a Trello card
 */
function fetchRemoteAnalyses (cardID) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `http://ang.couperin.org/api/platforms/${cardID}/analyses`,
      json: true
    };

    request.get(options, (err, res, body) => {
      if (err) { return reject(err); }
      if (res.statusCode !== 200) {
        return reject(new Error(`Got code ${res.statusCode}`));
      }
      if (typeof body !== 'object') {
        return reject(new Error('Invalid response'));
      }
      resolve(body);
    });
  });
}

/**
 * Get Trello card from its ID
 */
function fetchTrelloCard (cardID) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `http://api.trello.com/1/cards/${cardID}?members=true`,
      json: true,
      headers: { 'user-agent': 'node' }
    };

    request.get(options, (err, res, body) => {
      if (err) { return reject(err); }
      if (res.statusCode !== 200) {
        return reject(new Error(`Got code ${res.statusCode}`));
      }
      if (typeof body !== 'object') {
        return reject(new Error('Invalid response'));
      }
      resolve(body);
    });
  });
}

/**
 * Create a directory
 */
function createDirectory (dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) { return reject(err); }
      resolve();
    });
  });
}

/**
 * Create the manifest
 */
function createManifest(rootDir, manifest) {
  const manifestFile = path.resolve(rootDir, 'manifest.json');

  manifest.version = moment().format('YYYY-MM-DD');
  manifest.status  = 'beta';

  return new Promise((resolve, reject) => {
    fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2), function (err) {
      if (err) { return reject(new Error(`could not create ${manifestFile}`)); }
      resolve();
    });
  });
}

/**
 * Create the parser skeleton
 */
function createSkeleton(rootDir, manifest) {
  const parserPath = path.resolve(rootDir, 'parser.js');

  return new Promise((resolve, reject) => {
    fs.readFile(skeletonFile, function (err, skeleton) {
      if (err) { return reject(new Error(`could not read ${skeletonFile}`)); }

      skeleton = skeleton.toString().replace('[description-goes-here]', manifest.describe);

      fs.writeFile(parserPath, skeleton, { mode: parseInt('775', 8) }, function (err) {
        if (err) { return reject(new Error(`could not create ${parserPath}`)); }
        resolve();
      });
    });
  });
}

/**
 * Create an empty test file, or generate it with the existing analyses
 */
function createTestFile(rootDir, manifest, remoteAnalyses) {
  const filename     = `${manifest.name}.${manifest.version}.csv`;
  const testFilePath = path.resolve(rootDir, 'test', filename);

  const csv = remoteAnalyses ? generateCSV(remoteAnalyses) : 'out-rtype;out-mime;in-url';

  return new Promise((resolve, reject) => {
    fs.writeFile(testFilePath, csv, function (err) {
      if (err) { return reject(new Error(`could not create ${testFilePath}`)); }
      resolve();
    });
  });
}

/**
 * Generate a CSV string from analyses
 */
function generateCSV (analyses) {
  const columns = [
    { title: 'out-unitid', getter (a) { return a.unitid; } },
    { title: 'out-rtype', getter (a) { return a.rtype; } },
    { title: 'out-mime', getter (a) { return a.mime; } },
    { title: 'in-url', getter (a) { return a.url; } }
  ];

  // Add a column for each identifier
  analyses.forEach(analysis => {
    if (!analysis.identifiers) { return; }

    analysis.identifiers.forEach(id => {
      if (!id.type) { return; }
      if (columns.find(c => c.title === `out-${id.type}`)) { return; }

      columns.unshift({
        title: `out-${id.type}`,
        getter (a) {
          if (a.identifiers) {
            const identifier = a.identifiers.find(i => i.type === id.type);
            return identifier && identifier.value;
          }
        }
      });
    });
  });

  const header = columns.map(col => escapeCSVstring(col.title)).join(';');
  const lines = analyses.map(analysis => {
    return columns.map(col => escapeCSVstring(col.getter(analysis))).join(';');
  }).join('\n');

  return `${header}\n${lines}`;
}

/**
 * Escape a string so that it can be inserted in a CSV
 */
function escapeCSVstring (str) {
  if (/[";]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str || '';
}