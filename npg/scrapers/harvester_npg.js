#!/usr/bin/env node

'use strict';

var bacon  = require('../../.lib/bacon_harvester.js');



bacon.generatePkb('npg', function  (err,res) {

	if(err) {
		console.error(err);
	}

	console.log(res);
	// body...
});