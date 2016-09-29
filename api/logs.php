<?php

class logs {

    private static $tableName = 'log';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

	private $userId = 0;
    private $timestamp = '';
    private $dataTypeId = 0;
    private $dataId = 0;
    private $operation = 0; //SELECT INSERT DELETE UPDATE
	private $description = '';

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getTimestamp()
    {
        return $this->timestamp;
    }

    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;
    }

    public function getDataTypeId()
    {
        return $this->dataTypeId;
    }

    public function setDataTypeId($dataTypeId)
    {
        $this->dataTypeId = $dataTypeId;
    }

    public function getDataId()
    {
        return $this->dataId;
    }

    public function setDataId($dataId)
    {
        $this->dataId = $dataId;
    }

    public function getOperation()
    {
        return $this->operation;
    }

    public function setOperation($operation)
    {
        $this->operation = $operation;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

}

?>
