<?php

trait NormalFacadeImpl
{

    private static function NormalInsert(array &$request)
    {
        $firstLetter = $request['body'][0];
        if ($firstLetter == '[') {
            $data = self::ConvertBodyToObjectArray($request['body']);
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
        } else if ($firstLetter == '{') {
            self::SingleInsert($request, 0);
        }
    }

    private static function SingleInsert(array &$request, $id)
    {
        $data = self::ConvertBodyToObject($request['body']);
        if ($data) {
            //if (isset($id)) {
                $data->setId($id);
            //} else {
            //    $data->setId(0);
            //}
            $r = $data->Insert();
            if (is_int($r) && ($r != -1)) {
                $request['response']['code'] = 201; //created
                $request['response']['body'] = '{ "newId" : ' . $r . ' }';
            } else {
                $request['response']['code'] = 500; //Internal server error
                $request['response']['body'] = '{"state": "[' . $r . '] execute error"}';
            }
        } else {
            $request['response']['code'] = 400; //bad request
        }
    }

    private static function NormalUpdate(array &$request)
    {
        $data = self::ConvertBodyToArray($request['body']);
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
        $data = self::ConvertBodyToArray($request['body']);
        //$data->SetId(intval($child));
        //$r = $data->Update();
        //print_r($data);
        $s->FillSelf($data);
        //print_r($s);
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
        //print_r($lists);
        if (count($lists) == 0) {
            //print 'hello, not found<br />';
            $request['response']['code'] = 404; //Not Found
            //print_r($request['response']);
        } else {
            $request['response']['body'] = self::ToArrayJson($lists);
        }
    }

    public function FillSelf($row)
    {
        //print '======================================<br />';
        //print_r($this);
        //print_r($row);
        foreach ($this as $key => $value) {
            $type = self::GetTypeByName($key);
            $value = NULL;
            if (is_array($row) && array_key_exists($key, $row)) {
                $value = $row[$key];
            } else if (is_object($row)) {
                $value = $row->$key;
            }
            if (/*!is_string($value) && */($value === NULL)) {
                //$this->$key = NULL;
            } else {
                switch ($type) {
                    case 'int2':
                    case 'int4':
                        $value = intval($value);
                        break;
                    case 'int8':
                        //$value = $value;
                        break;
                    default:
                        break;
                }
                $this->$key = $value;
            }
        }
        //print_r($this);
        //print '**************************************<br />';
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
        $data = json_decode($json, true);
        $result = array();
        foreach ($data as $key => $value) {
            $result[$key] = $value;
        }
        return $result;
    }

    private static function ConvertBodyToObjectArray($json)
    {
        $result = array();
        //print $json . '<br />';
        $data = json_decode($json, true);
        //print_r($data);
        $className = __CLASS__;
        foreach ($data as $datum) {
            $item = new $className;
            $item->FillSelf((array)$datum);
            $result[] = $item;
        }
        //print_r($result);
        return $result;
    }

}

?>
