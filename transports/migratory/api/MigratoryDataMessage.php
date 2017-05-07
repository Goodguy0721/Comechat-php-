<?php

/*
 * Copyright (c) 2007-2013 Migratory Data Systems (http://migratorydata.com)
 * ALL RIGHTS RESERVED. Use is subject to license terms.
 */

require_once 'MigratoryDataField.php';
require_once 'MigratoryDataException.php';

class MigratoryDataMessage
{
	private $subject = "";
	
	private $content = "";
	
	private $fields = array();
	
	public function __construct($subject, $content, $fields = array())
	{		
		if (MigratoryDataUtils::isSubjectValid($subject))
		{
			$this->subject = $subject;
			$this->content = $content;
			$this->fields = $fields;
		}
		else
		{
			throw new MigratoryDataException($subject, MigratoryDataException::E_INVALID_SUBJECT);
		}
	}
	
	public function getSubject()
	{
		return $this->subject;
	}
			
	public function getContent()
	{
		return $this->content;
	}

    public function getFields() {
        return $this->fields;
    }
    
}
