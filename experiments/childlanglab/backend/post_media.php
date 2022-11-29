<?php  

    include('config.php');

    use Aws\S3\S3Client;
    use Aws\Exception\AwsException;
    use Aws\S3\ObjectUploader;

    // get details from the form request
    $filename = $_REQUEST['filename'];
    $project = $_REQUEST['project'];
    $randomid = $_REQUEST['randomid'];

    // generate filename according to our convention project/randomid/trial.webm
    $key = "{$project}/{$randomid}/{$filename}";

    // create a temporary file with the randomid (so they don't overwrite each other)
    $file = "{$randomid}.webm";
    file_put_contents($file, base64_decode($_REQUEST['base64_audio']));

    // Using stream instead of file path
    $source = fopen($file, 'rb');

    $uploader = new ObjectUploader(
        $client,
        $bucket,
        $key,
        $source,
        'private'
        
    );

    do {
        try {
            $result = $uploader->upload();
            if ($result["@metadata"]["statusCode"] == '200') {
                print('<p>File successfully uploaded to ' . $result["ObjectURL"] . '.</p>');
            }
            print($result);
        } catch (MultipartUploadException $e) {
            rewind($source);
            $uploader = new MultipartUploader($s3Client, $source, [
                'state' => $e->getState(),
            ]);
        }
    } while (!isset($result));

    fclose($source);
    unlink($file);


?>