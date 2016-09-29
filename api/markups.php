<?php

class markups {

    private static $tableName = 'markup';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $userId = 0;
    private $dataTypeId = 0;
    private $dataId = 0;
    private $groupId = 0;
    private $name = '';
    private $value = '';

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
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

    public function getGroupId()
    {
        return $this->groupId;
    }

    public function setGroupId($groupId)
    {
        $this->groupId = $groupId;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setValue($value)
    {
        $this->value = $value;
    }

}

?>
