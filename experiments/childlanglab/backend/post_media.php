<?php  

    include('config.php');

    use Aws\Exception\AwsException;
    use Aws\S3\ObjectUploader;

    print_r($_FILES);
    print_r($_REQUEST);

    // create an uploader object
    $uploader = new ObjectUploader(
        $client, // the s3 client (from config.php)
        $bucket, // the bucket to save to
        $_REQUEST['filename'].".wav", //the filenmae from the form submitted
        fopen($_FILES['filedata']['tmp_name'], 'r+'), //the audio file from the form submitted
        'private', //the acl
        array('params' => array('ContentType' => 'audio/wav')), // the options parameter to specify the content type

    );

    // try to upload the object; if it's too big, do a multipart upload.
    do {
        try {
            $result = $uploader->upload();
            if ($result["@metadata"]["statusCode"] == '200') {
                print('<p>File successfully uploaded to ' . $result["ObjectURL"] . '.</p>');
            }
            print($result);
        } catch (MultipartUploadException $e) {
            rewind($source);
            $uploader = new MultipartUploader($client, $source, [
                'state' => $e->getState(),
            ]);
        }
    } while (!isset($result));

?>