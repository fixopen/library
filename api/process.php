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
        //session_start();
        //session_id($sessionId);
        session_id($response['cookies']['sessionId']);
        //print 'send cookie to client';
        $setCookiesHeaderValue = 'sessionId=' . $response['cookies']['sessionId'];
        $r = setcookie('sessionId', $response['cookies']['sessionId']);
        if ($r == FALSE) {
            print 'sessionId cookie set fail.<br />';
        }
        $setCookiesHeaderValue .= ', token=' . $response['cookies']['token'];
        $r = setcookie('token', $response['cookies']['token']);
        if ($r == FALSE) {
            print 'token cookie set fail.<br />';
        }
        header('Set-Cookie: ' . $setCookiesHeaderValue);
        //print 'sessionId' . $response['cookies']['sessionId'];
        //print 'token' . $response['cookies']['token'];
    }

    //body: {"state": code, "type": "user|contact|group|message|log|markup|device|...", data: {json-object}|[json-array]}
    print $response['body'];
}

function testBed()
{
    //$m = new Model('nullTable', array('name', 'description'));
    //$m->iteratorThis();
    //var_dump($m);
    //print 'hello, world<br />';
}

date_default_timezone_set('UTC');
date_default_timezone_set("Asia/Chongqing");
session_start();

set_error_handler("error_function", E_WARNING);

//usage: /api/contacts?filter=<condition>&orderBy=<orderInfo>&offset=<n>&count=<n>
//《condition》：{"fieldName": value, ...}
//《orderInfo》：{"fieldName": asc|desc, ...}
//《n》：number
$request = QueryParser::ParseQuery();
testBed();
$tableName = array_shift($request['paths']);
$tableName::Process($request, NULL);
writeResponse($request['response']);
?>

