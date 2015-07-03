<?php

trait JSON
{

    private static function JsonMark($n)
    {
        return '"' . $n . '"';
    }

    private static function JsonQuote($v)
    {
        $result = '';
        if (is_null($v)) {
            $result = 'null';
        } else if (is_bool($v)) {
            $result = $v ? 'true' : 'false';
        } else if (is_string($v)) {
            $v = preg_replace('/\"/', '\\"', $v);
            $result = '"' . $v . '"';
        } else {
            $result .= $v;
        }
        return $result;
    }

    public function ToJson()
    {
        $fields = array();
        foreach ($this as $key => $value) {
            if ($key[0] == '_') {
                continue;
            }
            $fields[] = self::JsonMark($key) . ': ' . self::JsonQuote($value);
        }
        return '{' . implode(', ', $fields) . '}';
        //return json_encode($this);
    }

    public static function UnifyToJson($d) {
        $result = '{}';
        //print_r($d);
        $c = new ReflectionClass($d);
        if ($c->hasMethod('ToJson')) {
            //print_r($d);
            $result = $d->ToJson();
        } else {
            //print_r($d);
            $result = json_encode($d);
            //print 'result is ' . $result . '<br />';
        }
        return $result;
    }

    public static function ToArrayJson(array $values)
    {
        //print_r($values);
        $va = array();
        foreach ($values as $item) {
            //$va[] = $item->ToJson();
            $va[] = self::UnifyToJson($item);
        }
        //print_r($va);
        return '[' . implode(', ', $va) . ']';
    }

}

?>
