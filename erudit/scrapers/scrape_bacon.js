#!/usr/bin/env node
'use strict';

const { resolve }  = require('path');
const { downloadPackages } = require('../../.lib/bacon_harvester.js');

downloadPackages(resolve(__dirname, '..'));