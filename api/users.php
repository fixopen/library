<?php

class users
{

    private static $tableName = 'user';

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
        JSON::ToJson as privateToJson;
    }

    private $no = '';
    private $name = '';
    private $alias = '';
    private $photo = '';
    private $description = '';
    private $address = '';
    private $zipcode = '';
    private $title = ''; //duty
    private $telephone = '';
    private $ext = '';
    private $mobile = '';
    private $email = '';
    private $qq = '';
    private $sip = '';
    private $website = '';

    private $login = '';
    private $password = '';
    private $organizationId = 0;

    //积分
    //评分
    //评价s
    //搜索
    //计数器（下载、浏览、查看、评论、好友、信息、通知、公告、问题、答复、资源）

    public function ToJson()
    {
        $fields = array();
        foreach ($this as $key => $value) {
            if ($key == 'password') {
                continue;
            }
            $fields[] = self::JsonMark($key) . ': ' . self::JsonQuote($value);
        }
        return '{' . implode(', ', $fields) . '}';
    }

    public static function IsPrimaryKey($v)
    {
        //print 'user key is ' . $v . '<br />';
        $result = self::isPrimary($v);
        if ($result == FALSE) {
            $result = self::GetOne('login', (string)$v);
        }
        if ($result == FALSE) {
            $result = self::GetOne('no', (string)$v);
        }
        return $result;
    }

    public static function import($file)
    {
        //
    }

    public static function export($file)
    {
        //
    }

    public function loginProcess()
    {
        $hasSession = TRUE;
        $session = sessions::GetByUserId($this->getId());
        if (!$session) {
            $session = new sessions();
            $session->setUserId($this->getId());
            $hasSession = FALSE;
        }
        $sessionId = rand();
        while (sessions::IsPrimaryKey($sessionId)) {
            $sessionId = rand();
        }
        $session->setSessionId((string)$sessionId);
        $now = time();
        $session->setStartTime($now);
        $session->setLastOperationTime($now);
        if ($hasSession) {
            $session->Update();
        } else {
            $session->Insert();
        }
        return $sessionId;
    }

    public function logoutProcess($sessionId)
    {
        $session = sessions::GetByUserId($this->getId());
        if ($session) {
            $session = new sessions();
            $session->setSessionId('');
            $this->Update();
        }
    }

    private static $specSubresource = array('metaInfo' => 'metaInfoProc', 'sessions' => 'sessionsProc');

    public function metaInfoProc(array &$request)
    {
        switch ($request['method']) {
            case 'POST': // == insert metaInfo
                $count = count($request['paths']);
                if (($count == 0) && ($request['params']['filter'] == '')) {
                    //insert user metaInfo
                    $metaData = new metaDatas();
                    $metaData->setDataTypeId(dataTypes::GetIdByName(self::$tableName));
                    $metaData->setDataId($this->GetId());
                    $postData = json_decode($request['body']);
                    foreach ($postData as $key => $value) {
                        $metaData->setName($key);
                        $metaData->setValue($value);
                        $metaData->Insert();
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            case 'PATCH'://== append new metaInfo
                $count = count($request['paths']);
                if (($count == 0) && ($request['params']['filter'] == '')) {
                    //replace user metaInfo -- include password
                    $data = json_decode($request['body']);
                    $changePasswordUri = 'http://125.39.194.25/publish/ws-api/data-center/update-user.api';
                    //{"oldPassword":"原密码","newPassword":"原密码","username":修改密码用户名}
                    //send change password notification to transfer platform
                    $r = http_put_data($changePasswordUri, '{"oldPassword":"' . $this->getPassword() . '","newPassword":"' . $data->password . '","username":' . $s->GetId() . '}');
                    //$s->setPassword($data->password);
                    //$s->Update();
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            case 'PUT': //== remove old metaInfo and insert new metaInfo
                $count = count($request['paths']);
                if (($count == 0) && ($request['params']['filter'] == '')) {
                    //replace user metaInfo
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            case 'GET':
                $count = count($request['paths']);
                if (($count == 0) && ($request['params']['filter'] == '')) {
                    //get user metaInfo
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            case 'DELETE': // == delete user mateInfo
                $count = count($request['paths']);
                if (($count == 0) && ($request['params']['filter'] == '')) {
                    //delete user metaInfo
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            default:
                break;
        }
    }

    public function sessionsProc(array &$request)
    {
        //print 'process users sessions';
        switch ($request['method']) {
            case 'POST': // == login
                $count = count($request['paths']);
                if (($count == 0) && ($request['params']['filter'] == '')) {
                    $body = json_decode($request['body']);
                    if (isset($body->password)) {
                        //print 'has password send';
                        if ($body->password == $this->getPassword()) {
                            $sessionId = $this->loginProcess();
                            $request['response']['cookies']['sessionId'] = $sessionId;
                            $request['response']['cookies']['token'] = 'onlyForTest';
                            $request['response']['body'] = $this->toJson(); //'{"id": ' . $this->getId() . ', "sessionId": "' . $sessionId . '", "token": "onlyForTest"}';
                        } else {
                            $request['response']['code'] = 404; //invalidate username or password
                            $request['response']['body'] = '{"state": "invalid username or password, try again"}';
                        }
                    } else {
                        $request['response']['code'] = 400; //bad request
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            case 'PUT':
                $request['response']['code'] = 405; //Method Not Allowed
                //$result['code'] = 406; //not acceptable
                break;
            case 'GET':
                $request['response']['code'] = 404; //not login
                $count = count($request['paths']);
                if ($count == 1) {
                    //process the logout
                    $now = time();
                    $sessionId = array_shift($request['paths']);
                    $session = sessions::IsPrimaryKey($sessionId);
                    if (($now - $session->getLastOperationTime()) < 30 * 60) {
                        $session->setLastOperationTime($now);
                        $session->Update();
                        $request['response']['code'] = 200;
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                //$result['code'] = 406; //not acceptable
                break;
            case 'DELETE': // == logout
                $count = count($request['paths']);
                if ($count == 1) {
                    //process the logout
                    $sessionId = array_shift($request['paths']);
                    $this->logoutProcess($sessionId);
                } else {
                    $request['response']['code'] = 400; //bad request
                }
                break;
            default:
                break;
        }
    }

    public function getNo()
    {
        return $this->no;
    }

    public function setNo($no)
    {
        $this->no = $no;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getAlias()
    {
        return $this->alias;
    }

    public function setAlias($alias)
    {
        $this->alias = $alias;
    }

    public function getPhoto()
    {
        return $this->photo;
    }

    public function setPhoto($photo)
    {
        $this->photo = $photo;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getAddress()
    {
        return $this->address;
    }

    public function setAddress($address)
    {
        $this->address = $address;
    }

    public function getZipcode()
    {
        return $this->zipcode;
    }

    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getTelephone()
    {
        return $this->telephone;
    }

    public function setTelephone($telephone)
    {
        $this->telephone = $telephone;
    }

    public function getExt()
    {
        return $this->ext;
    }

    public function setExt($ext)
    {
        $this->ext = $ext;
    }

    public function getMobile()
    {
        return $this->mobile;
    }

    public function setMobile($mobile)
    {
        $this->mobile = $mobile;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getQq()
    {
        return $this->qq;
    }

    public function setQq($qq)
    {
        $this->qq = $qq;
    }

    public function getSip()
    {
        return $this->sip;
    }

    public function setSip($sip)
    {
        $this->sip = $sip;
    }

    public function getWebsite()
    {
        return $this->website;
    }

    public function setWebsite($website)
    {
        $this->website = $website;
    }

    public function getLogin()
    {
        return $this->login;
    }

    public function setLogin($login)
    {
        $this->login = $login;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getOrganizationId()
    {
        return $this->organizationId;
    }

    public function setOrganizationId($organizationId)
    {
        $this->organizationId = $organizationId;
    }

}

?>
