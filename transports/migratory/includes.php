<?php

/*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/
$callbackfn = ''; if (!empty($_GET['callbackfn']) && $_GET['callbackfn'] == 'desktop') { $desktopmode = 1; } else { $desktopmode = 0; }
include_once (dirname(__FILE__).DIRECTORY_SEPARATOR.'comet.js');
include_once (dirname(__FILE__).DIRECTORY_SEPARATOR.'config.php');
?>
var cometid = '';
var incoming = new Array();
var callback;
var timeDifference = 0;
var migratoryUserID = 0;
var server = new Array("<?php echo $serverURL; ?>");
var publisherType = "<?php echo $migratorydataPublisherType; ?>";
MigratoryDataClient.setServers(server);
(function(){
    jqcc(function(){
        if(typeof(cometready) !== 'undefined' ){
            cometready();
        }
	if(typeof(cometchatroomready) !== 'undefined' ){
            cometchatroomready();
	}
	if(typeof(chatroomready) !== 'undefined' ){
		chatroomready();
	}
    });
})();
function cometcall_function(id,td,calleeAPI){
	if(id != ''){
		timeDifference = td;
		cometid = id;
		var timetoken = jqcc.cookie('<?php echo $cookiePrefix; ?>timetoken') || 0;
		var channel = "/"+publisherType+"/"+id+"/-";
		var subject = new Array(channel);
		MigratoryDataClient.setMessageHandler(chatMessageHandler);
		MigratoryDataClient.subscribe(subject);
	}
}
function chatroomcall_function(id,userid){
	if(id != ''){
		migratoryUserID = userid;
		var channel = "/"+publisherType+"/"+id+"/-";
		var subject = new Array(channel);
		MigratoryDataClient.setMessageHandler(chatRoomMessageHandler);
		MigratoryDataClient.subscribe(subject);
	}
}
function cometuncall_function(id){
	if(id != ''){
		var channel = "/"+publisherType+"/"+id+"/-";
		var subject = new Array(channel);
		MigratoryDataClient.unsubscribe(subject);
	}
}
function chatMessageHandler(messages){
    for(var j = 0; j < messages[0].fields.length; j++){
        incoming[messages[0].fields[j].name] = messages[0].fields[j].value;
    }
    incoming.message = messages[0].data;
		<?php
		if(file_exists(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php')){
			include_once dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php';
			if($useGoogle == 1 && !empty($googleKey)){
		?>
				if(jqcc.cookie('<?php echo $cookiePrefix;?>lang') && (incoming.message).indexOf('CC^CONTROL_') == -1){
					var lang = jqcc.cookie('<?php echo $cookiePrefix;?>lang');
					jqcc.ajax({
						url: "https://www.googleapis.com/language/translate/v2?key=<?php echo $googleKey;?>&callback=?",
						data: {q: incoming.message, target: lang},
						dataType: 'jsonp',
						success: function(data){
							if(typeof(data.data)!="undefined"){
								incoming.message = data.data.translations[0].translatedText+' <span class="untranslatedtext">('+incoming.message+')</span>';
							}
							if(typeof(jqcc[calleeAPI].addMessages) == "function"){
								jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from":incoming.from, "message":incoming.message, "self":incoming.self, "old":0, "selfadded":0, "sent":parseInt(incoming.sent)+timeDifference}]);
							}
						}
					});
				}else{
					if(typeof(jqcc[calleeAPI].addMessages) == "function"){
						jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from":incoming.from, "message":incoming.message, "self":incoming.self, "old":0, "selfadded":0, "sent":parseInt(incoming.sent)+timeDifference}]);
					}
				}
			<?php
			} else { ?>
				if (typeof(jqcc[calleeAPI].addMessages) == "function"){
					jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from":incoming.from, "message":incoming.message, "self":incoming.self, "old":0, "selfadded":0, "sent":parseInt(incoming.sent)+timeDifference}]);
				}
			<?php
				}
			} else { ?>
				if (typeof(jqcc[calleeAPI].addMessages) == "function"){
					jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from":incoming.from, "message":incoming.message, "self":incoming.self, "old":0, "selfadded":0, "sent":parseInt(incoming.sent)+timeDifference}]);
				}
			<?php
			}
			?>
	}
function chatRoomMessageHandler(messages){
	for(var j = 0; j < messages[0].fields.length; j++){
		incoming[messages[0].fields[j].name] = messages[0].fields[j].value;
	}
   incoming.message = messages[0].data;
   <?php
     if(file_exists(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php')) {
     include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php');
     if($useGoogle == 1 && !empty($googleKey)){
     ?>
    if(jqcc.cookie('<?php echo $cookiePrefix;?>lang') && incoming.fromid != migratoryUserID && (incoming.message).indexOf('CC^CONTROL_') == -1){
        var lang = jqcc.cookie('<?php echo $cookiePrefix;?>lang');
        jqcc.ajax({
            url: "https://www.googleapis.com/language/translate/v2?key=<?php echo $googleKey;?>&callback=?",
            data: {q: incoming.message, target: lang},
            dataType: 'jsonp',
            success: function(data){
                if(typeof(data.data)!="undefined"){
                    incoming.message = data.data.translations[0].translatedText+' <span class="untranslatedtext">('+incoming.message+')</span>';
                }
                $.cometchat.setChatroomVars('newMessages',$.cometchat.getChatroomVars('newMessages')+1);
                $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from,'0');
            }
        });
    }else{
        $.cometchat.setChatroomVars('newMessages',$.cometchat.getChatroomVars('newMessages')+1);
        $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0');
    }
    <?php
     } else { ?>
        $.cometchat.setChatroomVars('newMessages',$.cometchat.getChatroomVars('newMessages')+1);
        $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0');
    <?php
     }
     } else { ?>
        $.cometchat.setChatroomVars('newMessages',$.cometchat.getChatroomVars('newMessages')+1);
        $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0');
    <?php } ?>
}