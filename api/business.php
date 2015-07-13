<?php

class business
{

    private static $tableName = 'business';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
        JSON::ToJson as privateToJson;
        //NormalFacadeImpl::ConvertBodyToObjectArray as commonConvert;
        NormalFacadeImpl::FillSelf as commonFillSelf;
    }

    //id bigint NOT NULL,
    private $userId = NULL; //bigint,
    private $deviceId = NULL; //bigint,
    private $bookId = NULL; //bigint,
    private $time = NULL; //timestamp(4) without time zone,
    private $action = ''; //actiontype

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
            if ($key === 'userId' && $value !== NULL) {
                $user = users::GetOne('no', $value);
                $now = time();
                if ($user) {
                    $user->setLastOperationTime($now);
                    $user->Update(TRUE);
                } else {
                    $user = new users();
                    $user->setNo($value);
                    $user->setRegisterTime($now);
                    $user->setLastOperationTime($now);
                    //$user->setId($user->Insert());
                    $user->Insert();
                }
                //insert user if not exist
                //update user's lastOperationTime if exist
                //get really userId and set to $value
                $value = $user->getId();
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

    private static $classSpecSubresource = array('top' => 'topProc');

    public static function topProc(array &$request)
    {
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
                break;
            case 'PATCH':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                if ($count == 1) {
                    $result = array();
                    $whereClause = '';
                    $filter = $request['params']['filter'];
                    if ($filter != '') {
                        $filterJson = json_decode($filter);
                        $where = array();
                        foreach ($filterJson as $key => $value) {
                            $condition = self::specFilter($key, $value);
                            if ($condition == '') {
                                if (is_null($value)) {
                                    $where[] = self::Mark($key) . ' IS NULL';
                                } else {
                                    $where[] = self::Mark($key) . ' = ' . self::DatabaseQuote($value, self::GetTypeByName($key));
                                }
                            } else {
                                $where[] = $condition;
                            }
                        }
                        //print_r($where);
                        $whereClause = ' AND ' . implode(' AND ', $where);
                    }
                    $dir = array_shift($request['paths']);
                    switch ($dir) {
                        case 'follow':
                            $query = 'SELECT "bookId", count(*) AS "followCount" FROM "business" WHERE "action" = ' . "'Follow'" . $whereClause . ' GROUP BY "bookId" ORDER BY "followCount" LIMIT 10';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $item = new stdClass();
                                    $item->bookId = $row['bookId'];
                                    $item->followCount = $row['followCount'];
                                    $item->viewCount = 0;
                                    $item->downloadCount = 0;
                                    $result[] = $item;
                                }
                            }
                            //print_r($result);
                            $bookIds = array();
                            foreach ($result as $stats) {
                                $bookIds[] = $stats->bookId;
                            }
                            //print_r($bookIds);
                            //print implode(', ', $bookIds) . '<br />';
                            $query = 'SELECT "bookId", count(*) AS "viewCount" FROM "business" WHERE "action" = ' . "'View' AND " . '"bookId" IN (' . implode(', ', $bookIds) . ') GROUP BY "bookId"';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['bookId'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->viewCount = $row['viewCount'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $query = 'SELECT "bookId", count(*) AS "downloadCount" FROM "business" WHERE "action" = ' . "'Download' AND " . '"bookId" IN (' . implode(', ', $bookIds) . ') GROUP BY "bookId"';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['bookId'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->downloadCount = $row['downloadCount'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $query = 'SELECT "id", name" FROM "book" WHERE "id" IN (' . implode(', ', $bookIds) . ')';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['id'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->name = $row['name'];
                                            break;
                                        }
                                    }
                                }
                            }
                            //print_r($result);
                            $request['response']['body'] = self::ToArrayJson($result);
                            //print $request['body'];
                            break;
                        case 'view':
                            $query = 'SELECT "bookId", count(*) AS "viewCount" FROM "business" WHERE "action" = ' . "'View'" . $whereClause . ' GROUP BY "bookId" ORDER BY "viewCount" LIMIT 10';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $item = new stdClass();
                                    $item->bookId = $row['bookId'];
                                    $item->viewCount = $row['viewCount'];
                                    $item->downloadCount = 0;
                                    $item->followCount = 0;
                                    $result[] = $item;
                                }
                            }
                            $bookIds = array();
                            foreach ($result as $stats) {
                                $bookIds[] = $stats->bookId;
                            }
                            $query = 'SELECT "bookId", count(*) AS "followCount" FROM "business" WHERE "action" = ' . "'Follow' AND " . '"bookId" IN (' . implode(', ', $bookIds) . ') GROUP BY "bookId"';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['bookId'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->followCount = $row['followCount'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $query = 'SELECT "bookId", count(*) AS "downloadCount" FROM "business" WHERE "action" = ' . "'Download' AND " . '"bookId" IN (' . implode(', ', $bookIds) . ') GROUP BY "bookId"';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['bookId'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->downloadCount = $row['downloadCount'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $query = 'SELECT "id", name" FROM "book" WHERE "id" IN (' . implode(', ', $bookIds) . ')';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['id'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->name = $row['name'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $request['response']['body'] = self::ToArrayJson($result);
                            break;
                        case 'download':
                            $query = 'SELECT "bookId", COUNT(*) AS "downloadCount" FROM "business" WHERE "action" = ' . "'Download'" . $whereClause . ' GROUP BY "bookId" ORDER BY "downloadCount" LIMIT 10';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $item = new stdClass();
                                    $item->bookId = $row['bookId'];
                                    $item->downloadCount = $row['downloadCount'];
                                    $item->viewCount = 0;
                                    $item->followCount = 0;
                                    $result[] = $item;
                                }
                            }
                            $bookIds = array();
                            foreach ($result as $stats) {
                                $bookIds[] = $stats->bookId;
                            }
                            $query = 'SELECT "bookId", count(*) AS "viewCount" FROM "business" WHERE "action" = ' . "'View' AND " . '"bookId" IN (' . implode(', ', $bookIds) . ') GROUP BY "bookId"';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['bookId'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->viewCount = $row['viewCount'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $query = 'SELECT "bookId", count(*) AS "followCount" FROM "business" WHERE "action" = ' . "'Follow' AND " . '"bookId" IN (' . implode(', ', $bookIds) . ') GROUP BY "bookId"';
                            //print $query . '<br />';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['bookId'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->followCount = $row['followCount'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $query = 'SELECT "id", name" FROM "book" WHERE "id" IN (' . implode(', ', $bookIds) . ')';
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $bookId = $row['id'];
                                    foreach ($result as $stats) {
                                        if ($stats->bookId == $bookId) {
                                            $stats->name = $row['name'];
                                            break;
                                        }
                                    }
                                }
                            }
                            $request['response']['body'] = self::ToArrayJson($result);
                            break;
                        default:
                            $request['code'] = 400; //bad request
                            break;
                    }
                } else {
                    $request['code'] = 400; //bad request
                }
                break;
            case 'DELETE':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            default:
                break;
        }
        //print_r($request);
        return $request;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getDeviceId()
    {
        return $this->deviceId;
    }

    public function setDeviceId($deviceId)
    {
        $this->deviceId = $deviceId;
    }

    public function getBookId()
    {
        return $this->bookId;
    }

    public function setBookId($bookId)
    {
        $this->bookId = $bookId;
    }

    public function getTime()
    {
        return $this->time;
    }

    public function setTime($time)
    {
        $this->time = $time;
    }

    public function getAction()
    {
        return $this->action;
    }

    public function setAction($action)
    {
        $this->action = $action;
    }

}

?>
