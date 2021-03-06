<?php

trait Facade
{

    private static function childProcess(array &$request, $subject)
    {
        $childObject = FALSE;
        $child = array_shift($request['paths']);
        $request['temp']['child'] = $child;
        $classChildrenProcess = self::GetClassChildrenProcess($child);
        if ($classChildrenProcess) {
            $request = call_user_func(__CLASS__ . '::' . $classChildrenProcess, $request);
            $childObject = TRUE;
        } else {
            if ($child == 'me') {
                $childObject = $subject;
            }
            if (!$childObject) {
                $childObject = self::IsPrimaryKey($child);
            }
        }
        return $childObject;
    }

    private static function childrenProcess(array &$request, $subject)
    {
        $child = array_shift($request['paths']);
//        print 'child is ' . $child;
        $childObject = self::IsPrimaryKey($child);
        if ($child == 'me') {
            $childObject = $subject;
        }
//        print_r($childObject);
        if ($childObject) {
            $grandson = array_shift($request['paths']);
            $childObject->ObjectChildrenProcess($grandson, $request);
//            print_r($request);
        } else {
//            print_r($child);
//            print 'error<br />';
            $classChildrenProcess = self::GetClassChildrenProcess($child);
//            print 'class method is ' . $classChildrenProcess . '<br />';
            if ($classChildrenProcess) {
                //print 'class method is ' . $classChildrenProcess . '<br />';
//                print '#################################<br />';
//                print_r($request);
//                print '#################################<br />';
                $request = call_user_func(__CLASS__ . '::' . $classChildrenProcess, $request);
                //print_r($request);
            } else {
                $request['response']['code'] = 404; //resource not found
            }
        }
    }

    private static function normalPush(array &$request)
    {
        $pathCount = count($request['paths']);
        switch ($pathCount) {
            case 0:
                switch ($request['method']) {
                    case 'POST':
                        self::NormalInsert($request);
                        break;
                    case 'PUT':
                        self::NormalUpdate($request);
                        break;
                    case 'PATCH':
                        self::NormalUpdate($request);
                        break;
                }
                break;
            case 1:
                $childObject = self::childProcess($request, NULL);
                if ($request['temp']['child'] == 'full') {
                    break;
                }
                if ($childObject) {
                    switch ($request['method']) {
                        case 'POST':
                            $request['response']['code'] = 400; //bad request, resource exist
                            $request['response']['body'] = '{"state": "resource has exist"}';
                            break;
                        case 'PUT':
                            self::SingleUpdate($request, $childObject);
                            break;
                        case 'PATCH':
                            self::SingleUpdate($request, $childObject);
                            break;
                    }
                } else {
                    switch ($request['method']) {
                        case 'POST':
//                            print '***************************<br />';
//                            print_r($request);
//                            print '***************************<br />';
                            self::SingleInsert($request, $request['temp']['child']);
//                            print '***************************<br />';
                            break;
                        case 'PUT':
                            $request['response']['code'] = 400; //bad request, resource exist
                            $request['response']['body'] = '{"state": "resource not exist"}';
                            break;
                        case 'PATCH':
                            $request['response']['code'] = 400; //bad request, resource exist
                            $request['response']['body'] = '{"state": "resource not exist"}';
                            break;
                    }
                }
                break;
            default:
                self::childrenProcess($request, NULL);
                break;
        }
    }

    private static function normalPull(array &$request)
    {
//        print '1';
        $pathCount = count($request['paths']);
        switch ($pathCount) {
            case 0:
//                print_r($request);
                self::NormalSelect($request);
                break;
            case 1:
                $childObject = self::childProcess($request, NULL);
//                print_r($childObject);
                if ($childObject) {
                    if ($childObject !== TRUE) {
                        $request['response']['body'] = $childObject->ToJson();
                    }
                } else {
                    $request['response']['code'] = 404; //resource not found
                }
                break;
            default:
                self::childrenProcess($request, NULL);
                break;
        }
    }

    private static function normalRemove(array &$request)
    {
        $pathCount = count($request['paths']);
        switch ($pathCount) {
            case 0:
                self::NormalDelete($request);
                break;
            case 1:
                $childObject = self::childProcess($request, NULL);
                if ($childObject) {
                    self::SingleDelete($request, $childObject);
                } else {
                    $request['response']['code'] = 404; //resource not found
                }
                break;
            default:
                self::childrenProcess($request, NULL);
                break;
        }
    }

