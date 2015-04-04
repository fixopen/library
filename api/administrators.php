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

    public static function IsPrimaryKey($name)
    {
        return self::GetOne('name', $name);
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
