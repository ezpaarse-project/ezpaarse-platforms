#!/usr/bin/env node

// ##EZPAARSE

'use strict';
var Lazy = require('lazy');
var URL  = require('url');

var Parser = function (parsingFunction) {
  this.analyse = parsingFunction || function () { return {}; };


  if (!module.parent.parent) {
    var yargs = require('yargs')
      .usage('Parse URLs read from standard input. ' +
        'You can either use pipes or enter URLs manually.' +
        '\n  Usage: $0' +
        '\n  Example: cat urls.txt | $0')
      .boolean('json')
      .alias('json', 'j')
      .describe('json', 'if input lines are stringified JSON objects')
      .boolean('jsonprefix')
      .alias('jsonprefix', 'jp')
      .default('jsonprefix', false)
      .describe('jsonprefix', 'tells that the given json keys are prefixed with "in-" which sould be ignored');
    var argv = yargs.argv;

    // show usage if --help option is used
    if (argv.help || argv.h) {
      yargs.showHelp();
      process.exit(0);
    }

    this.json = argv.json;
    this.jsonprefix  = argv['jsonprefix'];
    this.execute();
  }
};

/*
* If an array of urls is given, return an array of results
* Otherwise, read stdin and write into stdout
*/
Parser.prototype.execute = function (ec) {
  var self = this;

  if (ec) {
    try {
      var url = decodeURIComponent(ec.url);
      return this.analyse(URL.parse(url, true), ec);
    } catch (e) {
      return {};
    }
  } else {
    var lazy = new Lazy(process.stdin);
    lazy.lines
        .map(String)
        .map(function (line) {
          var url;
          var ec = {};

          try {
            if (self.json) {
              ec   = JSON.parse(line);
              if (self.jsonprefix) {
                Object.keys(ec).forEach(function (field) {
                  // remove "in-"
                  if (new RegExp('^in-').test(field)) {
                    var fieldWithoutPrefix = field.slice(3);
                    ec[fieldWithoutPrefix] = ec[field];
                    delete ec[field];
                  }
                });
              }
              line = ec.url;
            }
            url = decodeURIComponent(line);
          } catch (e) {
            process.stdout.write('{}\n');
            return;
          }
          var parsedUrl = URL.parse(url, true);
          process.stdout.write(JSON.stringify(self.analyse(parsedUrl, ec)) + '\n');
        });
    lazy.on('end', function () {
      process.exit(0);
    });
  }
};

module.exports = Parser;