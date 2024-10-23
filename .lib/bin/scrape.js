'use strict';

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const pkbClean = require('../pkb-cleaner.js');
const yargsParser = require('yargs/yargs');

const platformsDir = path.resolve(__dirname, '..', '..');

/**
 * Execute the scrapers of one or more platforms
 */
async function scrape() {
  const yargs = yargsParser(process.argv.slice(2))
    .usage('Execute the scrapers of one or more platforms' +
            '\nUsage: $0 [-alvfc] [Platform] [Platform] ...')
    .alias('help', 'h')
    .alias('all', 'a')
    .alias('pattern', 'p')
    .alias('list', 'l')
    .alias('clean', 'c')
    .alias('force', 'f')
    .alias('verbose', 'v')
    .string('pattern')
    .default('pattern', '^scrape_')
    .boolean(['all', 'list', 'clean', 'force', 'verbose'])
    .describe('all', 'Execute all scrapers.')
    .describe('pattern', 'Only execute scrapers whose name matches the given pattern.')
    .describe('list', 'Only list scrapers without executing them.')
    .describe('clean', 'Clean PKB files when all scrapers has been executed.')
    .describe('force', 'Overwrite PKB files if they already exist.')
    .describe('verbose', 'Print scrapers output into the console.');

  const argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help || (!argv.all && !argv._.length)) {
    yargs.showHelp();
    process.exit(0);
  }

  const platforms = new Set(argv._);
  const filePattern = new RegExp(argv.pattern);
  let executed  = 0;

  const entries = await fs.readdir(platformsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) { continue; }
    if (entry.name.startsWith('.')) { continue; }
    if (!argv.all && !platforms.has(entry.name)) { continue; }

    const dirname = entry.name;
    const manifestPath = path.resolve(platformsDir, dirname, 'manifest.json');
    const scrapersDir = path.resolve(platformsDir, dirname, 'scrapers');
    const pkbDir = path.resolve(platformsDir, dirname, 'pkb');

    let manifest;
    try {
      manifest = await fs.readJson(manifestPath);
    } catch (e) {
      if (e.code !== 'ENOENT') { throw e; }
      continue;
    }

    let filenames;
    try {
      filenames = await fs.readdir(scrapersDir);
    } catch (e) {
      if (e.code !== 'ENOENT') { throw e; }
      filenames = [];
    }

    const scrapers = filenames.filter((filename) => filePattern.test(filename));

    if (scrapers.length === 0 && argv.all) {
      continue;
    }

    console.log(`[${dirname}] ${manifest.longname}`);

    for (const scraper of scrapers) {
      console.log(`  - ${scraper}`);
      if (argv.list) { continue; }

      const args = [];
      if (argv.force) { args.push('--force'); }

      const scraperFile = path.resolve(scrapersDir, scraper);
      const child = spawn(scraperFile, args, {
        stdio: argv.verbose ? 'inherit' : 'ignore'
      });

      await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('close', resolve);
      });

      executed++;
    }

    if (argv.clean) {
      console.log('  Cleaning PKB files...');
      const cleanResults = new Map();

      await pkbClean({
        dir: pkbDir,
        rewrite: true,
        onMissingId(file) {
          cleanResults.get(file.name).missing += 1;
        },
        onDuplicate(file, titleId, line) {
          cleanResults.get(file.name).duplicates += 1;
        },
        onFile(file) {
          cleanResults.set(file.name, { missing: 0, duplicates: 0 });
        }
      });

      for (const [filename, { missing, duplicates }] of cleanResults) {
        console.log(`  - ${filename} (${missing} missing, ${duplicates} duplicates)`);
      }
    }
  }

  return { executed };
}

scrape()
  .then(({ executed }) => {
    console.log(`Executed ${executed} scrapers.`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
