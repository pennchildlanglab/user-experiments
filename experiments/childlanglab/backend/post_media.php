<?php  

    include('config.php');

    use Aws\S3\S3Client;
    use Aws\Exception\AwsException;
    use Aws\S3\ObjectUploader;

    $key = $_REQUEST['filename'];
    $file = $_REQUEST['randomid']+'.webm';
    file_put_contents($file, base64_decode($_REQUEST['base64_audio']));

    // Using stream instead of file path
    $source = fopen($file, 'rb');

    $uploader = new ObjectUploader(
        $client,
        $bucket,
        $key,
        $source,
        'private'
        // $options = []
        //     $command['ContentType'] = 'audio/webm';
        
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