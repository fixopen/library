<?php

trait Facade
{

    public static function Process(array &$request, $parent)
    {
        $subject = self::GetSubjectByQuery($request);
        $attributeBag = '';

        if ($subject) {
            $regionExpression = self::CheckPermission($subject, $request['method'], dataTypes::GetIdByName(self::$tableName), $attributeBag);
            if (!$regionExpression) {
                $request['response']['code'] = 401; //Unauthorized
                return;
            }
            $request['temp']['regionExpression'] = $regionExpression;
        } else {
            //only for login
            $request['temp']['regionExpression'] = '1 = 1';
        }

        $request['temp']['parent'] = $parent;

        $requestContentType = $request['headers']['Content-Type'];
        if (strpos($requestContentType, 'application/json') == 0) {
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
                        call_user_func(__CLASS__ . '::' . $classChildrenProcess, $request);
                    } else {
                        $childObject = NULL;
                        if ($child == 'me') {
                            $childObject = $subject;
                        }
                        if ($childObject) {
                            $childObject = self::IsPrimaryKey($child);
                        }
                        if ($childObject) {
                            switch ($request['method']) {
                                case 'POST':
                                    $request['response']['code'] = 400; //bad request, resource exist
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
                    if ($childObject) { //id
                        //print 'users sessions';
                        $grandson = array_shift($request['paths']);
                        $childObject->ObjectChildrenProcess($grandson, $request);
                    } else {
                        //print 'error';
                        $classChildrenProcess = self::GetClassChildrenProcess($child);
                        if ($classChildrenProcess) {
                            call_user_func(__CLASS__ . '::' . $classChildrenProcess, $request);
                            //self::ClassChildrenProcess($child, $request);
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
    }

}

?>
