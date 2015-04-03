<?php

trait NormalFacadeImpl
{

    private static function NormalInsert(array &$request)
    {
        $data = self::ConvertBodyToArray($request['body']);
        if ($data) {
            $ids = array();
            foreach ($data as $item) {
                $r = $item->Insert();
                if ($r) {
                    $ids[] = $r;
                } else {
                    $ids[] = NULL;
                }
            }
            $request['response']['code'] = 201; //created
            $request['response']['body'] = '{ "newId" : ' . json_encode($ids) . ' }';
            //$request['response']['code'] = 500; //Internal server error
        } else {
            $request['response']['code'] = 400; //bad request
        }
    }

    private static function SingleInsert(array &$request, $id)
    {
        $data = self::ConvertBodyToObject($request['body']);
        if ($data) {
            $data->setId($id);
            $r = $data->Insert();
            if ($r) {
                $request['response']['code'] = 201; //created
                $request['response']['body'] = '{ "newId" : ' . $r . ' }';
            } else {
                $request['response']['code'] = 500; //Internal server error
            }
        } else {
            $request['response']['code'] = 400; //bad request
        }
    }

    private static function NormalUpdate(array &$request)
    {
        $data = self::ConvertBodyToObject($request['body']);
        //@@add the filter by parent && regionExpression
        $filter = ConvertJsonToWhere($request['params']['filter']);
        $filter .= ' AND (' . $request['temp']['regionExpression'] . ')';
        $r = self::BatchUpdate($data, ' WHERE ' . $filter);
        if ($r) {
            $request['response']['code'] = 200; //ok
        } else {
            $request['response']['code'] = 500; //Internal server error
        }
    }

    private static function SingleUpdate(array &$request, $s)
    {
        $data = self::ConvertBodyToObject($request['body']);
        //$data->SetId(intval($child));
        //$r = $data->Update();
        $s->FillSelf($data);
        $r = $s->Update();
        if ($r) {
            $request['response']['code'] = 200; //ok
        } else {
            $request['response']['code'] = 404; //not found
        }
    }

    private static function NormalDelete(array &$request)
    {
        //@@add the filter by parent && regionExpression
        $filter = ConvertJsonToWhere($request['params']['filter']);
        $filter .= ' AND (' . $request['temp']['regionExpression'] . ')';
        $r = self::BatchDelete(' WHERE ' . $filter);
        if ($r) {
            $request['response']['code'] = 200; //ok
        } else {
            $request['response']['code'] = 404; //not found
        }
    }

    private static function SingleDelete(array &$request, $s)
    {
        //$r = self::BatchDelete(self::GetIdFilter($child));
        $r = $s->Delete();
        if ($r) {
            $request['response']['code'] = 200; //ok
        } else {
            $request['response']['code'] = 404; //not found
        }
    }

    private static function NormalSelect(array &$request)
    {
        //@@add the filter by parent && regionExpression
        $lists = self::Select($request['params'], $request['temp']['regionExpression']);
        if (count($lists) == 0) {
            $request['response']['code'] = 404; //Not Found
        } else {
            $request['response']['body'] = self::ToArrayJson($lists);
        }
    }

    private static function ConvertBodyToObject($json)
    {
        $data = json_decode($json, true);
        $className = __CLASS__;
        $result = new $className;
        $result->FillSelf((array)$data);
        return $result;
    }

    private static function ConvertBodyToArray($json)
    {
        $result = array();
        $data = json_decode($json, true);
        $className = __CLASS__;
        foreach ($data as $datum) {
            $item = new $className;
            $item->FillSelf((array)$datum);
            $result[] = $item;
        }
        return $result;
    }

}

?>
