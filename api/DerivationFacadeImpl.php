<?php

trait DerivationFacadeImpl
{
    private static function NormalInsert(array &$request)
    {
        $pc = self::$parentClassName;
        $pc::NormalInsert($request);
        self::SelfInsert($request);
    }

    private static function SelfInsert(array &$request)
    {
        $sc = __CLASS__;
        $self = new $sc;
        $r = $request['response']['body'];
        $id = json_decode($r);
        $self->setOrganizationId($id->newId);
        $r = $self->Insert();
        if ($r) {
            $request['response']['code'] = 201; //created
            $request['response']['body'] = '{ "newId" : ' . $r . ' }';
        } else {
            $request['response']['code'] = 500; //Internal server error
        }
    }

    private static function NormalUpdate(array &$request)
    {
        $pc = self::$parentClassName;
        $pc::NormalUpdate($request);
        self::SelfUpdate($request);
    }

    private static function SelfUpdate(array &$request)
    {
        //
    }

    private static function SingleUpdate(array &$request, $s)
    {
        $organization = $s->getOrganization();
        $pc = self::$parentClassName;
        $pc::SingleUpdate($request, $organization);
        self::SelfSingleUpdate($request, $s);
    }

    private static function SelfSingleUpdate($request, $s)
    {
        //
    }

    private static function NormalDelete(array &$request)
    {
        $result = $request['response'];
        $pc = self::$parentClassName;
        $pc::NormalDelete($request);
        self::SelfDelete($request);
    }

    private static function SelfDelete(array &$request)
    {
        //@@think think think
        $r = self::BatchDelete($request['params']['filter']);
        if ($r) {
            $request['response']['code'] = 200; //ok
        } else {
            $request['response']['code'] = 404; //not found
        }
    }

    private static function SingleDelete(array &$request, $s)
    {
        $result = $request['response'];
        $organization = $s->getOrganization();
        $pc = self::$parentClassName;
        $pc::SingleDelete($request, $organization);
        self::SelfSingleDelete($request, $s);
    }

    private static function SelfSingleDelete(array &$request, $s)
    {
        $r = $s->Delete();
        if ($r) {
            $request['response']['code'] = 200; //ok
        } else {
            $request['response']['code'] = 404; //not found
        }
    }

    private static function NormalSelect(array &$request)
    {
        //@@think think think
        $pc = self::$parentClassName;
        $lists = $pc::Select($request['params']);
        if (count($lists) == 0) {
            $request['response']['code'] = 404; //Not Found
        } else {
            $request['response']['body'] = self::ToArrayJson($lists);
        }
    }

    private static function SelfSelect(array &$request)
    {
        //
    }

}

?>