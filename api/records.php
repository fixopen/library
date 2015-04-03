<?php

class records {

    private static $tableName = 'record';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $callId = 0;
    private $_call = NULL;
    private $startTime = '';
    private $duration = '';
    private $filename = '';

    public function getCallId()
    {
        return $this->callId;
    }

    public function setCallId($callId)
    {
        $this->callId = $callId;
    }

    public function getCall()
    {
        return $this->_call;
    }

    public function setCall($call)
    {
        $this->_call = $call;
    }

    public function getStartTime()
    {
        return $this->startTime;
    }

    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }

    public function getDuration()
    {
        return $this->duration;
    }

    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    public function getFilename()
    {
        return $this->filename;
    }

    public function setFilename($filename)
    {
        $this->filename = $filename;
    }

}

?>
