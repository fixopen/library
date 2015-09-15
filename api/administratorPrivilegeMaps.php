<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/9/9 0009
 * Time: 下午 3:09
 */

class administratorPrivilegeMaps {
    private static $tableName = 'administratorPrivilegeMap';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        Session,
        NormalFacadeImpl,
        Facade {
        NormalFacadeImpl::FillSelf as commonFillSelf;
        DataAccess::IsPrimaryKey as isPrimary;
        DataAccess::specFilter as commonSpecFilter;
        JSON::ToJson as privateToJson;
    }

    private $id = ''; //bigint,
    private $administratorId = ''; //bigint,
    private $privilegeId = ''; //bigint,

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getAdministratorId()
    {
        return $this->administratorId;
    }

    /**
     * @param string $administratorId
     */
    public function setAdministratorId($administratorId)
    {
        $this->administratorId = $administratorId;
    }

    /**
     * @return string
     */
    public function getPrivilegeId()
    {
        return $this->privilegeId;
    }

    /**
     * @param string $privilegeId
     */
    public function setPrivilegeId($privilegeId)
    {
        $this->privilegeId = $privilegeId;
    } //bigint,

}