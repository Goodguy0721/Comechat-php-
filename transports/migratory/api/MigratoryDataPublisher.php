<?php

/*
 * Copyright (c) 2007-2013 Migratory Data Systems (http://migratorydata.com)
 * ALL RIGHTS RESERVED. Use is subject to license terms.
 */

require_once 'MigratoryDataMessage.php';
require_once 'MigratoryDataException.php';
require_once 'MigratoryDataResponse.php';

class MigratoryDataPublisher
{
	private $publisherType = null;
	
	private $clusterNames = array();
	private $agentTransports = array();
	private $agentURLs = null;
	private $exceptions = array();
	
	public function __construct($agentURLs, $publisherType)
	{
		$this->publisherType = $publisherType;
		
		$this->agentURLs = $agentURLs;
        if (!is_array($this->agentURLs) || count($this->agentURLs) == 0) 
        {
            throw new MigratoryDataException("", MigratoryDataException::E_INVALID_URL_LIST);
        }
        
		foreach ($this->agentURLs as $url) {
			try {
				$this->agentTransports[] = new MigratoryDataTransport($url, $publisherType);
			} catch (MigratoryDataException $e) {
				$this->exceptions[$url] = $e;
			}
		}	
        if (count($this->exceptions) == count($this->agentURLs)) {
            throw new MigratoryDataException("", MigratoryDataException::E_ALL_AGENTS_CONNECTION_FAILED);
        }
		
		foreach ($this->agentTransports as $transport) {
			$clusters = $transport->getClusterNames();
			foreach ($clusters as $cluster) {
				$this->clusterNames[$cluster] = $cluster;
			}
		}
	}
	
	public function publish($message, $cluster = null)
	{
		$responseByCluster = array();
	    $responses = array();

		if ($cluster == null) {
            foreach ($this->agentTransports as $agent) {
                $response = $agent->publish($message);
                $responses[] = $response;
            }
            foreach ($this->clusterNames as $cluster) {
                $response = MigratoryDataResponse::NOT_CONNECTED;

                foreach ($responses as $r) {
                    if (!array_key_exists($cluster, $r)) {
                        continue;
                    }
                    $value = $r[$cluster];
                    if ($value == MigratoryDataResponse::OK) {
                        $response = MigratoryDataResponse::OK;
                        break;
	                } else if ($value == MigratoryDataResponse::TIMEOUT) {
    	                $response = MigratoryDataResponse::TIMEOUT;
                    } else if ($value == MigratoryDataResponse::NOT_SUBSCRIBED) {
                        $response = MigratoryDataResponse::NOT_SUBSCRIBED;
                    }
                }
                $responseByCluster[$cluster] = $response;
            }
        } else {
            foreach ($this->agentTransports as $agent) {
                if (in_array($cluster, $agent->getClusterNames())) {
                    $response = $agent->publish($message, $cluster);
                    $responses[] = $response;
                }
            }
            $response = MigratoryDataResponse::NOT_CONNECTED;
            foreach ($responses as $r) {
                $value = $r[$cluster];
                if ($value == MigratoryDataResponse::OK) {
                    $response = MigratoryDataResponse::OK;
                    break;
                } else if ($value == MigratoryDataResponse::TIMEOUT) {
                    $response = MigratoryDataResponse::TIMEOUT;
                } else if ($value == MigratoryDataResponse::NOT_SUBSCRIBED) {
                    $response = MigratoryDataResponse::NOT_SUBSCRIBED;
                }
            }
            $responseByCluster[$cluster] = $response;
        }
		return $responseByCluster;
	}
	
	public function getAgentURLs()
	{
		return $this->agentURLs;
	}
	
	public function getPublisherType()
	{
		return $this->publisherType;
	}
	
    public function getExceptions() 
	{
	    return $this->exceptions;
	}
	
	public function getClusterNames() 
	{
    	return $this->clusterNames;
    }
}

////////////////////////////////////////////////////////////////////////////////
class MigratoryDataTransport
{
	const REQUEST_ENTITY_TOO_LARGE = "413";
	const INVALID_MESSAGE_CODE = "301";	
	const PUBLISH_RESPONSE_CODE = "201";
	const RETURN_AGENT_NAME_CODE = "202";

	private $clusterNames = array();
	private $agentURL = null;
	private $agentType = null;
	private $curlHandler = null;

