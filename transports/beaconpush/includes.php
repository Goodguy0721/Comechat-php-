<?php

 /*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/
 ?>
var cometid = '';
var cometfirsttime = 0;
(function(){
    jqcc(function(){
        jqcc.getScript('http://cdn.beaconpush.com/clients/client-1.js', function(){
            if(typeof (cometready)!=='undefined'){
                cometready();
            }
            if(typeof (cometchatroomready)!=='undefined'){
                cometchatroomready();
            }
            if(typeof (chatroomready)!=='undefined'){
                chatroomready();
            }
        });
    });
})();
function cometcall_function(id, td, calleeAPI){
    cometid = id;
    Beacon.connect('<?php echo $beaconpush_apikey;?>', [id], {log: false});
    if(!cometfirsttime){
        Beacon.listen(function(data){
            var incoming = data.message;
            incoming.message = unescape(incoming.message);
            <?php
             if(file_exists(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php')) {
                include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php');
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
                                 jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
                            }
                        });
                    }else{
                         jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
                    }
                    <?php
                     } else {
                    ?>
                         jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
                    <?php
                     }
             } else {
                    ?>
                jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
            <?php
                    }
            ?>
        });
        cometfirsttime++;
    }
}
function chatroomcall_function(id,userid){
    Beacon.connect('<?php echo $beaconpush_apikey;?>', [id], {log: false});
    if(!cometfirsttime){
        Beacon.listen(function(data){
            var incoming = data.message;
            incoming.message = unescape(incoming.message);
            <?php
             if(file_exists(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php')) {
                include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'modules'.DIRECTORY_SEPARATOR.'realtimetranslate'.DIRECTORY_SEPARATOR.'config.php');
                if($useGoogle == 1 && !empty($googleKey)){
             ?>
                    if(jqcc.cookie('<?php echo $cookiePrefix;?>lang') && incoming.fromid != userid && (incoming.message).indexOf('CC^CONTROL_') == -1){
                        var lang = jqcc.cookie('<?php echo $cookiePrefix;?>lang');
                        jqcc.ajax({
                            url: "https://www.googleapis.com/language/translate/v2?key=<?php echo $googleKey;?>&callback=?",
                            data: {q: incoming.message, target: lang},
                            dataType: 'jsonp',
                            success: function(data){
                                if(typeof(data.data)!="undefined"){
                                    incoming.message = data.data.translations[0].translatedText+' <span class="untranslatedtext">('+incoming.message+')</span>';
                                }
                                $.cometchat.setChatroomVars('newMessages', $.cometchat.getChatroomVars('newMessages')+1);
                                $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0', incoming.roomid);
                            }
                        });
                    }else{
                        $.cometchat.setChatroomVars('newMessages', $.cometchat.getChatroomVars('newMessages')+1);
                        $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0', incoming.roomid);
                    }
                    <?php
                     } else {
                    ?>
                        $.cometchat.setChatroomVars('newMessages', $.cometchat.getChatroomVars('newMessages')+1);
                        $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0', incoming.roomid);
                    <?php
                     }
             } else {
                    ?>
                $.cometchat.setChatroomVars('newMessages', $.cometchat.getChatroomVars('newMessages')+1);
                $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0', incoming.roomid);
            <?php
                }
            ?>
        });
        cometfirsttime++;
    }
}
function cometuncall_function(id){
    Beacon.disconnect();
}