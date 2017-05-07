<?php

/*
 * Copyright (c) 2007-2013 Migratory Data Systems (http://migratorydata.com)
 * ALL RIGHTS RESERVED. Use is subject to license terms.
 */

class MigratoryDataException extends Exception
{
	const E_INVALID_SUBJECT = 1;

	const E_TRANSPORT_INIT_FAILED = 2;
	
	const E_CONNECTION_FAILED = 3;
	
	const E_PUBLISHER_TYPE_MISMATCH  = 4;
	 
    const E_MSG_NULL = 5;
    
   	const E_MSG_INVALID = 6;
  
  	const E_MSG_HAS_SUBJECT_WITH_BAD_DESTINATION = 7;
	
  	const E_MSG_FIELD_INVALID = 8;
	
	const E_ALL_AGENTS_CONNECTION_FAILED = 9; 

	const E_INVALID_URL_LIST = 10;
	
	const E_INVALID_URL = 11;

	const E_INVALID_PROTOCOL = 12;
	
	const E_MESSAGE_SIZE_LIMIT_REACHED = 13;
    
	protected $cause = "";

	protected $code = -1;
	
	protected $detail = "";
		
	public function getCause()
	{
		return $this->cause;
	}
		
	public function getDetail()
	{
		return $this->detail;
	}
	
	public function __construct($cause, $code)
	{
		$this->cause = $cause;
		$this->code = $code;
		$this->detail = $this->getErrorInfo($code);
	}

	private function getErrorInfo($errorCode)
	{
		$ret = "";
		
		switch ($errorCode)
		{
			case self::E_INVALID_SUBJECT:
				$ret = "Invalid subject syntax";
				break;
			case self::E_TRANSPORT_INIT_FAILED:
				$ret = "Transport initialization failed";
				break;
			case self::E_CONNECTION_FAILED:
				$ret = "Connection failure";
				break;
			case self::E_PUBLISHER_TYPE_MISMATCH:
				$ret = "Unexpected publisher type";
				break;
			case self::E_MSG_NULL:
			    $ret = "Null message";
			    break;
			case self::E_MSG_INVALID:
			    $ret = "Invalid message";
			    break;
			case self::E_MSG_HAS_SUBJECT_WITH_BAD_DESTINATION:
			    $ret = "The subject of the message does not start with the specified publisher type";
			    break;
			case self::E_MSG_FIELD_INVALID:
			    $ret = "Invalid field";
			    break;
			case self::E_ALL_AGENTS_CONNECTION_FAILED:
			    $ret = "All connections failed";
			    break;
			case self::E_INVALID_URL_LIST:
			    $ret = "The URL list of the agents is empty";
			    break;
			case self::E_INVALID_URL:
				$ret = "Invalid URL";
				break;
			case self::E_INVALID_PROTOCOL:
				$ret = "Invalid protocol";
				break;
			case self::E_MESSAGE_SIZE_LIMIT_REACHED:
				$ret = "Message was rejected, size limit reached";
				break;
			default:
				$ret = "Unknown";
				break;
		}

		return $ret;
	}
}