	public function __construct($agentURL, $publisherType)
	{
		$this->agentURL = $agentURL;
		$this->curlHandler = curl_init($this->agentURL);
		if (empty($this->curlHandler))
		{
			throw new MigratoryDataException($this->agentURL, MigratoryDataException::E_TRANSPORT_INIT_FAILED);
		}
	
		$type = null;

		// Check if the agent specified by $agenturl is accessible and has the type $agentType 
		$data = chr(MigratoryDataUtils::RS);
		$data .= "GET_AGENT_TYPE";
		$data .= chr(MigratoryDataUtils::RS);
		$data .= chr(MigratoryDataUtils::GS);
		curl_setopt($this->curlHandler, CURLOPT_HTTPHEADER, array('Expect:'));
		curl_setopt($this->curlHandler, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->curlHandler, CURLOPT_POST, 1);
		curl_setopt($this->curlHandler, CURLOPT_HEADER, false);
		curl_setopt($this->curlHandler, CURLOPT_CONNECTTIMEOUT, 2);
		curl_setopt($this->curlHandler, CURLOPT_POSTFIELDS, $data);
		$response = curl_exec($this->curlHandler);
		
		if (empty($response)) {
			throw new MigratoryDataException($this->agentURL, MigratoryDataException::E_CONNECTION_FAILED);
		} else {
			$pos = strpos($response, ' ');
			if ($pos !== FALSE && $pos > 0) {
				$code = substr($response, 0, $pos);
				$responsePayload = substr($response, $pos + 1);
				if (self::RETURN_AGENT_NAME_CODE == $code) {
					if ($responsePayload !== false && $responsePayload != "") {
						$split = explode(';', $responsePayload);
						if (count($split) == 2) {
							$type = $split[0];
							$clusters = explode(',', $split[1]);
							foreach ($clusters as $cluster) {
								$this->clusterNames[] = $cluster;
							}
						}
					}
				} else if (self::INVALID_MESSAGE_CODE == $code) {
					throw new MigratoryDataException($responsePayload, MigratoryDataException::E_MSG_INVALID);
				} else {
					throw new MigratoryDataException("unkown response code '" . $code . "'", MigratoryDataException::E_INVALID_PROTOCOL);
				}
			} else {
				throw new MigratoryDataException($response, MigratoryDataException::E_INVALID_PROTOCOL);
			}		
		}
		
		if ($type != null) {
			$this->agentType = $type;
			if ($type != $publisherType) {
				curl_close($this->curlHandler);
				throw new MigratoryDataException("publisher type should be '" . $this->agentType . "'", MigratoryDataException::E_PUBLISHER_TYPE_MISMATCH);
			}
		} else {
			curl_close($this->curlHandler);
			throw new MigratoryDataException("null", MigratoryDataException::E_PUBLISHER_TYPE_MISMATCH);
		}
	}
	
