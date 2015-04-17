<?php
/**
 * Created by PhpStorm.
 * User: fixopen
 * Date: 17/4/15
 * Time: 10:51
 */

class systemParameters
{
    private static $tableName = 'systemParameter';

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

    private $name = '';
    private $value = NULL;

    public static function IsPrimaryKey($name)
    {
        return self::GetOne('name', $name);
    }
}