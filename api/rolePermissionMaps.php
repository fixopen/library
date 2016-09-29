<?php

class rolePermissionMaps {

    private static $tableName = 'rolePermissionMap';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $roleId = 0;
	private $permissionId = 0;

    public function getRoleId()
    {
        return $this->roleId;
    }

    public function setRoleId($roleId)
    {
        $this->roleId = $roleId;
    }

    public function getPermissionId()
    {
        return $this->permissionId;
    }

    public function setPermissionId($permissionId)
    {
        $this->permissionId = $permissionId;
    }

}

?>
