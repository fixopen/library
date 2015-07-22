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
            $result = '"registerTime" > ' . strtotime($value . 'T00:00:00');
        }
        if ($name === 'toTime') {
            $result = '"registerTime" < ' . strtotime($value . 'T00:00:00');
        }
        return $result;
    }

    public function ToJson()
    {
        $this->registerDate = date('Y-n-j', $this->registerTime);
        return $this->privateToJson();
    }

    public static function IsPrimaryKey($no)
    {
        //print 'user key is ' . $v . '<br />';
        $result = self::GetOne('sessionId', $no);
        if ($result == FALSE) {
            $result = self::GetOne('no', $no);
            if ($result == FALSE) {
                $result = self::isPrimary($no);
            }
        }
        return $result;
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
