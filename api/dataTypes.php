<?php

class dataTypes
{

    private static $tableName = 'dataType';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade;

    private $name = '';
    private $description = '';

    public static function GetIdByName($name)
    {
        $id = 0;
        $r = self::GetOne('name', $name);
        $id = $r['id'];
        return $id;
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