    private static function binaryPush(array &$request)
    {
        $pathCount = count($request['paths']);
        switch ($pathCount) {
            case 1:
                $child = array_shift($request['paths']);
                $childObject = self::IsPrimaryKey($child);
                if ($childObject) {
                    $offset = -1;
                    $length = -1;
//                    $offset = $request['params']['offset'];
//                    $length = $request['headers']['Content-Length'];
                    if ($offset != -1 && $length != -1) {
                        $childObject->uploadSlice('', $request['body'], $offset, $length);
                    } else {
                        $childObject->upload('', $request['body']);
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "resource not found"}';
                }
                break;
            case 2: //for books/{id}/cover
                $child = array_shift($request['paths']);
                $childObject = self::IsPrimaryKey($child);
                if ($childObject) {
                    $grandson = array_shift($request['paths']);
                    if ($grandson == 'cover') {
                        $offset = -1;
                        $length = -1;
//                        $offset = $request['params']['offset'];
//                        $length = $request['headers']['Content-Length'];
                        if ($offset != -1 && $length != -1) {
                            $childObject->uploadSlice('cover', $request['body'], $offset, $length);
                        } else {
                            $childObject->upload('cover', $request['body']);
                        }
                    } else {
                        $request['response']['code'] = 400; //bad request
                        $request['response']['body'] = '{"state": "not recognize branch, must is [cover]"}';
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "resource not found"}';
                }
                break;
            default:
                $request['response']['code'] = 400; //bad request
                $request['response']['body'] = '{"state": "path segment too much"}';
                break;
        }
    }

    private static function binaryPull(array &$request)
    {
        $pathCount = count($request['paths']);
        switch ($pathCount) {
            case 1:
                $child = array_shift($request['paths']);
                $childObject = self::IsPrimaryKey($child);
                if ($childObject) {
                    $offset = -1;
                    $length = -1;
//                    $offset = $request['params']['offset'];
//                    $length = $request['headers']['Content-Length'];
//                    $range = $request['headers']['Range'];
//                    if ($range) {
//                        //bytes=startPos-stopPos, ...
//                        $areas = explode(',', $range);
//                        foreach ($areas as $area) {
//                            $pair = explode('-', $area);
//                            if (count($pair) == 2) {
//                                $startPos = intval($pair[0]);
//                                $stopPos = intval($pair[1]);
//                                $offset = $startPos;
//                                $length = $stopPos - $startPos + 1;
//                            }
//                        }
//
//                    }
                    if ($offset != -1 && $length != -1) {
                        $request['response']['body'] = $childObject->downloadSlice('', $offset, $length);
                    } else {
                        $request['response']['headers']['Content-Type'] = $childObject->getMimeType();
                        $c = $childObject->download('');
                        $request['response']['headers']['Content-Length'] = $c['length'];
                        $request['response']['body'] = $c['content'];
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "resource not found"}';
                }
                break;
            case 2: //for books/{id}/cover
                $child = array_shift($request['paths']);
                $childObject = self::IsPrimaryKey($child);
                if ($childObject) {
                    $grandson = array_shift($request['paths']);
                    if ($grandson == 'cover') {
                        $offset = -1;
                        $length = -1;
//                        $offset = $request['params']['offset'];
//                        $length = $request['headers']['Content-Length'];
//                        $range = $request['headers']['Range'];
//                        if ($range) {
//                            //bytes=startPos-stopPos, ...
//                            $areas = explode(',', $range);
//                            foreach ($areas as $area) {
//                                $pair = explode('-', $area);
//                                if (count($pair) == 2) {
//                                    $startPos = intval($pair[0]);
//                                    $stopPos = intval($pair[1]);
//                                    $offset = $startPos;
//                                    $length = $stopPos - $startPos + 1;
//                                }
//                            }
//
//                        }
                        if ($offset != -1 && $length != -1) {
                            $request['response']['body'] = $childObject->downloadSlice('cover', $offset, $length);
                        } else {
                            $request['response']['headers']['Content-Type'] = 'image/jpeg';
                            $c = $childObject->download('cover');
                            $request['response']['headers']['Content-Length'] = $c['length'];
                            $request['response']['body'] = $c['content'];
                        }
                    } else {
                        $request['response']['code'] = 400; //bad request
                        $request['response']['body'] = '{"state": "not recognize branch, must is [cover]"}';
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "resource not found"}';
                }
                break;
            default:
                $request['response']['code'] = 400; //bad request
                $request['response']['body'] = '{"state": "path segment too much"}';
                break;
        }
    }

