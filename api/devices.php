<?php

class devices
{

    private static $tableName = 'device';

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

    private $no = ''; //sn
    private $address = '';
    private $location = NULL; //(x, y);
    private $lastOperationTime = NULL;
    private $setupTime = NULL;
    private $controlNo = '';
    private $controlPassword = '';
    private $ipAddress = NULL;
    private $sessionId = NULL;

    private static $classSpecSubresource = array(
        'counted' => 'countedProc'
    );
    public static function countedProc(array &$request){
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
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
                if ($count == 0) {
                    $result = array();
                    $whereClause = '';
                    $filter = $request['params']['filter'];
                    if ($filter != '') {
                        $filterJson = json_decode($filter);
                        $where = array();
                        foreach ($filterJson as $key => $value) {
                            $condition = self::specFilter($key, $value);
                            if ($condition == '') {
                                if (is_null($value)) {
                                    $where[] = self::Mark($key) . ' IS NULL';
                                } else {
                                    $where[] = self::Mark($key) . ' = ' . self::DatabaseQuote($value, self::GetTypeByName($key));
                                }
                            } else {
                                $where[] = $condition;
                            }
                        }
                        //print_r($where);
                        $whereClause = ' AND ' . implode(' AND ', $where);
                    }
                    $bookKind = [];
                    if($whereClause){
                        $sql = 'select id,no from device where 1=1'.$whereClause.' order by id asc limit '.$request['params']['count'].' offset '.$request['params']['offset'];
                    }else{
                        $sql = 'select id,no from device order by id asc limit '.$request['params']['count'].' offset '.$request['params']['offset'];
                    }
                    $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                    if ($r) {
                        foreach ($r as $row) {
                            $item = new stdClass();
                            $item->no =$row['no'];
                            $item->id =$row['id'];
                            $bookKind[] = $item;
                        }
                    }
//                    print_r($bookKind);
                    foreach($bookKind as $one){
                        $item = new stdClass();
                        $item->name = $one->no;
//                        print_r($one);
                        $sql ='select count(id) from business where "deviceId"= '.$one->id.' group by "userId" ';
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        $item->totalUser =0;
                        if ($r) {
                            $number = 0;
                            foreach ($r as $row) {
                                $number +=1;
                                $item->totalUser =$number;
                            }
                        }
                        $sql ='select count(id) from business where "deviceId"='.$one->id.'  and action ='."'".Download."'";
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        if ($r) {
                            foreach ($r as $row) {
                                $item->Download =$row['count'];
                            }
                        }
                        $sql ='select count(id) from business where "deviceId"='.$one->id.'  and action ='."'".View."'";
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        if ($r) {
                            foreach ($r as $row) {
                                $item->View =$row['count'];
                            }
                        }
                        $sql ='select count(id) from business where "deviceId"='.$one->id.'  and action ='."'".Follow."'";
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        if ($r) {
                            foreach ($r as $row) {
                                $item->Follow =$row['count'];
                            }
                        }
                        $result[] = $item;
                    }
//                    $request['response']['code'] = 200; //bad request
                    $request['response']['body'] = self::ToArrayJson($result);
//                    print_r($request);
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "must include [time] path segment"}';
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


    public static function IsPrimaryKey($v)
    {
        //print 'user key is ' . $v . '<br />';
        $result = self::GetOne('sessionId', $v);
        if ($result == FALSE) {
            $result = self::isPrimary($v);
        }
        return $result;
    }

    private static function specFilter($name, $value) {
        //print 'user key is ' . $name . '<br />';
        $result = self::commonSpecFilter($name, $value);
        if ($name === 'isOnline') {
            $now = time();
            $sepator = $now - 30 * 60;
            if ($value === 'heartbeat' || $value === TRUE) {
                $result = '"lastOperationTime" > ' . $sepator;
            } else if ($value == 'offline' || $value === FALSE) {
                $result = '"lastOperationTime" < ' . $sepator;
            } else {
                //still empty
            }
        }
        if ($name === 'fromTime') {
            $result = '"setupTime" > TIMESTAMP ' . "'" . $value . "'";
        }
        if ($name === 'toTime') {
            $result = '"setupTime" < TIMESTAMP ' . "'" . $value . "'";
        }
        if($name === 'deviceSelect'){
            $result = '"no" = ' . "'{$value}'";
        }
        if ($name === 'deviceFrom') {
            $result = '"setupTime" > ' ."'{$value}'"  ;
        }
        if ($name === 'deviceTo') {
            $result = '"setupTime" < ' ."'{$value}'";
        }
        return $result;
    }

    public function FillSelf($row)
    {
        $this->commonFillSelf($row);
        $this->lastOperationTime = 0;
        //$this->lastUpdateTime = time();
    }

    public static function Touch($sessionId)
    {
        $session = self::GetOne('sessionId', $sessionId);
        if ($session) {
            $session->setLastOperationTime(time());
            $session->Update();
        }
    }

    public function getNo()
    {
        return $this->no;
    }

    public function setNo($no)
    {
        $this->no = $no;
    }

    public function getAddress()
    {
        return $this->address;
    }

    public function setAddress($address)
    {
        $this->address = $address;
    }

    public function getLocation()
    {
        return $this->location;
    }

    public function setLocation($location)
    {
        $this->location = $location;
    }

    public function getLastOperationTime()
    {
        return $this->lastOperationTime;
    }

    public function setLastOperationTime($lastOperationTime)
    {
        $this->lastOperationTime = $lastOperationTime;
    }

    public function getSetupTime()
    {
        return $this->setupTime;
    }

    public function setSetupTime($lastUpdateTime)
    {
        $this->setupTime = $lastUpdateTime;
    }

    public function getControlNo()
    {
        return $this->controlNo;
    }

    public function setControlNo($controlNo)
    {
        $this->controlNo = $controlNo;
    }

    public function getControlPassword()
    {
        return $this->controlPassword;
    }

    public function setControlPassword($controlPassword)
    {
        $this->controlPassword = $controlPassword;
    }

    public function getIpAddress()
    {
        return $this->ipAddress;
    }

    public function setIpAddress($ipAddress)
    {
        $this->ipAddress = $ipAddress;
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
