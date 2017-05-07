<?php

/*
 * Copyright (c) 2007-2013 Migratory Data Systems (http://migratorydata.com)
 * ALL RIGHTS RESERVED. Use is subject to license terms.
 */

class MigratoryDataField
{
	private $name = "";
	
	private $value = "";
	
	public function __construct($name, $value)
	{		
    	$this->name = $name;
		$this->value = $value;
	}
	
	public function getName()
	{
		return $this->name;
	}
			
	public function getValue()
	{
		return $this->value;
	}
}