    private static function binaryRemove(array &$request)
    {
        $pathCount = count($request['paths']);
        switch ($pathCount) {
            case 1:
                $child = array_shift($request['paths']);
                $childObject = self::IsPrimaryKey($child);
                if ($childObject) {
                    //delete the file
                    unlink($childObject->getContent(''));
                    //$request['response']['code'] = 405; //method not allow
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "resource not found"}';
                }
                break;
            case 2: //for books/{id}/cover
                $child = array_shift($request['paths']);
                $childObject = self::IsPrimaryKey($child);
                if ($childObject) {
                    $grandson = array_shift($request['paths']);
                    if ($grandson == 'cover') {
                        //delete the file
                        unlink($childObject->getContent('cover'));
                        //$request['response']['code'] = 405; //method not allow
                    } else {
                        $request['response']['code'] = 400; //bad request
                        $request['response']['body'] = '{"state": "not recognize branch, must is [cover]"}';
                    }
                } else {
                    $request['response']['code'] = 400; //bad request
                    $request['response']['body'] = '{"state": "resource not found"}';
                }
                break;
            default:
                $request['response']['code'] = 400; //bad request
                $request['response']['body'] = '{"state": "path segment too much"}';
                break;
        }
    }

    public static function Process(array &$request, $parent)
    {
        $subject = self::GetSubjectByQuery($request);
        //$subject = NULL;
        $attributeBag = [];
        if ($subject) {
            $regionExpression = self::CheckPermission($subject, $request['method'], self::$tableName, $attributeBag);
            if(get_class($subject) != 'devices'){
                if (!$regionExpression) {
                    $request['response']['code'] = 401; //Unauthorized
                    return;
                }
            }

            $request['temp']['regionExpression'] = $regionExpression;
        } else {
            //only for login
            $request['temp']['regionExpression'] = '1 = 1';
        }
//        print_r($request);
        $request['temp']['parent'] = $parent;

        switch ($request['method']) {
            case 'POST':
            case 'PUT':
            case 'PATCH':
                $requestContentType = $request['headers']['Content-Type'];
                if (strpos($requestContentType, 'application/json') === 0) {
                    //normal
                    self::normalPush($request);
                } else {
                    //binary uploader
                    self::binaryPush($request);
                }
                break;
            case 'GET':
                $acceptContentType = $request['headers']['Accept'];
                if (strpos($acceptContentType, 'application/json') === 0) {
//                    print 'normal pull';
//                    print_r($request);
                    self::normalPull($request);
                } else {
                    //binary downloader
                    self::binaryPull($request);
                }
                break;
            case 'DELETE':
                $acceptContentType = $request['headers']['Accept'];
                if (strpos($acceptContentType, 'application/json') === 0) {
                    //normal delete
                    self::normalRemove($request);
                } else {
                    //binary delete
                    self::binaryRemove($request);
                }
                break;
            default:
                $request['response']['code'] = 405; //method not allow
                $request['response']['body'] = '{"state": "method not allow"}';
                break;
        }
    }

}

