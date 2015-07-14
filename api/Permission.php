<?php

trait Permission
{

    private static $logins = array('administrators', 'devices', 'users');

    public static function GetSubjectByQuery(array &$request)
    {
        $result = FALSE;
        $className = __CLASS__;
        if (array_key_exists('sessionId', $request['cookies']) && in_array($className, self::$logins)) {
            //$sessionId = session_id();
            $sessionId = $request['cookies']['sessionId'];
            //$infos['header']['authrozition'];
            $session = $className::IsPrimaryKey($sessionId);
            if ($session) {
                $session->setLastOperationTime(time());
                $session->Update();
                $result = $session; //users::SelectById($session->getUserId());
            }
        }
        return $result;
    }

    public static function CheckPermission(users $subject, $operation, $dataTypeId, array $attributeBag)
    {
        $result = '1 = 1';
//        $permission = permissions::GetByUserAndOperationDataTypeIdAttributeBag($subject, $operation, $dataTypeId, $attributeBag);
//        if ($permission) {
//            $result = $permission->getRegionExpression();
//        }
//        if (!$result) {
//            $roles = roles::GetByUser($subject);
//            foreach ($roles as $role) {
//                $permission = permissions::GetByRoleAndOperationDataTypeIdAttributeBag($role, $operation, $dataTypeId, $attributeBag);
//                $result = $permission->getRegionExpression();
//                break;
//            }
//        }
        return $result;
    }

}

?>
