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
    }

    public static function ToArrayJson(array $values)
    {
        $va = array();
        foreach ($values as $item) {
            $va[] = $item->ToJson();
        }
        return '[' . implode(', ', $va) . ']';
    }

}

?>
