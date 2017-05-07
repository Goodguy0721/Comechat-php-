<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ADVANCED */
$cms = "pgdatingpro";
define('SET_SESSION_NAME','');
define('SWITCH_ENABLED','1');
define('INCLUDE_JQUERY','1');
define('FORCE_MAGIC_QUOTES','0');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* DATABASE */

if(!file_exists(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'config.php')){
	echo "Please check if CometChat is installed in the correct directory.<br /> The 'cometchat' folder should be placed at <PGDATINGPRO_HOME_DIRECTORY>/cometchat";
	exit;
}
include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'config.php');
$ci_applicationfolder = dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'application';
if(!defined('BASEPATH')){
	define('BASEPATH','/');
}
// DO NOT EDIT DATABASE VALUES BELOW
// DO NOT EDIT DATABASE VALUES BELOW
// DO NOT EDIT DATABASE VALUES BELOW


define('DB_SERVER',					DB_HOSTNAME						 		);
define('DB_PORT',					''										);
define('DB_NAME',					DB_DATABASE								);

$table_prefix = DB_PREFIX;                                 // Table prefix(if any)
$db_usertable = 'users';                            // Users or members information table name
$db_usertable_userid = 'id';                        // UserID field in the users or members table
$db_usertable_name = 'nickname';                    // Name containing field in the users or members table
$db_avatartable = ' ';
$db_avatarfield = "concat(id,'^',coalesce(user_logo,'')) ";
$db_linkfield = ' '.$table_prefix.$db_usertable.'.'.$db_usertable_userid.' ';

/*COMETCHAT'S INTEGRATION CLASS USED FOR SITE AUTHENTICATION */

class Integration{

    function __construct(){
        if(!defined('TABLE_PREFIX')){
            $this->defineFromGlobal('table_prefix');
            $this->defineFromGlobal('db_usertable');
            $this->defineFromGlobal('db_usertable_userid');
            $this->defineFromGlobal('db_usertable_name');
            $this->defineFromGlobal('db_avatartable');
            $this->defineFromGlobal('db_avatarfield');
            $this->defineFromGlobal('db_linkfield');
        }
    }

    function defineFromGlobal($key){
        if(isset($GLOBALS[$key])){
            define(strtoupper($key), $GLOBALS[$key]);
            unset($GLOBALS[$key]);
        }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* FUNCTIONS */
	function getUserID() {
		global $ci_applicationfolder;
		$userid = 0;
		if (!empty($_SESSION['basedata']) && $_SESSION['basedata'] != 'null') {
			$_REQUEST['basedata'] = $_SESSION['basedata'];
		}

		if (!empty($_REQUEST['basedata'])) {
			if (function_exists('mcrypt_encrypt') && defined('ENCRYPT_USERID') && ENCRYPT_USERID == '1') {
				$key = "";
				if( defined('KEY_A') && defined('KEY_B') && defined('KEY_C') ){
					$key = KEY_A.KEY_B.KEY_C;
				}
				$uid = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode(rawurldecode($_REQUEST['basedata'])), MCRYPT_MODE_CBC, md5(md5($key))), "\0");
				if (intval($uid) > 0) {
					$userid = $uid;
				}
			} else {
				$userid = $_REQUEST['basedata'];
			}
		}

		include_once($ci_applicationfolder.DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'config.php');
		if(!empty($_COOKIE[$config['sess_cookie_name']]) && (empty($userid) || $userid == "null")) {
			$sessiondata = unserialize($this->decode($_COOKIE[$config['sess_cookie_name']],$config['encryption_key']));
			$sql = ("select user_data from ".$config['sess_table_name']." where session_id = '".mysqli_real_escape_string($GLOBALS['dbh'],$sessiondata['session_id'])."'");
			$res = mysqli_query($GLOBALS['dbh'],$sql);
			if($result = mysqli_fetch_assoc($res)){
				$userdata = unserialize($result['user_data']);
				$userid = $userdata['user_id'];
			}
		}

		$userid = intval($userid);
        
        if (!empty($userid)) {
			$sql = ("insert into cometchat_status (userid,status,isdevice) values ('".mysqli_real_escape_string($GLOBALS['dbh'],$userid)."','online','0') on duplicate key update status='online', isdevice = '0'");
                mysqli_query($GLOBALS['dbh'], $sql);
		}
        
