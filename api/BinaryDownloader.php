<?php

trait BinaryDownloader
{

    public function download()
    {
        //mime-type total-length file-name
        $uri = $this->getContent();
        $filename = basename($uri);
        $file = fopen($filename, 'rb');
        fseek($file, 0, SEEK_END);
        $length = ftell($file);
        $content = fread($file, $length);
        fclose($file);
        return $content;
    }

    public function downloadSlice($offset, $count)
    {
        //mime-type total-length file-name|file-uri start-position transfer-length
        $uri = $this->getContent();
        //remove [scheme://host:port/path/]specPath/name.ext
        $filename = basename($uri);
        $file = fopen($filename, 'rb');
        fseek($file, $offset);
        $content = fread($file, $count);
        fclose($file);
        return $content;
    }

}

?>
