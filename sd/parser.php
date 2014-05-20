#!/usr/bin/env php
<?php

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * This parser was written as an example and is not up-to-date *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

if (isset($argv[1]) && in_array($argv[1], array('--help', '-help', '-h'))) {
  echo "Parse URLs read from standard input. You can either use pipes or enter URLs manually.
  Usage: $argv[0]
  Example: cat urls.txt | $argv[0]

  Options:
    --json, -j  if input lines are stringified JSON objects\n";
  exit(0);
}

$json = isset($argv[1]) && in_array($argv[1], array('--json', '-j'));

while($line = trim(fgets(STDIN))) {
  $result = Array();
  if ($json) {
    $ec  = json_decode($line, true);
    $url = parse_url($ec['url']);
  } else {
    $url = parse_url($line);
  }
  $param = '';
  if (isset($url['query'])) parse_str($url['query'], $param);

  if (isset($param['_ob']) ) {
    if (isset($param['_cdi'])) {
      $result['cdi'] = $param['_cdi'];
    }
    switch($param['_ob']) {
    case 'IssueURL' :
      // sommaire
      $arg = explode("#", $param['_tockey']);
      // l'identifiant est le 2 param du _tockey separé par des #
      $result['title_id'] = $arg[2];
      $result['rtype']    = 'TOC';
      $result['mime']     = 'MISC';
      break;
    case 'ArticleURL' :
      // resume ou full text
      if (isset($param['_fmt']))
      {
        switch($param['_fmt']) {
        case 'summary' :
          $result['rtype'] = 'ABS';
          $result['mime']  = 'MISC';
          break;
        case 'full' :
          $result['rtype'] = 'ARTICLE';
          $result['mime']  = 'HTML';
          break;
        }
      }
      break;
    case 'MImg' :
      // PDF
      $result['rtype'] = 'ARTICLE';
      $result['mime']  = 'PDF';
      break;
    case 'MiamiImageURL':
      if (isset($param['_pii'])) {
        if (preg_match("/S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)/", $param['_pii'], $match)) {
          // example : http://pdn.sciencedirect.com.gate1.inist.fr/science?_ob=MiamiImageURL&_cid=282179&_user=4046392
          // &_pii=S221267161200100X&_check=y&_origin=browseVolIssue&_zone=rslt_list_item&_coverDate=2012-12-31
          // &wchp=dGLbVlB-zSkWz&md5=79a307d3c9bdbea6d6a6092d73c25545&pid=1-s2.0-S221267161200100X-main.pdf
          $result['unitid']           = 'S' . $match[1] . $match[2] . $match[3];
          $result['print_identifier'] = $match[1] . '-' . $match[2];
          $result['rtype']            = 'ARTICLE';
          $result['mime']             = 'PDF';
        } else if (preg_match("/B([0-9]{12})([0-9Xx])/", $param['_pii'], $match)) {
          // example : http://pdn.sciencedirect.com.gate1.inist.fr/science?_ob=MiamiImageURL&_cid=276181&_user=4046392
          // &_pii=B9780122694400500017&_check=y&_origin=browse&_zone=rslt_list_item&_coverDate=1996-12-31
          // &wchp=dGLzVlV-zSkWz&md5=7e7ed3b95463e5438053bb62f487cf57&pid=3-s2.0-B9780122694400500017-main.pdf
          $result['unitid']   = 'B' . $match[1] . $match[2];
          $result['title_id'] = $match[1] . $match[2];
          $result['rtype']    = 'BOOK';
          $result['mime']     = 'PDF';
        } else {
          $result['unitid']           = substr($param['_pii'], 1, 4) . '-' . substr($param['_pii'], 5, 4);
          $result['print_identifier'] = $result['unitid'];
          // Set consultation type to PDF
          $result['rtype']            = 'ARTICLE';
          $result['mime']             = 'PDF';
        }
      }
      break;
    }
  } else {
    if (preg_match("/\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])([0-9A-Za-z]*)/", $url['path'], $match)) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/article/pii/S2212671612001011
      $result['unitid']           = 'S' . $match[1] . $match[2] . $match[3];
      $result['print_identifier'] = $match[1] . '-' . $match[2];
      $result['rtype']            = 'ARTICLE';
      $result['mime']             = 'HTML';
    } else if (preg_match("/\/science\/publication\?issn=([0-9]{4})([0-9]{4})/", $url['path'], $match)) {
      $result['unitid']           = $match[1] . '-' . $match[2];
      $result['print_identifier'] = $match[1] . '-' . $match[2];
      $result['rtype']            = 'TOC';
      $result['mime']             = 'MISC';
    } else if (preg_match("/\/science\/journal\/([0-9]{4})([0-9]{4})/", $url['path'], $match)) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/journal/22126716
      $result['unitid']           = $match[1] . $match[2];
      $result['print_identifier'] = $match[1] . '-' . $match[2];
      $result['rtype']            = 'TOC';
      $result['mime']             = 'MISC';
    } else if (preg_match("/\/science\/bookseries\/([0-9]{8})(\/[0-9]+)?/", $url['path'], $match)) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/bookseries/00652458
      if ($match[2]) {
        $result['unitid'] = $match[1] . $match[2];
      } else {
        $result['unitid'] = $match[1];
      }
      $result['title_id'] = $match[1];
      $result['rtype']    = 'BOOKSERIE';
      $result['mime']     = 'MISC';
    } else if (preg_match("/\/science\/handbooks\/([0-9]{8})(\/[0-9]+)?/", $url['path'], $match)) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/handbooks/01673785
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/handbooks/01673785/11
      if ($match[2]) {
        $result['unitid'] = $match[1] . $match[2];
      } else {
        $result['unitid'] = $match[1];
      }
      $result['title_id'] = $match[1];
      $result['rtype']    = 'HANDBOOK';
      $result['mime']     = 'MISC';
    } else if (preg_match("/\/science\/book\/([0-9]{13})/", $url['path'], $match)) {
      // example : http://www.sciencedirect.com.gate1.inist.fr/science/book/9780122694400
      $result['unitid'] = $match[1];
      // ##RN
      //$result['pisbn']   = $match[1];
      $result['title_id'] = $match[1];
      $result['rtype']    = 'BOOK';
      $result['mime']     = 'HTML';
    }
  }
fprintf(STDOUT, "%s\n", json_encode($result));
}
exit(0);
?>