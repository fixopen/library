<?php
/**
 * Created by PhpStorm.
 * User: fixopen
 * Date: 26/3/15
 * Time: 12:58
 */
/*
 * 所有的表中，关联二进制内容的（比如：头像、录音文件等），都记录它们（二进制文件）的uri。
 * 数字、字符串、布尔在PHP中就以各自的类型存储，数据库中亦如此，序列化为JSON的时候，对于数字，用""扩住。
 * 对于时戳和时间段，数据库用它自己的类型，PHP用DateTime和DateInterval（？？还是time和秒数？？），JSON用标准格式字符串。
 * 对于数组类型，数据库用自己的类型，PHP用array()，JSON就用数组表示法。
 * JSON表达各种类型的数据时，采用PostgreSQL的表达方式：
 * CAST ( expression AS type )
 * expression::type
 * typename ( expression )
 * type 'string'
 * 'string'::type
 * CAST ( 'string' AS type )
 * typename ( 'string' )
 */