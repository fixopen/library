<?php

class roles
{

    private static $tableName = 'role';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $name = '';
    private $description = '';
    //private $power = 0; //privileges 0 Administrator， 1 Common， 2 NormalTelephoneUser
    //Administrator: users devices group INSERT DELETE UPDATE SELECT calls records DELETE
    //Common: pushMessages INSERT others SELECT
    //NormalTelephoneUser: calls records logs INSERT others SELECT (filter by self)

    public static function GetByUser($user)
    {
        return self::GetByMap('roleId', 'userRoleMap', 'userId', $user->getId());
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

}

?>
