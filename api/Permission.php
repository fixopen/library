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
//                print_r(">>>>>>>>>>>>>>");
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
        // 用户 请求方式， 表，
        $result = FALSE;
//                            print_r('1111111111');
        //$privileges = privileges::CustomSelect('id in (select )')
        $req = array('method' => 'GET', 'paths' => array('privilegeId', 'administratorPrivilegeMap', 'administratorId', $subject->getId()));
        $privileges = privileges::commonByMapProc($req);
        //print_r($privileges);
        if($privileges['response']['code'] == 200){
            $repArray = json_decode($privileges['response']['body'], true);
//            print_r($repArray);
            foreach($repArray as $oneInfo){
                //表明
                if($oneInfo['tablen']==$dataTypeId){
                    //操作方式
//                    print_r('1111111111');
                    if(($operation=="GET"&&$oneInfo['readWrite']=="read")||($operation!="GET"&&$oneInfo['readWrite']=='write')){
//                        print_r('22222222222222');
                        $result = '1=1';
                    }
                }
            }
        }
//        print_r($result);
//        foreach($privileges as $privilegeInfo){
//            if($privilegeInfo['code']==200){
//                print_r(json_decode($privilegeInfo['body'], true));
//            }
//        }
//            if($privilegeInfo['']){
//
//            }

//        print_r($privileges);
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
