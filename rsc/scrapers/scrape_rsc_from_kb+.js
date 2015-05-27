#!/usr/bin/env node


'use strict';


var request = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});
var path    = require('path');
var XLS     = require('xlsjs');
var cheerio = require('cheerio');
//var PkbRows = require('../../.lib/pkbrows.js');

var filePath = path.join(__dirname, '../pkb', 'kbplus_pkg_1382.xls');
var xls      = XLS.readFile(filePath);
var PkbRows  = require('../../.lib/pkbrows.js');
var pkb      = new PkbRows('rsc');
pkb.setKbartName();

var json;
var match;

 for (var i = 0, j = xls.SheetNames.length; i < j; i++) {
    
    var sheet = xls.Sheets[xls.SheetNames[i]];
    json = XLS.utils.sheet_to_row_object_array(sheet);
    if (json.length > 0) { break; }
  }


  if (json.length === 0) {
    console.error('No data found in the Excel file');
    process.exit(1);
  }
  var url = "http://pubs.rsc.org/en/journals/getatozresult?key=title&value=current";
  request.get(url, function (err, res, body) {
    var $     = cheerio.load(body);
    json.forEach(function (row) {
      var kbartRow = pkb.initRow({});
 
      $('a.jLink').each(function () {
      
        var datas = $(this).text();
    
        if (datas.match(row['publication_title'])) {
         var href = $(this).attr('href');
          match = /\/([a-z]+)$/.exec(href);
          kbartRow.title_url = row['title_url'];
          row['title_id']=match[1];
          kbartRow.title_id  = match[1];
          kbartRow.publication_title = row['publication_title'];
          kbartRow.print_identifier = row['print_identifier'];
          kbartRow.online_identifier = row['online_identifier'];
          kbartRow.date_first_issue_online =row['date_first_issue_online'];
          kbartRow.num_first_vol_onlinel = row['num_first_vol_onlinel'];
          kbartRow.date_last_issue_online = row['date_last_issue_online'];
          kbartRow.num_last_vol_online = row['num_last_vol_online'];
          kbartRow.num_last_issue_online = row['num_last_issue_online'];
          
          kbartRow.coverage_depth = row['coverage_depth'];
          kbartRow.coverage_notes = row['coverage_notes'];
          pkb.addRow(kbartRow);
        }
        
      });
    });
  pkb.writeKbart();
  });





 











