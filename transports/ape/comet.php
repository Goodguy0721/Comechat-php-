<?php

/*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/

class Comet {

	private static $APEserver = '';
	private static $APEPassword = '';

    function __construct() {
		global $ape_server_full;
		global $ape_password;

		self::$APEserver = $ape_server_full;
		self::$APEPassword = $ape_password;

    }

    function publish($args) {
		if (!$args['channel']) {
            echo('Missing Channel');
            return false;
        }

        $channel = $args['channel'];

		$args['message']['message'] = str_replace("'",'%27',str_replace('"','%22',$args['message']['message']));

		$cmd = array
		(
				 array
				 (
					'cmd' => 'inlinepush',
					'params' =>
						array
						(
							  'password'  => self::$APEPassword,
							  'raw'       => 'postmsg',
							  'channel'   => $channel,
							  'data'      =>
									array
									(
										'message' => $args['message']
									)
						)
				)
		);

		$data = file_get_contents_curl(self::$APEserver.rawurlencode(json_encode($cmd)));

	}

}

function file_get_contents_curl($url) {
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser.
		curl_setopt($ch, CURLOPT_URL, $url);

		$data = curl_exec($ch);
		curl_close($ch);

		return $data;
	}

?>