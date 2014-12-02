<?php
  // Ce script va aller récupérer les fichiers CSV depuis la plateforme de l'éditeur
  // et les mettre au format qui nous intéresse pour pkb

  // On part du principe que le fichier existe déjà
  // get_file("journal");
  get_file("ebook");



  function get_file($type)
  {
    global $champs_pkb;
    global $place_csv;

    if ($type == "journal")
    {
      $champs_pkb = array("title", "print_identifier", "online_identifier", "title_id");
      $pkb_file = "../../platforms-kb/muse.journals.pkb.csv";
      $place_csv = array(
                      "title" => 0,
                      "print_identifier" => 5,
                      "online_identifier" => 4,
                      "url" => 3);
    }
    elseif ($type == "ebook")
    {
      $champs_pkb = array("title", "print_identifier", "online_identifier", "title_id");
      $pkb_file = "../../platforms-kb/muse.ebooks.pkb.csv";
      $place_csv = array(
                      "title" => 0,
                      "print_identifier" => 6,
                      "online_identifier" => 7,
                      "url" => 5);
    }
    else
    {
      print "Type inconnu : $type\n";
      exit;
    }

    global $global_pid;
    if (file_exists($pkb_file))
    {
      $lignes = file($pkb_file);
      foreach ($lignes as $ligne)
      {
        $tab = preg_split("/;/", $ligne);
        if  ( (sizeof($tab) != ( sizeof($champs_pkb )) ) )
        {
          print $ligne."\n";
          print "Erreur taille tab [".sizeof($tab)." vs ".sizeof($champs_pkb)."]\n";
          exit;
        }

        $local = array();
        $i = 0;
        foreach ($champs_pkb as $champ)
        {
          $local[$champ] = trim($tab[$i]);
          $i++;
        }

        if ($local["title"] != "title")
        {
          $global_pid[$local["title_id"]] = $local;
        }
      }
    }
    else
    {
      print "Pas de fichier pour le moment, on va en créer un à la fin du script\n";
    }

    print "Nombre de PID présents avant : ".sizeof($global_pid)."\n";

    if ($type == "journal")
    {
      getOneFile('http://muse.jhu.edu/holdings_reports/muse_journal_metadata_2013.tsv');
      getOneFile('http://muse.jhu.edu/holdings_reports/muse_journal_metadata_2014.tsv');
    }
    elseif ($type == "ebook")
    {
      getOneFile('muse_book_metadata.tsv');
    }

    // On va générer le fichier pkb
    $fh = fopen($pkb_file, "w");
    $header = join(";", $champs_pkb);
    fputs($fh, $header."\n");

    foreach ($global_pid as $pid => $sousTab)
    {
      $out_line = "";
      foreach ($champs_pkb as $champ)
      {
        $out_line .= str_replace(";", " ", $sousTab[$champ]).";";
      }
      $out_line = preg_replace("/;$/", "", $out_line);
      fputs($fh, $out_line."\n");
    }
    fclose($fh);
    print "Nombre de PID présents après : ".sizeof($global_pid)."\n";
  }

  function getOneFile($url)
  {
    global $global_pid;
    global $champs_pkb;
    global $place_csv;

    print "\tDL# $url\n";
    $content = file($url);

    foreach ($content as $ligne)
    {
      $tab_ligne = preg_split("/\t/", $ligne);
      if (sizeof($tab_ligne) > 4) // On laisse le côté les premières lignes qui ne contiennent qu'une ou deux colonnes, informations génériques
      {
        // On vérifie que l'on n'est pas sur la première ligne
        if (strtoupper($tab_ligne[$place_csv["title"]]) != "TITLE")
        {
          $local = array();
          foreach ($champs_pkb as $pkb)
          {
            if ($pkb == "title_id")
            {
              // Le pid n'est pas présent dans le fichier, on va le calculer à partir de l'URL
              $local[$pkb] = $tab_ligne[$place_csv["url"]];
              $local[$pkb] = str_replace("http://muse.jhu.edu/journals/", "", $local[$pkb]);
              $local[$pkb] = str_replace("http://muse.jhu.edu/books/", "", $local[$pkb]);
            }
            else
            {
              $local[$pkb] = $tab_ligne[$place_csv[$pkb]];
            }
          }
          $global_pid[$local["title_id"]] = $local;
        }
      }
    }
  }

  function getOneFileBook($url)
  {
    global $global_pid;
    print "\tDL# $url\n";
    $content = file($url);

    foreach ($content as $ligne)
    {
      $tab_ligne = preg_split("/\t/", $ligne);
      if (sizeof($tab_ligne) > 10) // On laisse le côté les premières lignes qui ne contiennent qu'une ou deux colonnes, informations génériques
      {
        $title = $tab_ligne[0];
        $isbn = $tab_ligne[6];
        if ($isbn == "")
        {
          $isbn = $tab_ligne[7];
        }
        $url = $tab_ligne[5];

        if ($url != "URL")
        {
          // Une ligne normale hors header
          if (!preg_match("/^http/", $url))
          {
            print "Erreur sur le format d'URL, problème dans le fichier ? [$url]\n";
            exit;
          }

          $global_pid[$isbn]["print_identifier"] = $isbn;
          $global_pid[$isbn]["title"] = $title;
        }
      }
    }
  }


?>