<?php

class calls {

    private static $tableName = 'call';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $userId = 0;
    //--begin--
    private $deviceId = 0;
    //--or--
    private $localTelephoneNumber = '';
    //--end--
    private $type = 0; //0 未接通 1 呼入 2 呼出 3 留言 4 本地
    //--begin--
    private $remoteTelephoneNumber = '';
    //--or--
    private $contactId = 0;
    //--end--
    private $startTime = '';
    private $duration = 0;
    private $recordCount = 0;
    private $_records = array();

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getDeviceId()
    {
        return $this->deviceId;
    }

    public function setDeviceId($deviceId)
    {
        $this->deviceId = $deviceId;
    }

    public function getLocalTelephoneNumber()
    {
        return $this->localTelephoneNumber;
    }

    public function setLocalTelephoneNumber($localTelephoneNumber)
    {
        $this->localTelephoneNumber = $localTelephoneNumber;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getRemoteTelephoneNumber()
    {
        return $this->remoteTelephoneNumber;
    }

    public function setRemoteTelephoneNumber($remoteTelephoneNumber)
    {
        $this->remoteTelephoneNumber = $remoteTelephoneNumber;
    }

    public function getContactId()
    {
        return $this->contactId;
    }

    public function setContactId($contactId)
    {
        $this->contactId = $contactId;
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

    public function getRecordCount()
    {
        return $this->recordCount;
    }

    public function setRecordCount($recordCount)
    {
        $this->recordCount = $recordCount;
    }

    public function getRecords()
    {
        return $this->_records;
    }

    public function setRecords($records)
    {
        $this->_records = $records;
    }

}

?>
