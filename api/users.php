<?php

class users
{

    private static $tableName = 'user';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        Session,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
        DataAccess::specFilter as commonSpecFilter;
        JSON::ToJson as privateToJson;
    }

    private $no = '';
    private $registerTime = NULL; // timestamp(4) without time zone,
    private $lastOperationTime = NULL; //timestamp(4) without time zone,
    private $sessionId = NULL;

    private static function specFilter($name, $value) {
        $result = self::commonSpecFilter($name, $value);
        if ($name === 'fromTime') {
            $result = '"registerTime" > ' . $value;
        }
        if ($name === 'toTime') {
            $result = '"registerTime" < ' . $value;
        }
        return $result;
    }

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

    public function getRegisterTime()
    {
        return $this->registerTime;
    }

    public function setRegisterTime($registerTime)
    {
        $this->registerTime = $registerTime;
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
