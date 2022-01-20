<?php
  include('config.php');

  // get JSON and decode to PHP array
  $data_array = json_decode(file_get_contents('php://input'), true);

  // connect to database
  $dbconn = pg_connect( "host=$database->host port=$database->port dbname=$database->dbname user=$database->user password=$database->password  sslmode=$database->sslmode" )
      or die ("Could not connect to database\n");

  // insert array to runs table
  $res = pg_insert($dbconn, $database->runs_table, $data_array)
    or die ("Could not update run with data\n");

  pg_close($dbconn);
?>