<?php

class business
{

    private static $tableName = 'business';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
        JSON::ToJson as privateToJson;
    }

    //id bigint NOT NULL,
    private $userId = 0; //bigint,
    private $deviceId = 0; //bigint,
    private $bookId = 0; //bigint,
    private $time = NULL; //timestamp(4) without time zone,
    private $action = ''; //actiontype

    private static $classSpecSubresource = array('top' => 'topProc');

    public static function topProc(array &$request)
    {
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
                break;
            case 'PATCH':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                if ($count == 1) {
                    $dir = array_shift($request['paths']);
                    switch ($dir) {
                        case 'follow':
                            $query = 'SELECT count(*) FROM "business" WHERE "action" = ' . "'Follow' GROUP BY " . '"bookId" ORDER BY "count" LIMIT 10';
                            break;
                        case 'view':
                            break;
                        case 'download':
                            break;
                        default:
                            $request['code'] = 400; //bad request
                            break;
                    }
                } else {
                    $request['code'] = 400; //bad request
                }
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

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getDeviceId()
    {
        return $this->deviceId;
    }

    public function setDeviceId($deviceId)
    {
        $this->deviceId = $deviceId;
    }

    public function getBookId()
    {
        return $this->bookId;
    }

    public function setBookId($bookId)
    {
        $this->bookId = $bookId;
    }

    public function getTime()
    {
        return $this->time;
    }

    public function setTime($time)
    {
        $this->time = $time;
    }

    public function getAction()
    {
        return $this->action;
    }

    public function setAction($action)
    {
        $this->action = $action;
    }

}

?>
