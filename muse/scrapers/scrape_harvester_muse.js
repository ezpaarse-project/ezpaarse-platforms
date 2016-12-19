#!/usr/bin/env node

'use strict';

var path  = require('path');
var bacon = require(path.join(__dirname, '../../.lib/bacon_harvester.js'));

bacon.generatePkb('muse', function (err, res) {
  if (err) { throw err; }
  console.log('finished processing');
});
