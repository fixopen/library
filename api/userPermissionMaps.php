<?php

class userPermissionMaps
{

    private static $tableName = 'userPermissionMap';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $userId = 0;
    private $permissionId = 0;
    private $regionArguments = '';

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getPermissionId()
    {
        return $this->permissionId;
    }

    public function setPermissionId($permissionId)
    {
        $this->permissionId = $permissionId;
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
