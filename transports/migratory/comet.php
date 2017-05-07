<?php

/*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

 */

include_once (dirname(__FILE__) . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'MigratoryDataPublisher.php');
include_once (dirname(__FILE__) . DIRECTORY_SEPARATOR . 'config.php');

class Comet {

    private $agentURLs = array();
    private $publisherType = '';
    private $publisher = null;

    function __construct() {
        global $agentURL;
        global $migratorydataPublisherType;
        $this->agentURLs[] = $agentURL;
        $this->publisherType = $migratorydataPublisherType;
        try {
            $this->publisher = new MigratoryDataPublisher($this->agentURLs, $this->publisherType);
        } catch (MigratoryDataException $e) {
            echo $e->getDetail() . "\n";
        }
    }

    function publish($args) {
        if (!$args['channel']) {
            echo('Missing Channel');
            return false;
        }
        $args['message']['message'] = str_replace("'", '%27', str_replace('"', '%22', $args['message']['message']));
        $channel = "/" . $this->publisherType . "/" . $args['channel'] . '/-';

        $message = $args['message'];
        try {
            $fields = array();
            $field1 = new MigratoryDataField("from", $message['from']);
            $fields[] = $field1;
            $field2 = new MigratoryDataField("sent", $message['sent']);
            $fields[] = $field2;
            $field3 = new MigratoryDataField("self", "'" . $message['self'] . "'");
            $fields[] = $field3;
            $message = new MigratoryDataMessage($channel, $args['message']['message'], $fields);
            $response = $this->publisher->publish($message);
        } catch (MigratoryDataException $e) {
            echo $e->getDetail() . "\n";
        }
    }
}