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
