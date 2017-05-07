<?php
	include_once(dirname(__FILE__).DIRECTORY_SEPARATOR."config.php");

	if (file_exists(dirname(__FILE__).DIRECTORY_SEPARATOR."lang.php")) {
		include_once(dirname(__FILE__).DIRECTORY_SEPARATOR."lang.php");
	}

	foreach ($writeboard_language as $i => $l) {
		$writeboard_language[$i] = str_replace("'", "\'", $l);
	}
?>

/*
 * CometChat
 * Copyright (c) 2016 Inscripts - support@cometchat.com | http://www.cometchat.com | http://www.inscripts.com
*/

(function($){

	$.ccwriteboard = (function () {

		var title = '<?php echo $writeboard_language[0];?>';
		var lastcall = 0;
		var height = <?php echo $writebHeight;?>;
		var width = <?php echo $writebWidth;?>;
		var mobileDevice = navigator.userAgent.match(/ipad|ipod|iphone|android|windows ce|Windows Phone|blackberry|palm|symbian/i);

        return {

			getTitle: function() {
				return title;
			},

			init: function (params) {
				var id = params.to;
				var theme = '<?php echo $theme; ?>';
				var chatroommode = params.chatroommode;
				var windowMode = 0;
				if(typeof(params.windowMode) == "undefined") {
					windowMode = 0;
				} else {
					windowMode = 1;
				}
				if(chatroommode == 1) {
					var currenttime = new Date();
					currenttime = parseInt(currenttime.getTime()/1000);
					if (currenttime-lastcall > 10) {
						baseUrl = $.cometchat.getBaseUrl();
						basedata = $.cometchat.getBaseData();
						var random = currenttime;
						lastcall = currenttime;
						if(mobileDevice == null){
							loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=1&chatroommode=1&roomid='+id+'&id='+random+'&basedata='+basedata, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width=<?php echo $writebWidth;?>,height=<?php echo $writebHeight;?>",width,height-50,'<?php echo $writeboard_language[7];?>',1,1,1,1,windowMode);
						} else if(theme == 'embedded'){
							loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=1&chatroommode=1&roomid='+id+'&id='+random+'&basedata='+basedata, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width=<?php echo $writebWidth;?>,height=<?php echo $writebHeight;?>",width,'100%','<?php echo $writeboard_language[7];?>',1,1,1,1,1);
						}else{
							loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=1&chatroommode=1&roomid='+id+'&id='+random+'&basedata='+basedata, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width=<?php echo $writebWidth;?>,height=<?php echo $writebHeight;?>",width,height-50,'<?php echo $writeboard_language[7];?>',1,1,1,1,1);
						}
					} else {
						alert('<?php echo $writeboard_language[1];?>');
					}
				} else {
					var currenttime = new Date();
					currenttime = parseInt(currenttime.getTime()/1000);
					if (currenttime-lastcall > 10) {
						baseUrl = $.cometchat.getBaseUrl();
						baseData = $.cometchat.getBaseData();

						var random = currenttime;
						$.getJSON(baseUrl+'plugins/writeboard/index.php?action=request&callback=?', {to: id, id: random, basedata: baseData});
						lastcall = currenttime;
						if(mobileDevice == null){
							loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=1&id='+random+'&basedata='+baseData, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width="+width+",height="+height,width,height-50,'<?php echo $writeboard_language[7];?>',0,1,1,1,windowMode);
						} else if(theme == 'embedded'){
							loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=1&id='+random+'&basedata='+baseData, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width="+width+",height=100%",width,height-50,'<?php echo $writeboard_language[7];?>',0,1,1,1,1);
						}else{
							loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=1&id='+random+'&basedata='+baseData, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width="+width+",height="+height,width,height-50,'<?php echo $writeboard_language[7];?>',0,1,1,1,1);
						}

					} else {
						alert('<?php echo $writeboard_language[1];?>');
					}
				}
			},

			accept: function (params) {
				var id = params.to;
				var random = params.random;
				var chatroommode = params.chatroommode;
				windowMode = 0;
				if(typeof(params.windowMode) == "undefined") {
					windowMode = 0;
				} else {
					windowMode = 1;
				}
				if(chatroommode == 1) {
				   	baseUrl = $.cometchat.getBaseUrl();
				   	basedata = $.cometchat.getBaseData();
				   	if(mobileDevice == null){
				   		var controlparameters = {"type":"plugins", "name":"core", "method":"loadCCPopup", "params":{"url": baseUrl+"plugins/writeboard/index.php?action=writeboard&type=0&id="+random+"&basedata="+basedata, "name":"writeboard", "properties":"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width=<?php echo $writebWidth;?>,height=<?php echo $writebHeight;?>", "width":width, "height":height-50, "title":'<?php echo $writeboard_language[7];?>', "force":"1", "allowmaximize":"1", "allowresize":"1", "allowpopout":"1", "windowMode":windowMode}};
				   	} else{
				   		var controlparameters = {"type":"plugins", "name":"core", "method":"loadCCPopup", "params":{"url": baseUrl+"plugins/writeboard/index.php?action=writeboard&type=0&id="+random+"&basedata="+basedata, "name":"writeboard", "properties":"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width=<?php echo $writebWidth;?>,height=<?php echo $writebHeight;?>", "width":width, "height":height-50, "title":'<?php echo $writeboard_language[7];?>', "force":"1", "allowmaximize":"1", "allowresize":"1", "allowpopout":"1", "windowMode":1}};
				   }
                    controlparameters = JSON.stringify(controlparameters);
                    parent.postMessage('CC^CONTROL_'+controlparameters,'*');
                } else {
					baseUrl = $.cometchat.getBaseUrl();
					baseData = $.cometchat.getBaseData();
					$.getJSON(baseUrl+'plugins/writeboard/index.php?action=accept&callback=?', {to: id, basedata: baseData});
					if(mobileDevice == null){
						loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=0&id='+random+'&basedata='+baseData, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width="+width+",height="+height,width,height-50,'<?php echo $writeboard_language[7];?>',0,1,1,1,windowMode);
					} else{
						loadCCPopup(baseUrl+'plugins/writeboard/index.php?action=writeboard&type=0&id='+random+'&basedata='+baseData, 'writeboard',"status=0,toolbar=0,menubar=0,directories=0,resizable=1,location=0,status=0,scrollbars=0, width="+width+",height="+height,width,height-50,'<?php echo $writeboard_language[7];?>',0,1,1,1,1);
					}
				}
			}
        };
    })();

})(jqcc);

jqcc(document).ready(function(){
	jqcc('.accept_Write').live('click',function(){
		var to = jqcc(this).attr('to');
		var random = jqcc(this).attr('random');
		var chatroommode = jqcc(this).attr('chatroommode');
		if(typeof(parent) != 'undefined' && parent != null && parent != self){
			var controlparameters = {"type":"plugins", "name":"ccwriteboard", "method":"accept", "params":{"to":to, "random":random, "chatroommode":chatroommode}};
			controlparameters = JSON.stringify(controlparameters);
			parent.postMessage('CC^CONTROL_'+controlparameters,'*');
		} else {
			var controlparameters = {"to":to, "random":random, "chatroommode":chatroommode};
            jqcc.ccwriteboard.accept(controlparameters);
		}
	});
});