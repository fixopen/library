<?php

trait Permission
{

    private static $logins = array('administrators', 'devices', 'users');

    public static function GetSubjectByQuery(array &$request)
    {
//        print_r($request['cookies']);
        $result = FALSE;
        if (array_key_exists('sessionId', $request['cookies'])) {
            //$sessionId = session_id();
//            print  "1<br/>";
            $sessionId = $request['cookies']['sessionId'];
            // && in_array($className, self::$logins)
            //$infos['header']['authrozition'];
            foreach (self::$logins as $className) {
                $session = $className::IsPrimaryKey($sessionId);
                if ($session) {
                    $session->setLastOperationTime(time());
                    $session->Update();
                    $result = $session; //users::SelectById($session->getUserId());
                }
            }
        }
        return $result;
    }

    public static function CheckPermission($subject, $operation, $dataTypeId, array $attributeBag)
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
