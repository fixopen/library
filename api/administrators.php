<?php

class administrators
{

    private static $tableName = 'administrator';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        Session,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
        JSON::ToJson as privateToJson;
    }

    //'/api/administrators/full'

    private static $classSpecSubresource = array(
        'full' => 'fullProc'
    );

    public static function fullProc(array &$request)
    {
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $body = json_decode($request['body'], true);
                //print_r($body) ;
                $administrator = new administrators();
                $administrator->setId(0);
                $administrator->setName($body['userName']);
                //print_r("-------------------------------") ;
                //print_r($body['userName']) ;
                $administrator->setLastOperationTime(time());
                $administrator->setPassword($body['userPassword']);
                $id = $administrator->Insert();
                if(is_integer($id)){
                    //print_r($id) ;
                    //print_r($body['stage']) ;
                    foreach ($body['stage'] as &$value) {
                        //print_r($value) ;
                        $administratorPrivilegeMap = new administratorPrivilegeMaps();
                        $administratorPrivilegeMap->setId(0);
                        $administratorPrivilegeMap->setAdministratorId($id);
                        $administratorPrivilegeMap->setPrivilegeId($value);
                        $administratorPrivilegeMap->Insert();
                    }
                }
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PATCH':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'DELETE':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            default:
                break;
        }
        return $request;
    }

    public static function IsPrimaryKey($name)
    {
        //print 'user key is ' . $v . '<br />';
        $result = self::GetOne('sessionId', $name);
        if ($result == FALSE) {
            $result = self::GetOne('name', $name);
            if ($result == FALSE) {
                $result = self::isPrimary($name);
            }
        }
        return $result;
    }

    private $name = ''; //character varying(32),
    private $password = ''; //character varying(64),
    private $lastOperationTime = NULL;
    private $sessionId = NULL;

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getLastOperationTime()
    {
        return $this->lastOperationTime;
    }

    public function setLastOperationTime($lastOperationTime)
    {
        $this->lastOperationTime = $lastOperationTime;
    }

    public function getSessionId()
    {
        return $this->sessionId;
    }

    public function setSessionId($sessionId)
    {
        $this->sessionId = $sessionId;
    }

}

?>
