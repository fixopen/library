<?php

class books
{

    private static $tableName = 'book';

    private static $classSpecSubresource = array(
        'updateSince' => 'updateSinceProc',
        'groups' => 'groupsProc',
        'counted' => 'countedProc',
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
                    $sql = 'select "name","author","authorAlias","publisher","isbn","firstLevelClassify","secondLevelClassify","keywords","abstract" from book where 1=1 '.$whereClause;
                }else{
                    $sql = 'select "name","author","authorAlias","publisher","isbn","firstLevelClassify","secondLevelClassify","keywords","abstract" from book ';
                }
                $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                if ($r) {
                    foreach ($r as $row) {
                        $item = new stdClass();
                        $item->name =$row['name'];
                        $item->author =$row['author'];
                        $item->authorAlias =$row['authorAlias'];
                        $item->publisher =$row['publisher'];
                        $item->isbn =$row['isbn'];
                        $item->firstLevelClassify =$row['firstLevelClassify'];
                        $item->secondLevelClassify =$row['secondLevelClassify'];
                        $item->keywords =$row['keywords'];
                        $item->abstract =$row['abstract'];
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
        $filename ="export-books.csv"; //random string
        $file = fopen($filename, 'w');
        //fputcsv($file, array_keys($row)); //write header for csv or not??
//        print_r($file);
        foreach ($data as $row) {
//            print_r($row);
            fputcsv($file, $row);
        }
        fclose($file);
        $request['response']['body'] = $filename;
    }

    public static function countedProc(array &$request){
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PATCH':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                if ($count == 0) {
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
//                    $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='小说' and b.id = bu."bookId" and bu.action='Download';'
                    $bookKind= [];
                    if($whereClause){
                        $sql = 'select "firstLevelClassify" from book where 1=1 '.$whereClause.' group by "firstLevelClassify"';
                    }else{
                        $sql = 'select "firstLevelClassify" from book group by "firstLevelClassify"';
                    }
                    $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                    if ($r) {
                        foreach ($r as $row) {
                            $item = new stdClass();
                            $item->name =$row['firstLevelClassify'];
                            $bookKind[] = $item;
                        }
                    }
                    foreach($bookKind as $one){
                        $item = new stdClass();
                        $item->name = $one->name;
//                        print_r($one);
                        if($whereClause){
                            $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='."'" . $one->name. "'" .$whereClause.' and b.id = bu."bookId" and bu.action='."'".Download."'";
                        }else{
                            $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='."'" . $one->name. "'" . ' and b.id = bu."bookId" and bu.action='."'".Download."'";
                        }
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        if ($r) {
                            foreach ($r as $row) {
                                $item->Download =$row['count'];
                            }
                        }
                        if($whereClause){
                            $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='."'" . $one->name. "'" .$whereClause.' and b.id = bu."bookId" and bu.action='."'".View."'";
                        }else{
                            $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='."'" . $one->name. "'" . ' and b.id = bu."bookId" and bu.action='."'".View."'";
                        }
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        if ($r) {
                            foreach ($r as $row) {
                                $item->View =$row['count'];
                            }
                        }
                        if($whereClause){
                            $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='."'" . $one->name. "'" .$whereClause.' and b.id = bu."bookId" and bu.action='."'".Follow."'";
                        }else{
                            $sql ='select count(bu.*) from book b, business bu where "firstLevelClassify"='."'" . $one->name. "'" . ' and b.id = bu."bookId" and bu.action='."'".Follow."'";
                        }
                        $r = Database::GetInstance()->query($sql, PDO::FETCH_ASSOC);
                        if ($r) {
                            foreach ($r as $row) {
                                $item->Follow =$row['count'];
                            }
                        }
                        $result[] = $item;
                    }
//                    $request['response']['code'] = 200; //bad request
                    $request['response']['body'] = self::ToArrayJson($result);
//                    print_r($request);
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "must include [time] path segment"}';
                }
                break;
            case 'DELETE':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            default:
                break;
        }
        return $request;
    }

    public static function updateSinceProc(array &$request)
    {
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PATCH':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                if ($count == 1) {
                    $time = urldecode(array_shift($request['paths']));
                    $where = ' WHERE ' . self::mark('lastUpdateTime') . ' > CAST ( \'' . $time . '\' AS TIMESTAMP WITHOUT TIME ZONE) ORDER BY '  . self::mark('lastUpdateTime') . ' ASC ';
                    $books = self::CustomSelect($where);
                    $syncInfo = array();
                    foreach ($books as $book) {
                        $syncInfo[] = $book->toSyncJson();
                    }
                    $request['response']['body'] = '[' . implode(', ', $syncInfo) . ']';
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "must include [time] path segment"}';
                }
                break;
            case 'DELETE':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            default:
                break;
        }
        return $request;
    }

    public static function groupsProc(array &$request)
    {
        $count = count($request['paths']);
        switch ($request['method']) {
            case 'POST':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'PATCH':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                if ($count == 1) {
                    $groupName = array_shift($request['paths']);
                    //SELECT $groupName from self::tableName GROUP BY $groupName
                    $groups = self::GroupSelect($groupName);
                    $request['response']['body'] = '[' . implode(', ', $groups) . ']';
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "must include [time] path segment"}';
                }
                break;
            case 'DELETE':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            default:
                break;
        }
        return $request;
    }

    public function toSyncJson()
    {
        $fields = array();
        foreach ($this as $key => $value) {
            if ($key == 'id' || $key == 'lastUpdateTime' || $key == 'authorizationEndTime') {
                $fields[] = self::JsonMark($key) . ': ' . self::JsonQuote($value);
            }
        }
        return '{' . implode(', ', $fields) . '}';
    }

    public function getContent($type)
    {
        $ext = 'txt';
        if ($this->mimeType == 'application/pdf') {
            $ext = 'pdf';
        }
        $base = 'C:/httpd-2.4.12-win64-VC11/Apache24/htdocs/Library/var/';
        //$base = 'D:/php+apache/apache/Apache24/htdocs/library/var/';
        //$base = '/Library/WebServer/Documents/var/';
        //$base = '/Users/fixopen/Documents/work/var/';
        $prefix = $base . 'books/';
        if ($type != '') {
            $prefix = $base . $type . '/';
            $ext = 'jpg';
        }
        //$prefix = '/Library/WebServer/Documents/var/books/';
        return $prefix . $this->getId() . '.' . $ext;
    }

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        BinaryDownloader,
        BinaryUploader,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        NormalFacadeImpl::FillSelf as commonFillSelf;
        DataAccess::IsPrimaryKey as isPrimary;
        DataAccess::specFilter as commonSpecFilter;
    }

    private $name = ''; //character varying(256),
    private $author = ''; //character varying(128),
    private $authorAlias = ''; //character varying(128),
    private $publisher = ''; //character varying(256),
    private $publishTime = ''; //character varying(16),
    private $isbn = ''; //character varying(24),
    private $standardClassify = ''; //character varying(16),
    private $firstLevelClassify = ''; //character varying(16),
    private $secondLevelClassify = ''; //character varying(16),
    private $authorizationEndTime = ''; //timestamp(4) without time zone,
    private $keywords = ''; //character varying(256),
    private $abstract = ''; //text,
    private $order = ''; //bigint,
    private $resourceId = ''; //bigint,
    private $lastUpdateTime = 'now'; //timestamp(4) without time zone,
    private $mimeType = '';
    private $isBan = FALSE;

    private static function specFilter($name, $value) {
        $result = self::commonSpecFilter($name, $value);
        if ($name === 'isBan') {
            if ($value === 'isBan' || $value === TRUE) {
                $result = '"isBan" = TRUE';
                //print nl2br('isBan is here' . PHP_EOL);
            } else if ($value == 'normal' || $value === FALSE) {
                $result = '"isBan" = FALSE';
            } else {
                //still empty
            }
        }
        if($name === 'name'){
            $result = '"name" like ' . "'%{$value}%'";
        }
        if($name === 'author'){
            $result = '"author" like ' . "'%{$value}%'";
        }
        if($name === 'publisher'){
            $result = '"publisher" like ' . "'%{$value}%'";
        }
        if($name === 'bookSelect'){
            $result = '"firstLevelClassify" = ' . "'{$value}'";
        }
        if ($name === 'bookFrom') {
            $result = '"lastUpdateTime" > ' ."'{$value}'"  ;
        }
        if ($name === 'bookTo') {
            $result = '"lastUpdateTime" < ' ."'{$value}'";
        }
        return $result;
    }

    public function FillSelf($row)
    {
        $this->commonFillSelf($row);
        $this->lastUpdateTime = 'now';
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor($author)
    {
        $this->author = $author;
    }

    public function getAuthorAlias()
    {
        return $this->authorAlias;
    }

    public function setAuthorAlias($authorAlias)
    {
        $this->authorAlias = $authorAlias;
    }

    public function getPublisher()
    {
        return $this->publisher;
    }

    public function setPublisher($publisher)
    {
        $this->publisher = $publisher;
    }

    public function getPublishTime()
    {
        return $this->publishTime;
    }

    public function setPublishTime($publishTime)
    {
        $this->publishTime = $publishTime;
    }

    public function getIsbn()
    {
        return $this->isbn;
    }

    public function setIsbn($isbn)
    {
        $this->isbn = $isbn;
    }

    public function getStandardClassify()
    {
        return $this->standardClassify;
    }

    public function setStandardClassify($standardClassify)
    {
        $this->standardClassify = $standardClassify;
    }

    public function getFirstLevelClassify()
    {
        return $this->firstLevelClassify;
    }

    public function setFirstLevelClassify($firstLevelClassify)
    {
        $this->firstLevelClassify = $firstLevelClassify;
    }

    public function getSecondLevelClassify()
    {
        return $this->secondLevelClassify;
    }

    public function setSecondLevelClassify($secondLevelClassify)
    {
        $this->secondLevelClassify = $secondLevelClassify;
    }

    public function getAuthorizationEndTime()
    {
        return $this->authorizationEndTime;
    }

    public function setAuthorizationEndTime($authorizationEndTime)
    {
        $this->authorizationEndTime = $authorizationEndTime;
        $this->lastUpdateTime = 'now';
    }

    public function getKeywords()
    {
        return $this->keywords;
    }

    public function setKeywords($keywords)
    {
        $this->keywords = $keywords;
    }

    public function getAbstract()
    {
        return $this->abstract;
    }

    public function setAbstract($abstract)
    {
        $this->abstract = $abstract;
    }

    public function getOrder()
    {
        return $this->order;
    }

    public function setOrder($order)
    {
        $this->order = $order;
    }

    public function getResourceId()
    {
        return $this->resourceId;
    }

    public function setResourceId($resourceId)
    {
        $this->resourceId = $resourceId;
    }

    public function getLastUpdateTime()
    {
        return $this->lastUpdateTime;
    }

    public function setLastUpdateTime($lastUpdateTime)
    {
        $this->lastUpdateTime = $lastUpdateTime;
    }

    public function getMimeType()
    {
        return $this->mimeType;
    }

    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
    }

    public function isIsBan()
    {
        return $this->isBan;
    }

    public function setIsBan($isBan)
    {
        $this->isBan = $isBan;
        $this->lastUpdateTime = 'now';
    }

}

?>
