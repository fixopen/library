<?php

trait Statistics
{

    private static $statsMethod = array('avg', 'binary_checksum',
        'bit_and', 'bit_or', 'bit_xor',
        'checksum', 'checksum_agg',
        'count', 'group_concat', 'first', 'last', 'max', 'min',
        'std', 'stddev_pop', 'stddev_samp', 'stddev', 'stdev', 'stdevp',
        'sum', 'var', 'varp', 'var_pop', 'var_samp', 'variance');

    public static function Stats($filter, $calc)
    {
        $result = -1;
        $whereClause = ' WHERE ' . $filter;
        if (empty($filter)) {
            $whereClause = '';
        }
        $query = 'SELECT ' . $calc . ' FROM ' . self::Mark(self::$tableName) . $whereClause;
        $r = Database::GetInstance()->query($query);
        if ($r) {
            foreach ($r as $row) {
                $result = $row[0];
            }
        }
        return $result;
    }

}

?>
