<?php

class sessions
{

    private static $tableName = 'session';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
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

    public static function GetByUserId($userId)
    {
        return self::GetOne('userId', $userId);
    }

    public static function Touch($sessionId)
    {
        $session = self::GetOne('sessionId', $sessionId);
        if ($session) {
            $session->setLastOperationTime(time());
            $session->Update();
        }
    }

    private $sessionId = '';
    private $userId = 0;
    private $startTime = 0;
    private $lastOperationTime = 0;
    private $ipAddress = '';
    private $appendInfo = '';

    public function getSessionId()
    {
        return $this->sessionId;
    }

    public function setSessionId($sessionId)
    {
        $this->sessionId = $sessionId;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getStartTime()
    {
        return $this->startTime;
    }

    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }

    public function getLastOperationTime()
    {
        return $this->lastOperationTime;
    }

    public function setLastOperationTime($lastOperationTime)
    {
        $this->lastOperationTime = $lastOperationTime;
    }

    public function getIpAddress()
    {
        return $this->ipAddress;
    }

    public function setIpAddress($ipAddress)
    {
        $this->ipAddress = $ipAddress;
    }

    public function getAppendInfo()
    {
        return $this->appendInfo;
    }

    public function setAppendInfo($appendInfo)
    {
        $this->appendInfo = $appendInfo;
    }

}

?>
