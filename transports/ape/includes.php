<?php

 /*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/
?>

var APE = {
    Config: {
        identifier: 'ape',
        init: true,
        frequency: 0,
        scripts: []
    },
    Client: function(core){
        if(core){
            this.core = core;
        }
    }
}
APE.Client.prototype.eventProxy = [];
APE.Client.prototype.fireEvent = function(type, args, delay){
    this.core.fireEvent(type, args, delay);
};
APE.Client.prototype.addEvent = function(type, fn, internal){
    var newFn = fn.bind(this), ret = this;
    if(this.core==undefined){
        this.eventProxy.push([type, fn, internal]);
    }else{
        var ret = this.core.addEvent(type, newFn, internal);
        this.core.$originalEvents[type] = this.core.$originalEvents[type]||[];
        this.core.$originalEvents[type][fn] = newFn;
    }
    return ret;
};
APE.Client.prototype.removeEvent = function(type, fn){
    return this.core.removeEvent(type, fn);
};
APE.Client.prototype.onRaw = function(type, fn, internal){
    this.addEvent('raw_'+type.toLowerCase(), fn, internal);
};
APE.Client.prototype.onCmd = function(type, fn, internal){
    this.addEvent('cmd_'+type.toLowerCase(), fn, internal);
};
APE.Client.prototype.onError = function(type, fn, internal){
    this.addEvent('error_'+type, fn, internal);
};
APE.Client.prototype.cookie = {};
APE.Client.prototype.cookie.write = function(name, value){
    document.cookie = name+"="+encodeURIComponent(value)+"; domain="+document.domain;
};
APE.Client.prototype.cookie.read = function(name){
    var nameEQ = name+"=";
    var ca = document.cookie.split(';');
    for(var i = 0; i<ca.length; i++){
        var c = ca[i];
        while(c.charAt(0)==' ')
            c = c.substring(1, c.length);
        if(c.indexOf(nameEQ)==0){
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}
APE.Client.prototype.load = function(config){
    config = config||{};
    config.transport = config.transport||APE.Config.transport||0;
    config.frequency = config.frequency||0;
    config.domain = config.domain||APE.Config.domain||document.domain;
    config.scripts = config.scripts||APE.Config.scripts;
    config.server = config.server||APE.Config.server;
    config.init = function(core){
        this.core = core;
        for(var i = 0; i<this.eventProxy.length; i++){
            this.addEvent.apply(this, this.eventProxy[i]);
        }
    }.bind(this);
    if(config.transport!=2&&config.domain!='auto')
        document.domain = config.domain;
    var cookie = this.cookie.read('APE_Cookie');
    var tmp = eval('('+cookie+')');
    if(tmp){
        config.frequency = tmp.frequency+1;
    }else{
        cookie = '{"frequency":0}';
    }
    var reg = new RegExp('"frequency":([ 0-9]+)', "g");
    cookie = cookie.replace(reg, '"frequency":'+config.frequency);
    this.cookie.write('APE_Cookie', cookie);
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'ape_'+config.identifier);
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.left = '-300px';
    iframe.style.top = '-300px';
    document.body.appendChild(iframe);
    iframe.onload = function(){
        if(!iframe.contentWindow.APE)
            setTimeout(iframe.onload, 100);
        else
            iframe.contentWindow.APE.init(config);
    };
    if(config.transport==2){
        var doc = iframe.contentDocument;
        if(!doc)
            doc = iframe.contentWindow.document;
        doc.open();
        var theHtml = '<html><head></head>';
        for(var i = 0; i<config.scripts.length; i++){
            theHtml += '<script src="'+config.scripts[i]+'"></script>';
        }
        theHtml += '<body></body></html>';
        doc.write(theHtml);
        doc.close();
    }else{
        iframe.setAttribute('src', 'http://'+config.frequency+'.'+config.server+'/?[{"cmd":"script","params":{"domain":"'+document.domain+'","scripts":["'+config.scripts.join('","')+'"]}}]');
        if(navigator.product=='Gecko'){
            iframe.contentWindow.location.href = iframe.getAttribute('src');
        }
    }
};
if(Function.prototype.bind==null){
    Function.prototype.bind = function(bind, args){
        return this.create({'bind': bind, 'arguments': args});
    };
}
if(Function.prototype.bind==null){
    Function.prototype.bind = function(bind, args){
        return this.create({'bind': bind, 'arguments': args});
    }
}
if(Function.prototype.create==null){
    Function.prototype.create = function(options){
        var self = this;
        options = options||{};
        return function(){
            var args = options.arguments||arguments;
            if(args&&!args.length){
                args = [args];
            }
            var returns = function(){
                return self.apply(options.bind||null, args);
            };
            return returns();
        };
    }
}
APE.Config.baseUrl = '<?php echo $ape_baseurl;?>';
APE.Config.domain = '<?php echo $ape_domain;?>';
APE.Config.server = '<?php echo $ape_server;?>';
APE.Config.transport = 2;
APE.Config.scripts.push('http://ajax.googleapis.com/ajax/libs/mootools/1.4.1/mootools-yui-compressed.js');
(function(){
    for(var i = 0; i<arguments.length; i++)
        APE.Config.scripts.push(APE.Config.baseUrl+'/Source/'+arguments[i]+'.js');
})('Core/APE', 'Core/Events', 'Core/Core', 'Pipe/Pipe', 'Pipe/PipeProxy', 'Pipe/PipeMulti', 'Pipe/PipeSingle', 'Request/Request', 'Request/Request.Stack', 'Request/Request.CycledStack', 'Transport/Transport.longPolling', 'Transport/Transport.SSE', 'Transport/Transport.XHRStreaming', 'Transport/Transport.JSONP', 'Transport/Transport.WebSocket', 'Core/Utility', 'Core/JSON');
var apeServer = null;
var cometid = '';
var pubid = '';
var cometfirsttime = 0;
jqcc(function(){
    var client = new APE.Client;
    client.load({
        'domain': APE.Config.domain,
        'server': APE.Config.server,
        'complete': function(ape){
            apeServer = ape;
            ape.start({'name': String((new Date()).getTime()).replace(/\D/gi, '')});
        },
        'scripts': APE.Config.scripts
    });
    client.addEvent('ready', function(args){
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
    client.onError('004', function(args){
        client.core.clearSession();
        // client.core.initialize(client.core.options);
    });
});
function cometcall_function(id, td, calleeAPI){
    cometid = id;
    apeServer.join(id);
    if(!cometfirsttime){
        apeServer.addEvent('onRaw', function(args){
            if(args.raw=='postmsg'){
                var incoming = args.data.message;
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
                <?php } ?>
            }
        });
        cometfirsttime++;
    }
}
function chatroomcall_function(id,userid){
    apeServer.join(id);
    if(!cometfirsttime){
        apeServer.addEvent('onRaw', function(args){
            if(args.raw=='postmsg'){
                var incoming = args.data.message;
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
                $[$.cometchat.getChatroomVars('calleeAPI')].addChatroomMessage(incoming.fromid, incoming.message, incoming.id, '1', parseInt(incoming.sent), incoming.from,'0', incoming.roomid);
            <?php } ?>
            }
            if(args.raw=='CHANNEL'){
                pubid = args.data.pipe.pubid;
            }
        });
        cometfirsttime++;
    }
}
function cometuncall_function(id){
    if(pubid!=''){
        apeServer.left(pubid);
        pubid = '';
    }
}
