<?php
  include('config.php');

  // get an array that has key "json_data" and value "the json array from jspsych"
  $data_array = json_decode(file_get_contents('php://input'), true);

  // connect to database
  $dbconn = pg_connect( "host=$database->host port=$database->port dbname=$database->dbname user=$database->user password=$database->password sslmode=$database->sslmode" )
      or die ("Could not connect to database\n");

  // update the runs table with the json data from the study
  $res = pg_query_params($dbconn, "UPDATE experiments.runs SET data = $1 WHERE randomid = $2;",
    array($data_array['json_data'], $data_array['randomid']))
    or die ("Could not update run with data\n");

  pg_close($dbconn);
?>