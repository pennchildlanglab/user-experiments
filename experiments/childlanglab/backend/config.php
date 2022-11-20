<?php

  // COMMENTED OUT FOR NOW; NOT AS CRUCIAL TO GET AWS WORKING
  // // Included aws/aws-sdk-php via Composer's autoloader
  // // allows you to post to s3 buckets (aws or digital ocean)
  require 'vendor/autoload.php';
  use Aws\S3\S3Client;
  use Aws\S3\S3ClientInterface;



  // // configure your s3 client (digital ocean or AWS)
  $client = new Aws\S3\S3Client([
    'version' => 'latest',
    'region'  => getenv('S3_REGION'),
    'endpoint' => getenv('S3_ENDPOINT'),
    'credentials' => [
            'key'    => getenv('S3_KEY'),
            'secret' => getenv('S3_SECRET'),
        ],
  ]);

  $bucket = getenv('S3_BUCKET');
  
  // configure database
  $database = (object) [
    'host' => getenv('DB_HOST'),
    'port' => getenv('DB_PORT'),
    'dbname' => getenv('DB_NAME'),
    'user' => getenv('DB_USER'),
    'password' => getenv('DB_PASSWORD'),
    'runs_table' => getenv('DB_TABLE'),
    'sslmode' => getenv('DB_SSLMODE')
  ];

  
?>