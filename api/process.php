<?php

function __autoload($class_name)
{
    //require_once $class_name . '.php';
    include_once $class_name . '.php';
}

function error_function($error_level, $error_message, $error_file, $error_line, $error_context)
{
    /*
       ֵ1  E_ERROR
      2	E_WARNING
      4 E_PARSE
      8	E_NOTICE
      16 E_CORE_ERROR
      32 E_CORE_WARNING
      64 E_COMPILE_ERROR
      128 E_COMPILE_WARNING
      256	E_USER_ERROR
      512	E_USER_WARNING
      1024	E_USER_NOTICE
      2048  E_STRICT
      4096	E_RECOVERABLE_ERROR
      8191	E_ALL
     */

    /*
      debug_backtrace -- Generates a backtrace
      error_log -- Send an error message somewhere
      bool error_log(string message [, int message_type [, string destination [, string extra_headers]]]);
      error_reporting -- Sets which PHP errors are reported
      error_reporting();
      restore_error_handler -- Restores the previous error handler function
      restore_exception_handler --  Restores the previously defined exception handler function
      set_error_handler --  Sets a user-defined error handler function
      set_exception_handler --  Sets a user-defined exception handler function
      trigger_error -- Generates a user-level error/warning/notice message
      trigger_error(string "the age is logger!", E_USER_WARNING);
      user_error -- Alias of trigger_error() trigger_error()

      try {
      throw $e;
      } catch (Exception $e) {
      process($e);
      } finally {
      finallyProcess();
      }
      //_CRT_SECURE_NO_WARNINGS
      function my_iconv($from, $to, $string, $line) {
      @trigger_error('hi', E_USER_NOTICE);
      $result = @iconv($from, $to, $string);
      $error = error_get_last();
      if ($error['message'] != 'hi') {
      $result = $string;
      }
      return $result;
      }

      ob_start(function($buffer) {
      if ($error = error_get_last()) {
      return var_export($error, true);
      }

      return $buffer;
      });

      // Fatal error: Call to undefined function undefined_function()
      undefined_function();

      register_shutdown_function(function() {
      if ($error = error_get_last()) {
      var_dump($error);
      }
      });

      // Fatal error: Call to undefined function undefined_function()
      undefined_function();
     */
}

function writeResponse($response)
{
    http_response_code($response['code']);
    foreach ($response['headers'] as $name => $value) {
        header($name . ': ' . $value);
    }
    if (array_key_exists('Content-Type', $response['headers']) == FALSE) {
        header('Content-Type: application/json; charset=UTF-8');
        header('Content-Length: ' . strlen($response['body']));
    }
    if (array_key_exists('sessionId', $response['cookies'])) {
//        print_r( $response['cookies']);
        //session_start();
        //session_id($sessionId);
        session_id($response['cookies']['sessionId']);
        //print 'send cookie to client';
        //Set-Cookie：name=value; path=/api//; domain=.ibm.com; expires=Wednesday, 19-OCT-05 23:12:40 GMT; [secure]
        //header('Set-Cookie: sessionId=' . $response['cookies']['sessionId'] . '; path=/api');
        //$setCookiesHeaderValue = 'sessionId=' . $response['cookies']['sessionId'];
        $r = setcookie('sessionId', $response['cookies']['sessionId'], 0, '/');
        if ($r == FALSE) {
            print 'sessionId cookie set fail.<br />';
        }
        //$setCookiesHeaderValue .= ', token=' . $response['cookies']['token'];
        $r = setcookie('token', $response['cookies']['token'], 0, '/');
        if ($r == FALSE) {
            print 'token cookie set fail.<br />';
        }
        //header('Set-Cookie: ' . $setCookiesHeaderValue);
        //header('Set-Cookie: token=' . $response['cookies']['token'] . '; path=/api');
        //print 'sessionId' . $response['cookies']['sessionId'];
        //print 'token' . $response['cookies']['token'];
    }

    //body: {"state": code, "type": "user|contact|group|message|log|markup|device|...", data: {json-object}|[json-array]}
    print $response['body'];
//    print_r($response);
}

function testBed()
{
    //$m = new Model('nullTable', array('name', 'description'));
    //$m->iteratorThis();
    //var_dump($m);

    //$t = json_decode('{"name": "zhangsan", "sex": {"id": 4}}');
    //var_dump((array)$t);

    //class X {
    //    public $name = 'name';
    //    public $value = 'value';
    //    public $next = NULL;
    //}

    //$x = new X();
    //var_dump((array)$x);
    //$j = json_encode($x);
    //var_dump($j);

    //print 'hello, world<br />';

    //include_once 'users.php';
    //users::Prepare();
    //$u = new users();
    //print $u->ToJson() . '<br />';
}

//date_default_timezone_set('UTC');
date_default_timezone_set("Asia/Shanghai");
//@@ini_set('session.save_path', '/var/tmp');
//@@$sessionpath = session_save_path();
//@@print $sessionpath . '<br />';
//@@session_start();

//set_error_handler("error_function", E_WARNING);

//usage: /api/contacts?filter=<condition>&orderBy=<orderInfo>&offset=<n>&count=<n>
//《condition》：{"fieldName": value, ...}
//《orderInfo》：{"fieldName": asc|desc, ...}
//《n》：number
$request = QueryParser::ParseQuery();
testBed();
//print_r($request);
$tableName = array_shift($request['paths']);
//print $tableName . '<br />';
$tableName::Process($request, NULL);
writeResponse($request['response']);
?>