        return $userid;
	}

	function chatLogin($userName,$userPass) {
		$userid = 0;
        if (filter_var($userName, FILTER_VALIDATE_EMAIL)) {
			$sql = ("SELECT * FROM ".TABLE_PREFIX.DB_USERTABLE." WHERE email ='".mysqli_real_escape_string($GLOBALS['dbh'],$userName)."'");
		} else {
			$sql = ("SELECT * FROM ".TABLE_PREFIX.DB_USERTABLE." WHERE login ='".mysqli_real_escape_string($GLOBALS['dbh'],$userName)."'");
		}
		$result = mysqli_query($GLOBALS['dbh'],$sql);
		$row = mysqli_fetch_assoc($result);

		if($row['password'] == md5($userPass)) {
			$userid = $row['id'];
		}
		if(!empty($userName) && !empty($_REQUEST['social_details'])) {
			$social_details = json_decode($_REQUEST['social_details']);
			$userid = socialLogin($social_details);
		}
		if(!empty($_REQUEST['guest_login']) && $userPass == "CC^CONTROL_GUEST" && $guestsMode == 1){
			$userid = getGuestID($userName);
		}
		if(!empty($userid) && isset($_REQUEST['callbackfn']) && $_REQUEST['callbackfn'] == 'mobileapp'){
			$sql = ("insert into cometchat_status (userid,status,isdevice) values ('".mysqli_real_escape_string($GLOBALS['dbh'],$userid)."','online','1') on duplicate key update status='online', isdevice = '1'");
                mysqli_query($GLOBALS['dbh'], $sql);
		}
		if($userid && function_exists('mcrypt_encrypt') && defined('ENCRYPT_USERID') && ENCRYPT_USERID == '1'){
			$key = "";
				if( defined('KEY_A') && defined('KEY_B') && defined('KEY_C') ){
					$key = KEY_A.KEY_B.KEY_C;
				}
			$userid = rawurlencode(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $userid, MCRYPT_MODE_CBC, md5(md5($key)))));
		}

		return $userid;
	}

	function getFriendsList($userid,$time) {
		global $hideOffline;
		$offlinecondition = '';
		$sql = ("select DISTINCT ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." userid, ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_NAME." username,  ".DB_LINKFIELD." link, ".TABLE_PREFIX.DB_USERTABLE.".id_country, ".TABLE_PREFIX.DB_USERTABLE.".id_region, ".TABLE_PREFIX.DB_USERTABLE.".id_city, ".TABLE_PREFIX.DB_USERTABLE.".living_with, ".DB_AVATARFIELD." avatar, cometchat_status.lastactivity lastactivity, cometchat_status.lastseen lastseen, cometchat_status.lastseensetting lastseensetting, cometchat_status.status, cometchat_status.message, cometchat_status.isdevice from ".TABLE_PREFIX.DB_USERTABLE." left join cometchat_status on  ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." = cometchat_status.userid ".DB_AVATARTABLE." where ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." <> '".mysqli_real_escape_string($GLOBALS['dbh'],$userid)."' AND  ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." IN (select id_user from ".TABLE_PREFIX."hotlist WHERE id_user in (select id_user from ".TABLE_PREFIX."hotlist where id_friend = ".mysqli_real_escape_string($GLOBALS['dbh'],$userid).") and id_user in (select id_friend from ".TABLE_PREFIX."hotlist where id_user =".mysqli_real_escape_string($GLOBALS['dbh'],$userid).")) order by username asc");

		if ((defined('MEMCACHE') && MEMCACHE <> 0) || DISPLAY_ALL_USERS == 1) {
			if ($hideOffline) {
				$offlinecondition = "where ((cometchat_status.lastactivity > (".mysqli_real_escape_string($GLOBALS['dbh'],$time)."-".((ONLINE_TIMEOUT)*2).")) OR cometchat_status.isdevice = 1) and (cometchat_status.status IS NULL OR cometchat_status.status <> 'invisible' OR cometchat_status.status <> 'offline')";
			}
			$sql = ("select ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." userid, ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_NAME." username, ".DB_LINKFIELD." link, ".TABLE_PREFIX.DB_USERTABLE.".id_country, ".TABLE_PREFIX.DB_USERTABLE.".id_region, ".TABLE_PREFIX.DB_USERTABLE.".id_city, ".TABLE_PREFIX.DB_USERTABLE.".living_with, ".DB_AVATARFIELD." avatar, cometchat_status.lastactivity lastactivity, cometchat_status.lastseen lastseen, cometchat_status.lastseensetting lastseensetting, cometchat_status.status, cometchat_status.message, cometchat_status.isdevice from   ".TABLE_PREFIX.DB_USERTABLE."   left join cometchat_status on ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." = cometchat_status.userid ".DB_AVATARTABLE."   ".$offlinecondition." order by username asc");
		}

		return $sql;
	}

	function getFriendsIds($userid) {
		$sql = ("select id_user friendid from ".TABLE_PREFIX."hotlist WHERE id_user in (select id_user from ".TABLE_PREFIX."hotlist where id_friend = ".mysqli_real_escape_string($GLOBALS['dbh'],$userid).") and id_user in (select id_friend from ".TABLE_PREFIX."hotlist where id_user =".mysqli_real_escape_string($GLOBALS['dbh'],$userid).")");

		return $sql;
	}

	function getUserDetails($userid) {
        $sql = ("select ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." userid, ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_NAME." username, ".DB_LINKFIELD." link, ".TABLE_PREFIX.DB_USERTABLE.".id_country, ".TABLE_PREFIX.DB_USERTABLE.".id_region, ".TABLE_PREFIX.DB_USERTABLE.".id_city, ".TABLE_PREFIX.DB_USERTABLE.".living_with, ".DB_AVATARFIELD." avatar, cometchat_status.lastactivity lastactivity, cometchat_status.lastseen lastseen, cometchat_status.lastseensetting lastseensetting, cometchat_status.status, cometchat_status.message, cometchat_status.isdevice from ".TABLE_PREFIX.DB_USERTABLE." left join cometchat_status on ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." = cometchat_status.userid ".DB_AVATARTABLE." where ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." = '".mysqli_real_escape_string($GLOBALS['dbh'],$userid)."'");
		
        return $sql;
	}

	function getActivechatboxdetails($userids) {
		$sql = ("select DISTINCT ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." userid, ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_NAME." username, ".DB_LINKFIELD." link, ".DB_AVATARFIELD." avatar, cometchat_status.lastactivity lastactivity, cometchat_status.lastseen lastseen, cometchat_status.lastseensetting lastseensetting, cometchat_status.status, cometchat_status.message, cometchat_status.isdevice from ".TABLE_PREFIX.DB_USERTABLE." left join cometchat_status on ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." = cometchat_status.userid ".DB_AVATARTABLE." where ".TABLE_PREFIX.DB_USERTABLE.".".DB_USERTABLE_USERID." IN (".$userids.")");

		return $sql;
	}

	function getUserStatus($userid) {
		 $sql = ("select cometchat_status.message, cometchat_status.status from cometchat_status where userid = '".mysqli_real_escape_string($GLOBALS['dbh'],$userid)."'");
		 return $sql;
	}

	function fetchLink($link) {
	    return FRONTEND_URL.'users/view/'.$link.'/wall';
	}

	function getAvatar($image) {
		$explodeddata = explode('^',$image);
		if (!empty($explodeddata[1])&&file_exists(FRONTEND_PATH.'user-logo/0/0/0/'.$explodeddata[0].'/middle-'.$explodeddata[1])) {
				return FRONTEND_URL.'user-logo/0/0/0/'.$explodeddata[0].'/middle-'.$explodeddata[1];
		}
		return FRONTEND_URL.'default/middle-default-user-logo.png';
	}

	function getTimeStamp() {
		return time();
	}

	function processTime($time) {
		return $time;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/* HOOKS */

	function hooks_message($userid,$to,$unsanitizedmessage,$dir) {

	}

	function hooks_forcefriends() {

	}

	function hooks_updateLastActivity($userid) {

	}

	function hooks_statusupdate($userid,$statusmessage) {

	}

	function hooks_activityupdate($userid,$status) {

	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* CodeIgniter Functions */
	function decode($string, $key = '')
	{
		/* The part for key based encryption */
		$key = md5($key);
		if (preg_match('/[^a-zA-Z0-9\/\+=]/', $string))
		{
			return FALSE;
		}
		$dec = base64_decode($string);
		if (function_exists('mcrypt_encrypt'))
		{
			if (($dec = $this->mcrypt_decode($dec, $key)) === FALSE)
			{
				return FALSE;
			}
		}
		return $this->_xor_decode($dec, $key);
	}

	function mcrypt_decode($data, $key)
	{
		$data = $this->_remove_cipher_noise($data, $key);
		$init_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
		if ($init_size > strlen($data))
		{
			return FALSE;
		}
		$init_vect = substr($data, 0, $init_size);
		$data = substr($data, $init_size);
		return rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $data, MCRYPT_MODE_ECB, $init_vect), "\0");
	}

	function _xor_decode($string, $key)
	{
		$string = $this->_xor_merge($string, $key);
		$dec = '';
		for ($i = 0; $i < strlen($string); $i++)
		{
			$dec .= (substr($string, $i++, 1) ^ substr($string, $i, 1));
		}
		return $dec;
	}

	function _remove_cipher_noise($data, $key)
	{
		$keyhash = sha1($key);
		$keylen = strlen($keyhash);
		$str = '';
		for ($i = 0, $j = 0, $len = strlen($data); $i < $len; ++$i, ++$j)
		{
			if ($j >= $keylen)
			{
				$j = 0;
			}
			$temp = ord($data[$i]) - ord($keyhash[$j]);
			if ($temp < 0)
			{
				$temp = $temp + 256;
			}
			$str .= chr($temp);
		}
		return $str;
	}

	function _xor_merge($string, $key)
	{
		$hash = sha1($key);
		$str = '';
		for ($i = 0; $i < strlen($string); $i++)
		{
			$str .= substr($string, $i, 1) ^ substr($hash, ($i % strlen($hash)), 1);
		}
		return $str;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* LICENSE */

include_once(dirname(__FILE__).'/license.php');
$x="\x62a\x73\x656\x34\x5fd\x65c\157\144\x65";
eval($x('JHI9ZXhwbG9kZSgnLScsJGxpY2Vuc2VrZXkpOyRwXz0wO2lmKCFlbXB0eSgkclsyXSkpJHBfPWludHZhbChwcmVnX3JlcGxhY2UoIi9bXjAtOV0vIiwnJywkclsyXSkpOw'));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
