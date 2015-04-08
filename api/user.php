<?php
/**
 * Created by PhpStorm.
 * User: fixopen
 * Date: 8/4/15
 * Time: 13:18
 */

class user extends Model
{
    public static function Prepare()
    {
        self::MetaPrepare('user');
    }
}