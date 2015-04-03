<?php

class permissions
{

    private static $tableName = 'permission';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $name = '';
    private $operation = ''; //SELECT INSERT DELETE UPDATE
    private $dataTypeId = 0;
    private $attributeBag = array();
    private $regionExpression = '';
    //super-contact-view: contact-table select regionExpression: contact-isPrivate = FALSE AND contact-id in (select contactId from contactGroupMap where groupId = <self-organizationId>)
    //contact-view: contact-table select regionExpression: super-contact-view's regionExpression AND contact-id in (select contactId from userContactMap where userId = <self-id>)

    public static function GetByUserAndOperationDataTypeIdAttributeBag($user, $operation, $dataTypeId, array $attributeBag)
    {
        $result = FALSE;
        $mapFilter = self::ConstructMapFilter('permissionId', 'userPermissionMap', 'userId', $user->getId());
        $operationFilter = self::ConstructNameValueFilter('operation', $operation);
        $dataTypeIdFilter = self::ConstructNameValueFilter('dataTypeId', $dataTypeId);
        $r = self::CustomSelect(' WHERE ' . $mapFilter . ' AND ' . $operationFilter . ' AND ' . $dataTypeIdFilter);
        if (count($r) == 1) {
            $result = $r[0];
            $ab = $result->getAttributeBag();
            foreach ($attributeBag as $attribute) {
                if (!in_array($attribute, $ab)) {
                    $result = FALSE;
                    break;
                }
            }
        }
        return $result;
    }

    public static function GetByRoleAndOperationDataTypeIdAttributeBag($role, $operation, $dataTypeId, array $attributeBag)
    {
        $result = FALSE;
        $mapFilter = self::ConstructMapFilter('permissionId', 'rolePermissionMap', 'roleId', $role->getId());
        $operationFilter = self::ConstructNameValueFilter('operation', $operation);
        $dataTypeIdFilter = self::ConstructNameValueFilter('dataTypeId', $dataTypeId);
        $r = self::CustomSelect(' WHERE ' . $mapFilter . ' AND ' . $operationFilter . ' AND ' . $dataTypeIdFilter);
        if (count($r) == 1) {
            $result = $r[0];
            $ab = $result->getAttributeBag();
            foreach ($attributeBag as $attribute) {
                if (!in_array($attribute, $ab)) {
                    $result = FALSE;
                    break;
                }
            }
        }
        return $result;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getOperation()
    {
        return $this->operation;
    }

    public function setOperation($operation)
    {
        $this->operation = $operation;
    }

    public function getDataTypeId()
    {
        return $this->dataTypeId;
    }

    public function setDataTypeId($dataTypeId)
    {
        $this->dataTypeId = $dataTypeId;
    }

    public function getAttributeBag()
    {
        return $this->attributeBag;
    }

    public function getRegionExpression()
    {
        return $this->regionExpression;
    }

    public function setRegionExpression($regionExpression)
    {
        $this->regionExpression = $regionExpression;
    }

}

?>
