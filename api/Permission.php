<?php

trait Permission
{

    public static function GetSubjectByQuery(array &$request)
    {
        $result = FALSE;
        $className = __CLASS__;
        if (isset($request['cookies']['sessionId']) && $className == 'devices') {
            //$sessionId = session_id();
            $sessionId = $request['cookies']['sessionId'];
            //$infos['header']['authrozition'];
            $session = devices::IsPrimaryKey($sessionId);
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
        }
        return $result;
    }

}

?>
