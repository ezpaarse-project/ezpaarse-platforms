#!/usr/bin/env node
'use strict';

const fs      = require('fs');
const path    = require('path');
const request = require('../../.lib/node_modules/request');
const moment  = require('../../.lib/node_modules/moment');

request.get('https://www.openedition.org/index.html?page=coverage&pubtype=revue&export=tsv&kbart=1')
  .on('error', err => {
    console.error(err.message);
    process.exit(1);
  })
  .on('response', response => {
    if (response.statusCode !== 200) {
      console.error(`${response.statusCode} ${response.statusMessage}`);
      process.exit(1);
    }

    const disposition = /filename="(.+?)"/.exec(response.headers['content-disposition']);
    let filename = disposition && disposition[1] && disposition[1].replace(/\.tsv$/i, '.txt');

    if (!filename) {
      const now = moment().format('YYYY-MM-DD');
      filename = `OpenEdition_Global_AllJournals_${now}.txt`;
    }

    response.pipe(fs.createWriteStream(path.resolve(__dirname, '../pkb', filename)))
      .on('error', err => {
        console.error(err.message);
        process.exit(1);
      })
      .on('finish', () => {
        console.log(`Downloaded ${filename}`);
      });
  });