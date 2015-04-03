<?php

class pushMessages {

    private static $tableName = 'pushMessage';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $dataTypeId = 0;
    private $dataIds = array();
    private $creatorId = 0;
    private $createTime = ''; //publisher time
    private $receiverIds = array();
    private $startTime = '';
    private $stopTime = '';

    public function getDataTypeId()
    {
        return $this->dataTypeId;
    }

    public function setDataTypeId($dataTypeId)
    {
        $this->dataTypeId = $dataTypeId;
    }

    public function getDataIds()
    {
        return $this->dataIds;
    }

    public function setDataIds($dataIds)
    {
        $this->dataIds = $dataIds;
    }

    public function getCreatorId()
    {
        return $this->creatorId;
    }

    public function setCreatorId($creatorId)
    {
        $this->creatorId = $creatorId;
    }

    public function getCreateTime()
    {
        return $this->createTime;
    }

    public function setCreateTime($createTime)
    {
        $this->createTime = $createTime;
    }

    public function getReceiverIds()
    {
        return $this->receiverIds;
    }

    public function setReceiverIds($receiverIds)
    {
        $this->receiverIds = $receiverIds;
    }

    public function getStartTime()
    {
        return $this->startTime;
    }

    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }

    public function getStopTime()
    {
        return $this->stopTime;
    }

    public function setStopTime($stopTime)
    {
        $this->stopTime = $stopTime;
    }

}

?>
