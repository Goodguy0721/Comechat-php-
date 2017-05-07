<?php
/*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/
?>
var pusher = '';
var cometid = '';
(function(){
    jqcc(function(){
        jqcc.getScript('http://js.pusher.com/2.1/pusher.min.js', function(){
            if(pusher==''){
                pusher = new Pusher('<?php echo $pusher_key;?>');
            }
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
    try{
        var channel = pusher.subscribe(id);
    }catch(e){}
    cometid = id;
    channel.bind('message', function(data){
        var incoming = data;
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
                 } else { ?>
                     jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
                <?php
                 }
        } else { ?>
             jqcc[calleeAPI].addMessages([{ "id": incoming.id, "from": incoming.from, "message": incoming.message, "self": incoming.self, "old": 0, "selfadded": 0, "sent": parseInt(incoming.sent)+td}]);
        <?php } ?>
    });
}
function chatroomcall_function(id,userid){
    if(typeof (pusher)=='string'){
        setTimeout("chatroomcall_function('"+id+"')", 400);
    }else{
        var channel = pusher.subscribe(id);
        channel.bind('message', function(data){
            var incoming = data;
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
             } else { ?>
                $.cometchat.setChatroomVars('newMessages', $.cometchat.getChatroomVars('newMessages')+1);
                $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from, '0', incoming.roomid);
            <?php } ?>
        });
    }
}
function cometuncall_function(id){
    if(id != '' && typeof id != 'undefined' && id in pusher.channels.channels){
        pusher.unsubscribe(id);
    }
}