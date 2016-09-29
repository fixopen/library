<?php

class users
{

    private static $tableName = 'user';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        Session,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
        DataAccess::specFilter as commonSpecFilter;
        JSON::ToJson as privateToJson;
    }
//
// step by day (time duration)\ total\ new
//
//
// &&--now total
// &&--timestamp total
//
// today total
// yestoday total
// .. total
// [{time, total, distance}, ...]

//SELECT count(*) FROM users WHERR register < ..
    private static $classSpecSubresource = array(
        'top' => 'topProc',
        'export' => 'exportProc'
        );
    function exportProc(array &$request) {
        //step1: get data from database
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
            case 'count':
                if($whereClause){
                    $query = 'SELECT "registerTime","no","lastOperationTime" From "user" WHERE 1=1'.$whereClause.' ORDER BY "registerTime" ASC';
                }else{
                    $query = 'SELECT "registerTime","no","lastOperationTime" From "user" ORDER BY "registerTime" ASC';
                }
                $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                if ($r) {
                    foreach ($r as $row) {
                        $item = new stdClass();
                        $item->registerTime =date("Y-m-d",$row['registerTime']);
                        $item->no =$row['no'];
                        $item->lastOperationTime =date("Y-m-d",$row['lastOperationTime']);
                        $result[] = $item;
                    }
                }
                break;
            default:
                $request['code'] = 400; //bad request
                break;
        }

        $data = $result; //data is table-like

        //step2: write to file
        $filename ="export-users.csv"; //random string
        $file = fopen($filename, 'w');
//        print_r($file.'>>>>>>>>>>>>>>>');
        //fputcsv($file, array_keys($row)); //write header for csv or not??
//        print_r($data);
        foreach ($data as $row) {
//            print_r($row);
            fputcsv($file, $row);
        }
        fclose($file);
        //step3: fill response for client
//        $request['response']['headers']['Content-Type'] = 'text/csv';
//        $request['response']['headers']['Content-Disposition'] = 'attachment;filename=' . $filename;
//        $item = new stdClass();
//        $item->fileName=$filename;
//        $name[]=$item;
        $request['response']['body'] = $filename;
    }

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
                        case 'count':
                            if($whereClause){
                                $query = 'SELECT "registerTime" From "user" WHERE 1=1'.$whereClause.' ORDER BY "registerTime" ASC LIMIT 1';
                            }else{
                                $query = 'SELECT "registerTime" From "user" ORDER BY "registerTime" ASC LIMIT 1';
                            }
                            $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
                            if ($r) {
                                foreach ($r as $row) {
                                    $item = new stdClass();
                                    $item->count =intval((strtotime(date("Y-m-d",time()))-($row['registerTime']))/86400)+2;
                                    $result[] = $item;
                                }
                            }
//                            print_r($result);
//                            foreach ($result as $stats) {
//                                $beginTime[] = $stats -> registerTime;
//                            }
//                            $now = time();
//                            print_r($now);
//                            $today = new DateTime('2000-01-20');
//                            $date = strtotime(date("Y-m-d",time()));
//                            print_r($date);
//                            print_r('>>>>>>>>>>>');
//                            print_r($today);
                            //$today->setTime(0, 0, 0);
//                            $date = $today->format('Y-m-d');
//                            print_r($date);
//                            $result[0] = intval((strtotime(date("Y-m-d",time()))-$beginTime[0])/86400)+2;
//                            print_r($result);
                            $request['response']['body'] = self::ToArrayJson($result);
                            break;
                        case 'page':
                            $offset = $request['params']['offset'];
                            $count = $request['params']['count'];
                            if($whereClause){
                                $queryCount = 'SELECT count("id") FROM "user" where 1=1'.$whereClause;
                                $r = Database::GetInstance()->query($queryCount, PDO::FETCH_ASSOC);
//                                print_r($r);
                                $item = new stdClass();
                                foreach ($filterJson as $key => $value) {
                                    if($key === 'userFrom'){
                                        $item->from  = $value;
                                    }
                                    if($key === 'userTo'){
                                        $item->to  = $value;
                                    }
                                }
                                $item->totalCount = 0;
                                $item->count = 0;
                                $result[0] = $item;
                                if ($r) {
                                    foreach ($r as $row) {
                                        $item->totalCount = $row['count'];
                                        $item->count = $row['count'];
                                        $result[0] = $item;
                                    }
                                }
                                $request['response']['body'] = self::ToArrayJson($result);

                            }else{
                                if($offset == 0){
                                    $time = time();
                                    $timePoint = strtotime(date("Y-m-d",time()));
                                }else{
                                    $time = strtotime(date("Y-m-d",time()))-86400*($offset);
                                }
                                $queryCount = 'SELECT count("id") FROM "user" where "registerTime" < '.$time;
                                $r = Database::GetInstance()->query($queryCount, PDO::FETCH_ASSOC);
                                if ($r) {
                                    foreach ($r as $row) {
                                        $item = new stdClass();
                                        $item->totalCount = $row['count'];
                                        $total = $row['count'];
                                    }
                                }
//                            print $total;
                                for($a=0;$a<$count;$a++){
                                    if($offset == 0){
                                        if($a == 0){
                                            //print '0';
                                            $query = 'SELECT count("id") FROM "user" where "registerTime" < '.$time.' AND "registerTime" >'.$timePoint;
                                        }else{
                                            //print 'other';
                                            $query = 'SELECT count("id") FROM "user" where "registerTime" < '.$timePoint.' AND "registerTime" >'.($timePoint-86400*($offset+$a));
                                        }
                                    }else{
//                                    print_r($time);
//                                    print_r($time-86400*($offset-$a-1));
                                        $query = 'SELECT count("id") FROM "user" where "registerTime" < '.($time-86400*($a)).' AND "registerTime" >'.($time-86400*($a+1));
//                                    print_r($query);
                                    }
                                    $r = Database::GetInstance()->query($query, PDO::FETCH_ASSOC);
//                                    print_r($r);
                                    if ($r) {
                                        foreach ($r as $row) {
//                                            print_r($row['count']."<br/>");
                                            $item = new stdClass();
                                            if($a == 0){
                                                $item->date = date("Y-m-d",$time);
                                            }else{
                                                $item->date = date("Y-m-d",$time-86400*($a));
                                            }
                                            if($a==0){
                                                $item->totalCount = $total;
                                            }else{
                                                $total -= ($result[$a-1]->count);
                                                if($total == 0){
                                                    break;
                                                }else{
                                                    $item->totalCount = $total;
                                                }
                                            }
                                            $item->count = $row['count'];
                                            $result[] = $item;
                                        }
                                    }
                                }
                            }

