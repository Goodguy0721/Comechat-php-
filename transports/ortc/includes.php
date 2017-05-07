<?php
 /*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/
 include_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'ortc.js');
 ?>
var cometid = '';
var cometfirsttime = 0;
var ortcClient;
var origin = 'http://ortc-developers.realtime.co/server/2.1';
if(document.location.protocol=='https:'){
    origin = 'https://ortc-developers.realtime.co/server/ssl/2.1';
}
(function(){
    jqcc(function(){
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
})();
function cometcall_function(id, td, calleeAPI){
    cometid = id;
    loadOrtcFactory(IbtRealTimeSJType, function(factory, error){
        if(error==null&&factory!=null){
            ortcClient = factory.createClient();
            ortcClient.setId(id);
            ortcClient.setClusterUrl(origin);
            ortcClient.onConnected = function(ortc){
                ortcClient.subscribe(id, true, function(ortc, channel, message){
                    var incoming = JSON.parse(message);
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
                                         jqcc[calleeAPI].addMessages([{"id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
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
                     } else { ?>
                         jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
                    <?php
                        }
                    ?>
                });
            };
            ortcClient.connect('<?php echo $ortc_apikey;?>', '<?php echo $ortc_secretkey?>');
            cometfirsttime++;
        }
    });
}
function chatroomcall_function(id,userid){
    loadOrtcFactory(IbtRealTimeSJType, function(factory, error){
        if(error==null&&factory!=null){
            ortcClient = factory.createClient();
            ortcClient.setId(id);
            ortcClient.setClusterUrl(origin);
            ortcClient.onConnected = function(ortc){
                ortcClient.subscribe(id, true, function(ortc, channel, message){
                    var incoming = JSON.parse(message);
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
                        } else { ?>
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
            };
            ortcClient.connect('<?php echo $ortc_apikey;?>', '<?php echo $ortc_secretkey?>');
            cometfirsttime++;
        }
    });
}
function cometuncall_function(id){
    if(typeof (ortcClient)!='undefined'){
        ortcClient.disconnect();
    }
}
