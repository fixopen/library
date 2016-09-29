<?php

class userRoleMaps
{

    private static $tableName = 'userRoleMap';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $userId = 0;
    private $roleId = 0;
    private $regionArguments = array();

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getRoleId()
    {
        return $this->roleId;
    }

    public function setRoleId($roleId)
    {
        $this->roleId = $roleId;
    }

    public function getRegionArguments()
    {
        return $this->regionArguments;
    }

    public function setRegionArguments($regionArguments)
    {
        $this->regionArguments = $regionArguments;
    }

}

?>
