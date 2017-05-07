<?php

/*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/

class Comet {

	protected static $api_version = "1.0.0";
	protected static $api_key = '';
	protected static $secret_key = '';

    function __construct() {
		global $beaconpush_apikey;
		global $beaconpush_secretkey;

		self::$api_key = $beaconpush_apikey;
		self::$secret_key = $beaconpush_secretkey;
    }

    function publish($args) {
		if (!$args['channel']) {
            echo('Missing Channel');
            return false;
        }

        $channel = $args['channel'];

		$args['message']['message'] = str_replace("'",'%27',str_replace('"','%22',$args['message']['message']));

		Comet::_request('POST', 'channels', $channel, array('message'=>$args['message']));

	}

	function _request($method, $command, $arg=NULL, array $data=array(), $curl_timeout=30) {

        $request_url = 'http://api.beaconpush.com/'.self::$api_version.'/'.self::$api_key;
        $request_url = $request_url.'/'.strtolower($command).($arg ? '/'.$arg : '');

        $headers = array(
            'X-Beacon-Secret-Key: '. Comet::$secret_key,
        );

        $ch = curl_init($request_url);

        $opts = array(
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CONNECTTIMEOUT => ($curl_timeout/2 < 3 ? 3 : floor($curl_timeout/2)),
            CURLOPT_TIMEOUT => $curl_timeout,
        );

        curl_setopt_array($ch, $opts);

        if($method == 'POST')
        {
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        elseif($method == 'GET')
            curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
        elseif($method == 'DELETE')
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        else
            throw new Exception('Illegal method defined. Allowed methods are POST, GET and DELETE.');


        if(($response = curl_exec($ch)) === FALSE)
            throw new Exception('cURL failed: '.curl_error($ch));

        curl_close($ch);
    }

}

?>