/*
 *



        if (strpos($acceptContentType, 'application/json') == 0) {
            //normal
            //filter & orderBy & offset & count
            $pathCount = count($request['paths']);
            switch ($pathCount) {
                case 0: //no parts
                    switch ($request['method']) {
                        case 'POST':
                            self::NormalInsert($request);
                            break;
                        case 'PUT':
                            self::NormalUpdate($request);
                            break;
                        case 'PATCH':
                            self::NormalUpdate($request);
                            break;
                        case 'GET':
                            self::NormalSelect($request);
                            break;
                        case 'DELETE':
                            self::NormalDelete($request);
                            break;
                        default:
                            break;
                    }
                    break;
                case 1:
                    $child = array_shift($request['paths']);
                    $classChildrenProcess = self::GetClassChildrenProcess($child);
                    if ($classChildrenProcess) {
                        $request = call_user_func(__CLASS__ . '::' . $classChildrenProcess, $request);
                    } else {
                        $childObject = NULL;
                        if ($child == 'me') {
                            $childObject = $subject;
                        }
                        if (!$childObject) {
                            $childObject = self::IsPrimaryKey($child);
                        }
                        if ($childObject) {
                            switch ($request['method']) {
                                case 'POST':
                                    //print 'resource exist<br />';
                                    $request['response']['code'] = 400; //bad request, resource exist
                                    $request['response']['body'] = '{"state": "resource has exist"}';
                                    break;
                                case 'PUT':
                                    self::SingleUpdate($request, $childObject);
                                    break;
                                case 'PATCH':
                                    self::SingleUpdate($request, $childObject);
                                    break;
                                case 'GET':
                                    $request['response']['body'] = $childObject->ToJson();
                                    break;
                                case 'DELETE':
                                    self::SingleDelete($request, $childObject);
                                    break;
                            }
                        } else {
                            switch ($request['method']) {
                                case 'POST':
                                    self::SingleInsert($request, $child);
                                    break;
                                default:
                                    $request['response']['code'] = 404; //resource not found
                                    break;
                            }
                        }
                    }
                    break;
                default: //has parts
                    $child = array_shift($request['paths']);
                    //print 'child is ' . $child;
                    $childObject = self::IsPrimaryKey($child);
                    if ($child == 'me') {
                        $childObject = $subject;
                    }
                    //print_r($childObject);
                    if ($childObject) {
                        $grandson = array_shift($request['paths']);
                        $childObject->ObjectChildrenProcess($grandson, $request);
                        //print_r($request);
                    } else {
                        //print 'error';
                        $classChildrenProcess = self::GetClassChildrenProcess($child);
                        if ($classChildrenProcess) {
                            $request = call_user_func(__CLASS__ . '::' . $classChildrenProcess, $request);
                        } else {
                            $request['response']['code'] = 404; //resource not found
                        }
                    }
                    break;
            }
        } else {
            //binary
            //offset & count
            $pathCount = count($request['paths']);
            switch ($pathCount) {
                case 1:
                    $child = array_shift($request['paths']);
                    $childObject = self::IsPrimaryKey($child);
                    if ($childObject) {
                        $offset = $request['params']['offset'];
                        $length = $request['params']['count'];
                        switch ($request['method']) {
                            case 'POST':
                                if ($offset != -1 && $length != -1) {
                                    $childObject->uploadSlice($request['body'], $offset, $length);
                                } else {
                                    $childObject->upload($request['body']);
                                }
                                break;
                            case 'PUT':
                                if ($offset != -1 && $length != -1) {
                                    $childObject->uploadSlice($request['body'], $offset, $length);
                                } else {
                                    $childObject->upload($request['body']);
                                }
                                break;
                            case 'PATCH':
                                if ($offset != -1 && $length != -1) {
                                    $childObject->uploadSlice($request['body'], $offset, $length);
                                } else {
                                    $childObject->upload($request['body']);
                                }
                                break;
                            case 'GET':
                                $range = $request['headers']['Range'];
                                if ($range) {
                                    //bytes=startPos-stopPos, ...
                                    $areas = explode(',', $range);
                                    foreach ($areas as $area) {
                                        $pair = explode('-', $area);
                                        if (count($pair) == 2) {
                                            $startPos = intval($pair[0]);
                                            $stopPos = intval($pair[1]);
                                            $offset = $startPos;
                                            $length = $stopPos - $startPos + 1;
                                        }
                                    }

                                }
                                if ($offset != -1 && $length != -1) {
                                    $request['response']['body'] = $childObject->downloadSlice($offset, $length);
                                } else {
                                    $request['response']['body'] = $childObject->download();
                                }
                                break;
                            case 'DELETE':
                                $request['response']['code'] = 405; //method not allow
                                break;
                            default:
                                $request['response']['code'] = 405; //method not allow
                                break;
                        }
                    } else {
                        $request['response']['code'] = 400; //bad request
                    }
                    break;
                default:
                    $request['response']['code'] = 400; //bad request
                    break;
            }
        }
*/
?>