	public function publish($message, $clusterName = null)
	{
		$ret = array();
		
		if (is_null($message)) {
			throw new MigratoryDataException("", MigratoryDataException::E_MSG_NULL);
		}
		if (!($message instanceof MigratoryDataMessage)) {
			throw new MigratoryDataException("", MigratoryDataException::E_MSG_INVALID);
		}
        foreach ($this->clusterNames as $cluster) {
            $ret[$cluster] = MigratoryDataResponse::NOT_CONNECTED;
		}
		
        $subject = $message->getSubject();
        $content = $message->getContent();
		
        if ($subject == null || strlen($subject) == 0) {
			throw new MigratoryDataException("null", MigratoryDataException::E_INVALID_SUBJECT);
        }
        if ($content == null) {
			throw new MigratoryDataException("content is null", MigratoryDataException::E_MSG_NULL);
        }

		$data = chr(MigratoryDataUtils::RS);
		$data .= "PUBLISH_MESSAGE";
		$data .= chr(MigratoryDataUtils::RS);


    	if ($clusterName != null && in_array($clusterName, $this->clusterNames)) {
			$data .= "Cluster";
			$data .= chr(MigratoryDataUtils::RS);
        	$data .= MigratoryDataUtils::escape($clusterName);
        	$data .= chr(MigratoryDataUtils::RS);
    	}
    	
    	if (MigratoryDataUtils::startsWith($subject, "/" . $this->agentType . "/")) {
		    $data .= MigratoryDataUtils::escape($subject);
			$data .= chr(MigratoryDataUtils::RS);
			$data .= MigratoryDataUtils::escape($content);
			$data .= chr(MigratoryDataUtils::RS);
        } else {
		    throw new MigratoryDataException($subject, MigratoryDataException::E_MSG_HAS_SUBJECT_WITH_BAD_DESTINATION);
		}
                
        $fields = $message->getFields();
        if (is_array($fields) && count($fields) > 0) {
			$data .= MigratoryDataUtils::escape("Fields");
        	$data .= chr(MigratoryDataUtils::RS);
			foreach ($fields as $field) {
                if ($field instanceof MigratoryDataField) {
                    $fieldName = $field->getName();
					if ($fieldName == null || strlen($fieldName) == 0) {
						throw new MigratoryDataException("empty", MigratoryDataException::E_MSG_FIELD_INVALID);
					}
					$data .= MigratoryDataUtils::escape($fieldName);
        			$data .= chr(MigratoryDataUtils::RS);

                    $fieldValue = $field->getValue();
					if ($fieldValue == null || strlen($fieldValue) == 0) {
						throw new MigratoryDataException("empty", MigratoryDataException::E_MSG_FIELD_INVALID);
					}                       
        			$data .= MigratoryDataUtils::escape($fieldValue);
        			$data .= chr(MigratoryDataUtils::RS);                
                } else {
            	    throw new MigratoryDataException("", MigratoryDataException::E_MSG_FIELD_INVALID);                        
                }
            }
        }
                    
    	$data .= chr(MigratoryDataUtils::GS);
    	curl_setopt($this->curlHandler, CURLOPT_HTTPHEADER, array('Expect:'));
    	curl_setopt($this->curlHandler, CURLOPT_RETURNTRANSFER, true);
    	curl_setopt($this->curlHandler, CURLOPT_POST, 1);
    	curl_setopt($this->curlHandler, CURLOPT_HEADER, false);
    	curl_setopt($this->curlHandler, CURLOPT_POSTFIELDS, $data);
    	$response = curl_exec($this->curlHandler);
    	//echo $response . "\n";
		if (empty($response)) {
		
		}
		$pos = strpos($response, ' ');
		if ($pos !== FALSE && $pos > 0) {
			$code = substr($response, 0, $pos);
			$responsePayload = substr($response, $pos + 1);
			if (self::PUBLISH_RESPONSE_CODE == $code) {
				$responseByCluster = explode(';', $responsePayload);
				foreach ($responseByCluster as $cluster) {
					$split = explode('=', $cluster);
					if (count($split) == 2) {
						$clusterName = $split[0];
						if (strlen($clusterName) > 0) {
							$clusterResponse = $split[1];
							if ("OK" == $clusterResponse) {
								$ret[$clusterName] = MigratoryDataResponse::OK;
							} else if ("NOT_SUBSCRIBED" == $clusterResponse) {
								$ret[$clusterName] = MigratoryDataResponse::NOT_SUBSCRIBED;
							} else if ("NOT_CONNECTED" == $clusterResponse) {
								$ret[$clusterName] = MigratoryDataResponse::NOT_CONNECTED;
							} else {
								$ret[$clusterName] = MigratoryDataResponse::TIMEOUT;
							}
						}
					}
				}
			} else if (self::INVALID_MESSAGE_CODE == $code) {
				throw new MigratoryDataException($responsePayload, MigratoryDataException::E_MSG_INVALID);
			} else if (self::REQUEST_ENTITY_TOO_LARGE == $code) {
				throw new MigratoryDataException($responsePayload, MigratoryDataException::E_MESSAGE_SIZE_LIMIT_REACHED);
			} else {
				throw new MigratoryDataException("unkown response code '" . $code . "'", MigratoryDataException::E_INVALID_PROTOCOL);
			}
        
		} else {
			//throw new MigratoryDataException($response, MigratoryDataException::E_INVALID_PROTOCOL);
		}
		return $ret;
	}
	
	public function getClusterNames() {
    	return $this->clusterNames;
    }

}

////////////////////////////////////////////////////////////////////////////////
class MigratoryDataUtils
{
	const RS = 30;

	const GS = 29;
	
	const US = 31;
	
	const SUBJECT_REGEX = '/^\/([^\/*]+\/)*([^\/*])+$/';
	
	public static function escape($data)
	{
		$result = "";
		
        for ($i = 0; $i < strlen($data); $i++)
        {
        	$c = ord($data{$i});
        	
        	if ( (self::RS == $c) || (self::GS == $c) || (self::US == $c) )
        	{
        		$result .= chr(self::US);
        	}
        	
        	$result .= chr($c);
        }
        
		return $result;
	}
	
	public static function isSubjectValid($subject)
	{
		return preg_match(self::SUBJECT_REGEX , $subject);
	}

	public static function startsWith($str, $prefix) 
	{
		return !strncmp($str, $prefix, strlen($prefix));
	}
}