//                            print_r($result);
                            $request['response']['body'] = self::ToArrayJson($result);
                            break ;
                        case 'follow':
                            $query = 'SELECT "bookId", count(*) AS "followCount" FROM "business" WHERE "action" = ' . "'Follow'" . $whereClause . ' GROUP BY "bookId" ORDER BY "followCount" DESC LIMIT 10';
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
                            $query = 'SELECT "id", "name" FROM "book" WHERE "id" IN (' . implode(', ', $bookIds) . ')';
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
                            $query = 'SELECT "bookId", count(*) AS "viewCount" FROM "business" WHERE "action" = ' . "'View'" . $whereClause . ' GROUP BY "bookId" ORDER BY "viewCount" DESC LIMIT 10';
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
                            $query = 'SELECT "id", "name" FROM "book" WHERE "id" IN (' . implode(', ', $bookIds) . ')';
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
                            $query = 'SELECT "bookId", COUNT(*) AS "downloadCount" FROM "business" WHERE "action" = ' . "'Download'" . $whereClause . ' GROUP BY "bookId" ORDER BY "downloadCount" DESC LIMIT 10';
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
                            $query = 'SELECT "id", "name" FROM "book" WHERE "id" IN (' . implode(', ', $bookIds) . ')';
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
            default:
                break;
        }
        //print_r($request);
        return $request;
    }


    private $no = '';
    private $registerTime = NULL; // timestamp(4) without time zone,
    private $lastOperationTime = NULL; //timestamp(4) without time zone,
    private $sessionId = NULL;

    private static function specFilter($name, $value) {
        $result = self::commonSpecFilter($name, $value);
        if ($name === 'fromTime') {
            $result = '"registerTime" > ' . strtotime($value . 'T00:00:00');
        }
        if ($name === 'toTime') {
            $result = '"registerTime" < ' . strtotime($value . 'T00:00:00');
        }
        if ($name === 'userFrom') {
            $result = '"registerTime" > ' . strtotime($value . 'T00:00:00');
        }
        if ($name === 'userTo') {
            $result = '"registerTime" < ' . strtotime($value . 'T00:00:00');
        }
//        print 'user key is ' . $result . '<br />';
        return $result;
    }

    public function ToJson()
    {
        $this->registerDate = date('Y-n-j', $this->registerTime);
        return $this->privateToJson();
    }

    public static function IsPrimaryKey($no)
    {
        //print 'user key is ' . $v . '<br />';
        $result = self::GetOne('sessionId', $no);
        if ($result == FALSE) {
            $result = self::GetOne('no', $no);
            if ($result == FALSE) {
                $result = self::isPrimary($no);
            }
        }
        return $result;
    }

    public function getNo()
    {
        return $this->no;
    }

    public function setNo($no)
    {
        $this->no = $no;
    }

    public function getRegisterTime()
    {
        return $this->registerTime;
    }

    public function setRegisterTime($registerTime)
    {
        $this->registerTime = $registerTime;
    }

    public function getLastOperationTime()
    {
        return $this->lastOperationTime;
    }

    public function setLastOperationTime($lastOperationTime)
    {
        $this->lastOperationTime = $lastOperationTime;
    }

    public function getSessionId()
    {
        return $this->sessionId;
    }

    public function setSessionId($sessionId)
    {
        $this->sessionId = $sessionId;
    }

}

?>
