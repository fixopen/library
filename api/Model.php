<?php

/**
 * Created by PhpStorm.
 * User: fixopen
 * Date: 1/4/15
 * Time: 15:44
 */
class Model
{
    private static $tableName;
    private static $types = array();

    private static function Mark($n)
    {
        //return '`' . $n . '`';
        return '"' . $n . '"';
    }

    private static function DatabaseQuote($v, $type)
    {
        $result = '';
        if (is_null($v)) {
            $result = 'NULL';
        } else {
            switch ($type) {
                case 'varchar':
                case 'text':
                case 'char':
                case 'bpchar':
                    $result = "'" . $v . "'";
                    break;
                case 'int2':
                case 'int4':
                case 'int8':
                case 'float4':
                case 'float8':
                    $result = $v;
                    break;
            }
        }
        return $result;
    }

    public static function GetTableType()
    {
        if (count(self::$types) == 0) {
            $r = Database::GetInstance()->query('SELECT * FROM ' . self::Mark(self::$tableName) . ' LIMIT 1', PDO::FETCH_ASSOC);
            if ($r) {
                $columnCount = $r->columnCount();
                for ($i = 0; $i < $columnCount; ++$i) {
                    $metaInfo = $r->getColumnMeta($i);
                    self::$types[$metaInfo['name']] = $metaInfo['native_type'];
                }
            }
        }
    }

    public static function MetaPrepare($tableName)
    {
        self::$tableName = $tableName;
        self::GetTableType();
    }

    public function __construct()
    {
        foreach (self::$types as $name => $type) {
            $this->$name = NULL;
        }
    }

    public function __get($key)
    {
        return $this->$key;
    }

    public function __set($key, $value)
    {
        $this->$key = $value;
    }

}

/**
-- Table: test

-- DROP TABLE test;

CREATE TABLE test
(
id bigint, int8
c1 "char", char
c2 "char"[], _char
c3 abstime, abstime
c4 abstime[], _abstime
c5 bigint[], _int8
c6 bigserial NOT NULL, int8
c7 bit(1), bit
c8 bit varying(16), varbit
c9 bit varying(16)[], _varbit
c10 bit(1)[], _bit
c11 boolean, bool
c12 boolean[], _bool
c13 box, box
c14 box[], _box
c15 bytea, bytea
c16 bytea[], _bytea
c17 character(16), bpchar
c18 character varying(16), varchar
c19 character varying(16)[], _varchar
c20 character(16)[], _bpchar
c21 cid, cid
c22 cid[], _cid
c23 cidr, cidr
c24 cidr[], _cidr
c25 circle, circle
c26 circle[], _circle
c28 date, date
c29 date[], _date
c30 daterange, daterange
c31 daterange[], _daterange
c32 double precision, float8
c33 double precision[], _float8
c34 gtsvector, gtsvector
c35 gtsvector[], _gtsvector
c36 inet, inet
c37 inet[], _inet
c38 int2vector, int2vector
c39 int2vector[], _int2vector
c40 int4range, int4range
c41 int4range[], _int4range
c42 int8range, int8range
c43 int8range[], _int8range
c44 integer, int4
c45 integer[], _int4
c46 interval, interval
c47 interval(6)[], _interval
c48 json,
c49 json[],
c50 line,
c51 line[],
c52 lseg,
c53 lseg[],
c54 macaddr,
c55 macaddr[],
c56 money,
c57 macaddr[],
c58 name,
c59 name[],
c60 numeric(8,4),
c61 numeric(8,4)[],
c62 numrange,
c63 numrange[],
c64 oid,
c65 oid[],
c66 oidvector,
c67 oidvector[],
c68 path,
c69 path[],
c70 pg_node_tree,
c71 point,
c72 point[],
c73 polygon,
c74 polygon[],
c75 real, float4
c76 real[], _float4
c77 refcursor,
c78 refcursor[],
c79 regclass,
c80 regclass[],
c81 regconfig,
c82 regconfig[],
c83 regdictionary,
c84 regdictionary[],
c85 regoper,
c86 regoperator[],
c88 regoperator,
c87 regoper[],
c89 regproc,
c90 regproc[],
c91 regprocedure,
c92 regprocedure[],
c93 regtype,
c94 regtype[],
c95 reltime,
c96 reltime[],
c97 serial NOT NULL, int4
c98 smallint, int2
c100 smallserial NOT NULL, int2
c101 smgr,
c102 text,
c104 tid,
c105 tid[],
c106 time(6) with time zone, timetz
c110 timestamp(6) with time zone, timestamptz
c111 timestamp(6) with time zone[], _timestamptz
c112 timestamp(6) without time zone, timestamp
c113 timestamp(6) without time zone[], _timestamp
c114 tinterval,
c115 tinterval[],
c116 tsquery,
c117 tsquery[],
c118 tsrange,
c119 tsrange[],
c120 tstzrange,
c121 tstzrange[],
c122 tsvector,
c123 tsvector[],
c124 txid_snapshot,
c125 txid_snapshot[],
c126 uuid,
c127 uuid[],
c129 xid,
c130 xid[],
c131 xml,
c132 xml[],
c133 calltype,
c134 calltype[],
c135 grouptype,
c136 grouptype[],
c137 operation
)
WITH (
OIDS=FALSE
);
ALTER TABLE test
OWNER TO postgres;
 */