<?php

trait Session
{

    private static $specSubresource = array('sessions' => 'sessionsProc');

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

}

?>
