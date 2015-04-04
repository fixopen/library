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
        DataAccess::IsPrimaryKey as isPrimary;
        JSON::ToJson as privateToJson;
    }

    private $no = ''; //sn
    private $address = '';
    private $location = NULL; //(x, y);
    private $lastOperationTime = NULL;
    private $lastUpdateTime = NULL;
    private $controlNo = '';
    private $controlPassword = '';
    private $sessionId = NULL;

    public static function IsPrimaryKey($no)
    {
        return self::GetOne('no', $no);
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

    public function getLastUpdateTime()
    {
        return $this->lastUpdateTime;
    }

    public function setLastUpdateTime($lastUpdateTime)
    {
        $this->lastUpdateTime = $lastUpdateTime;
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
