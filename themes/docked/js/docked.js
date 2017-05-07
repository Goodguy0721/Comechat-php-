(function($){
    $.ccdocked = (function(){
        var settings = {};
        var baseUrl;
        var basedata;
        var language;
        var trayicon;
        var typingSenderTimer;
        var typingRecieverTimer;
        var typingSenderFlag = 1;
        var typingReceiverFlag = {};
        var resynchTimer;
        var notificationTimer;
        var chatboxOpened = {};
		var undeliveredmessages = [];
        var unreadmessages = [];
        var allChatboxes = {};
        var chatboxDistance = 10;
        var visibleTab = [];
        var blinkInterval;
        var trayWidth = 0;
        var siteOnlineNumber = 0;
        var olddata = {};
        var tooltipPriority = 0;
        var desktopNotifications = {};
        var webkitRequest = 0;
        var chatbottom = [];
        var resynch = 0;
        var reload = 0;
        var lastmessagetime = Math.floor(new Date().getTime());
        var favicon;
        var msg_beep = '';
        var side_bar = '';
        var option_button = '';
        var user_tab = '';
        var chat_boxes = '';
        var chat_left = '';
        var unseen_users = '';
        var usertab2 = '';
        var checkfirstmessage;
        var chatboxHeight = parseInt('<?php echo $chatboxHeight; ?>');
        var chatboxWidth = parseInt('<?php echo $chatboxWidth; ?>');
        var bannedMessage = '<?php echo $bannedMessage;?>';
        var lastseen = 0;
        var lastseenflag = false;
        var barVisiblelimit = (chatboxWidth + chatboxDistance + 14);
        var messagereceiptflag = 0;
        var mobileDevice = navigator.userAgent.match(/ipad|ipod|iphone|android|windows ce|Windows Phone|blackberry|palm|symbian/i);
        return {
            playSound: function(){
                var flag = 0;
                try{
                    if(settings.messageBeep==1&&(settings.beepOnAllMessages==1||(settings.beepOnAllMessages == 0 && checkfirstmessage == 1))){
                        document.getElementById('messageBeep').play();
                    }
                }catch(error){
                }
            },
            initialize: function(){
                settings = jqcc.cometchat.getSettings();
                baseUrl = jqcc.cometchat.getBaseUrl();
                basedata = jqcc.cometchat.getBaseData();
                language = jqcc.cometchat.getLanguage();
                trayicon = jqcc.cometchat.getTrayicon();
                var modules = '';
                var login_mode = '';
                var announcementmodule = '';
                if(settings.windowFavicon==1){
                    favicon = new Favico({
                        animation: 'pop'
                    });
                }

                if(settings.ccauth.enabled == "1"){
                     ccauthpopup = '<div id="cometchat_auth_popup" class="cometchat_tabpopup" style="display:none"><div class="cometchat_userstabtitle"><div class="cometchat_userstabtitletext">'+language[51]+'</div><div class="cometchat_minimizebox cometchat_tooltip" id="cometchat_minimize_auth_popup" title="'+language[27]+'"></div><br clear="all"/></div><div class="cometchat_tabcontent cometchat_optionstyle"><div id="social_login">';
                    var authactive = settings.ccauth.active;
                    authactive.forEach(function(auth) {
                        ccauthpopup += '<div  class="auth_options '+auth.toLowerCase()+'_auth_options" onclick="window.open(\''+baseUrl+'functions/login/signin.php?network='+auth.toLowerCase()+'\',\'socialwindow\')" ><img src="'+baseUrl+'themes/'+settings.theme+'/images/login'+auth.toLowerCase()+'.svg"><span>'+auth.toLowerCase()+'</span></div>';
                    });


                    ccauthpopup += '</div></div></div>';
                    login_mode = '<div id="cometchat"></div><div id="cometchat_optionsimages_ccauth"><span id="cometchat_ccauth_text">'+language[51]+'</span></div>'+ccauthpopup;
                }else{
                    login_mode = '<div id="cometchat"></div><div id="cometchat_hidden"><div id="cometchat_hidden_content"></div></div><div id="cometchat_tooltip"><div class="cometchat_tooltip_content"></div></div>';
                }
                $("body").append(login_mode);

                var hasChatroom = 0;
                var hasBroadcastMessage = 0;
                if(settings.showModules==1){
                	var listedmodules = ['chatrooms', 'announcements', 'broadcastmessage'];
                    var trayiconclick = '';
                    for(x in trayicon){
                        if(trayicon.hasOwnProperty(x)){
                            if(x=='home') {
                                trayiconclick = 'onclick="location.href = \'/\';"';
                            } else if(x=='scrolltotop') {
                                trayiconclick = 'onclick="javascript:jqcc.cometchat.scrollToTop()"';
                            } else {
                                trayiconclick = 'onclick="jqcc.cometchat.lightbox(\''+x+'\')"';
                            }
                        	if(listedmodules.indexOf(x) == -1) {
	                            modules += '<div id="cometchat_module_'+x+'" class="cometchat_lightdisplay cometchat_module" '+trayiconclick+'>'+trayicon[x][1]+'</div>';
                        	}
                        }
                        if(x=='chatrooms'){
                            hasChatroom = 1;
                        } else if(x=='announcements'){
                            announcementmodule = '<div id="cometchat_alertsicon" class="cometchat_tabicons"></div>';
                        } else if(x=='broadcastmessage'){
                            hasBroadcastMessage = 1;
                        }
                    }
                }

                var usertab = '';
                var usertabpop = '';
                var findUser = '<div id="cometchat_searchbar" class=""><div id="cometchat_searchbar_icon"></div><div class="cometchat_closeboxsearch cometchat_tooltip" id="close_user_search" title="'+language[115]+'"></div><input id="cometchat_search" type="text" name="cometchat_search" class="cometchat_search cometchat_search_light textInput" placeholder="'+language[18]+'"></div>';

                var statusmessagecount = 140;
                var blockeduserscount = 0;
                var optionsbuttonpop = '';

                if(settings.showSettingsTab==1 || 1){

                    optionsbuttonpop = '<div id="cometchat_optionsbutton_popup" class="cometchat_tabpopup cometchat_tabhidden"><div class="cometchat_userstabtitle"><div class="cometchat_userstabtitletext" style="width: 80%;text-align: center;">'+language['more']+'</div><div class="cometchat_closebox cometchat_tooltip" id="cometchat_minimize_optionsbuttonpopup" title="'+language[63]+'"></div></div><div id="cometchat_optionscontent" class="cometchat_tabcontent cometchat_optionstyle" style="overflow:hidden;"><form id="cometchat_optionsform"><div id="cometchat_selfname"><div class="cometchat_chats_labels">'+language[43].toUpperCase()+'</div><textarea readonly id="cometchat_displayname" class="cometchat_lightdisplay"></textarea></div><div id="cometchat_statusmessage"><div class="cometchat_chats_labels">'+language[2].toUpperCase()+'</div><div id="cometchat_statusmessageinput"><textarea class="cometchat_statustextarea" maxlength="140"></textarea><div class="cometchat_statusmessagecount">'+statusmessagecount+'</div></div></div><div class="cometchat_statusinputs"><div class="cometchat_chats_labels">'+language[23].toUpperCase()+'</div><div><div class="cometchat_optionsstatus available cometchat_lightdisplay"><div class="cometchat_optionsstatus2 cometchat_user_available"></div>'+language['available']+'<label class="cometchat_statusradio"><input id="cometchat_statusavailable_radio" type="radio" name="cometchat_statusoptions" value="available" checked><span class="cometchat_radio_outer"><span class="cometchat_radio_inner"></span></span></label></div><div class="cometchat_optionsstatus away cometchat_lightdisplay"><div class="cometchat_optionsstatus2 cometchat_user_away" ></div>'+language['away']+'<label class="cometchat_statusradio"><input id="cometchat_statusaway_radio" type="radio" name="cometchat_statusoptions" value="away"><span class="cometchat_radio_outer"><span class="cometchat_radio_inner"></span></span></label></div><div class="cometchat_optionsstatus busy cometchat_lightdisplay"><div class="cometchat_optionsstatus2 cometchat_user_busy"></div>'+language['busy']+'<label class="cometchat_statusradio"><input id="cometchat_statusbusy_radio" type="radio" name="cometchat_statusoptions" value="busy"><span class="cometchat_radio_outer"><span class="cometchat_radio_inner"></span></span></label></div><div class="cometchat_optionsstatus cometchat_gooffline cometchat_lightdisplay"><div class="cometchat_optionsstatus2 cometchat_user_invisible"></div>'+language['invisible']+'<label class="cometchat_statusradio"><input id="cometchat_statusinvisible_radio" type="radio" name="cometchat_statusoptions" value="invisible"><span class="cometchat_radio_outer"><span class="cometchat_radio_inner"></span></span></label></div></div></div><div class="cometchat_options_disable"><div class="cometchat_chats_labels">'+language['notifications'].toUpperCase()+'</div><div><div class="cometchat_lightdisplay"><span class="cometchat_checkbox">'+language[13]+'</span><label class="cometchat_checkboxcontrol cometchat_checkboxouter" id="cometchat_soundnotifications_label"><input type="checkbox" class="cometchat_checkbox" name="cometchat_soundnotifications" id="cometchat_soundnotifications"><div class="cometchat_controlindicator"></div><div class="cometchat_checkindicator"></div></label></div><div class="cometchat_lightdisplay"><span  class="cometchat_checkbox">'+language[24]+'</span><label class="cometchat_checkboxcontrol cometchat_checkboxouter" id="cometchat_popupnotifications_label"><input type="checkbox" class="cometchat_checkbox" name="cometchat_popupnotifications" id="cometchat_popupnotifications"><div class="cometchat_controlindicator"></div><div class="cometchat_checkindicator"></div></label></div></div></div><div class="cometchat_chats_labels"></div><div id="cometchat_blockedusersoptions"><div class="cometchat_lightdisplay"><span style="padding-right:22px;">'+language['blocked_users']+'</span><span class="cometchat_arrowright"></span><span id="cometchat_blockeduserscount">'+blockeduserscount+'</span></div></div><div class="cometchat_chats_labels"></div><div id="cometchat_moduleslist">'+modules+'</div></form></div></div>';
                }

                var buddylist = '<div class="cometchat_chatlisttext">'+language[28]+'</div>';
                var recentchats = '<div class="cometchat_chatlisttext">'+language['no_recent_chats']+'</div>';
                var groups = '<div class="cometchat_chatlisttext">'+language['no_groups']+'</div>';
                var tabcontent = '';
                if(settings.showOnlineTab==1){
                    tabcontent += '<div class="cometchat_tabscontainer"><div id="cometchat_contactstab" class="cometchat_tab cometchat_tab_clicked" unselectable="on"><span id="cometchat_chatstab_text" class="cometchat_tabstext">'+language['contacts']+'</span></div></div>';
                    tabcontent += '<div class="cometchat_tabscontainer"><div id="cometchat_groupstab" class="cometchat_tab" unselectable="on"><span id="cometchat_groupstab_text" class="cometchat_tabstext">'+language['groups']+'</span></div></div>';

                    usertab = '<span id="cometchat_userstab" class="cometchat_tab"><span id="cometchat_userstab_text">'+language[9]+'</span></span>';

                    usertabpop = '<div id="cometchat_userstab_popup" class="cometchat_tabpopup cometchat_tabhidden"><div class="cometchat_userstabtitle"><div class="cometchat_userstabtitletext cometchat_tabtitle_header">'+language[9]+'</div><div class="cometchat_closebox cometchat_tooltip" id="cometchat_minimize_userstabpopup" title="'+language[62]+'"></div><div class="cometchat_vline"></div><div id="cometchat_newchat" class="cometchat_tabicons"></div>'+announcementmodule+'<div id="cometchat_moreicon" class="cometchat_tabicons"></div></div><div id="cometchat_tabcontainer">'+tabcontent+'</div>'+findUser+'<div class="cometchat_tabcontent cometchat_tabstyle"><div id="cometchat_userscontent"><div id="cometchat_contactslist" class="cometchat_tabopen"><div id="cometchat_userslist_content">'+buddylist+'</div></div><div id="cometchat_groupslist" class="cometchat_tabhidden"><div id="cometchat_groupslist_content">'+groups+'</div></div></div></div></div>';
                }
                var loggedout = '<div id="loggedout" class="cometchat_tab cometchat_tooltip" title="'+language[8]+'"></div>';
                    loggedout = '';
               	var baseCode = '<div id="cometchat_base">'+loggedout+'<div id="cometchat_sidebar">'+usertabpop+'</div>'+optionsbuttonpop+''+usertab+'<div id="cometchat_chatboxes"><div id="cometchat_chatboxes_wide" class="cometchat_floatR"></div></div><div id="cometchat_chatbox_left" class="cometchat_tab"><div class="cometchat_tabalertlr" style="display:none;"></div><div class="cometchat_tabtext">0</div><div id="cometchat_unseenUserCount"></div><div id="cometchat_chatbox_left_border_fix"></div></div><div id="cometchat_unseenUsers"></div></div>';

                document.getElementById('cometchat').innerHTML = baseCode;
                if(hasChatroom == 1){
                    jqcc.crdocked.chatroomInit();
                }
                if(settings.showSettingsTab==0){
                    $('#cometchat_userstab').addClass('cometchat_extra_width');
                    $('#cometchat_userstab_popup').find('div.cometchat_tabstyle').addClass('cometchat_border_bottom');
                }

                if($.cookie(settings.cookiePrefix+"sound")){
                    if($.cookie(settings.cookiePrefix+"sound")=='true'){
                        $("#cometchat_soundnotifications").attr("checked", true);
                        $('#cometchat_soundnotifications_label').find('.cometchat_checkindicator').css('display','block');
                    }else{
                        $("#cometchat_soundnotifications").attr("checked", false);
                        $('#cometchat_soundnotifications_label').find('.cometchat_checkindicator').css('display','none');
                    }
                } else {
                    $.cookie(settings.cookiePrefix+"sound", 'true');
                    $("#cometchat_soundnotifications").attr("checked", true);
                    $('#cometchat_soundnotifications_label').find('.cometchat_checkindicator').css('display','block');
                }

                if($.cookie(settings.cookiePrefix+"popup")){
                    if($.cookie(settings.cookiePrefix+"popup")=='true'){
                        $("#cometchat_popupnotifications").attr("checked", true);
                        $('#cometchat_popupnotifications_label').find('.cometchat_checkindicator').css('display','block');
                    }else{
                        $("#cometchat_popupnotifications").attr("checked", false);
                        $('#cometchat_popupnotifications_label').find('.cometchat_checkindicator').css('display','none');
                    }
                } else {
                    $.cookie(settings.cookiePrefix+"popup", 'true');
                    $("#cometchat_popupnotifications").attr("checked", true);
                    $('#cometchat_popupnotifications_label').find('.cometchat_checkindicator').css('display','block');
                }

				setTimeout(function(){
                    var sidebar = jqcc('#cometchat_sidebar');
                    var usertabpopheight = (sidebar.outerHeight(false) - sidebar.find('.cometchat_userstabtitle').outerHeight(true) - sidebar.find('#cometchat_tabcontainer').outerHeight(true) - sidebar.find('#cometchat_searchbar').outerHeight(true))+"px";
                    var optionsbuttonpopup = jqcc('#cometchat_optionsbutton_popup');
                    var optionsbuttonpopheight = (optionsbuttonpopup.outerHeight(false) - optionsbuttonpopup.find('.cometchat_userstabtitle').outerHeight(true))+"px";
                    if(jqcc().slimScroll){
                        /*$('#cometchat_userscontent').slimScroll({height: usertabpopheight});*/
                        /*$('#cometchat_optionscontent').slimScroll();*/
                    }

                },300);

                jqcc('#cometchat_userstab').click(function(e){
                    jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                    jqcc.cometchat.setSessionVariable('chats', 1);
                });

                jqcc('#cometchat_optionsimages_ccauth').click(function(e){
                    jqcc('#cometchat_auth_popup').css('display','block');
                });

                jqcc('#cometchat_minimize_auth_popup').click(function(e){
                    jqcc('#cometchat_auth_popup').css('display','none');
                });

                $('#cometchat_hidden').mouseover(function(){
                    if(tooltipPriority==0){
                        if(settings.ccauth.enabled=="0"){
                         jqcc[settings.theme].tooltip('cometchat_hidden', language[8], 0);
                     }
                 }
                 $(this).addClass("cometchat_tabmouseover");
             });
                $('#cometchat_hidden').mouseout(function(){
                    $(this).removeClass("cometchat_tabmouseover");
                    if(tooltipPriority==0){
                        $("#cometchat_tooltip").css('display', 'none');
                    }
                    $(this).addClass("cometchat_tabmouseout");
                });

                jqcc('#cometchat_moreicon').click(function(e){
                    jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    jqcc('#cometchat').find('#cometchat_optionsbutton_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                    var optionsbuttonpopup = jqcc('#cometchat_optionsbutton_popup');
                    var optionsbuttonpopheight = (optionsbuttonpopup.outerHeight(false)-optionsbuttonpopup.find('.cometchat_userstabtitle').outerHeight(true))+"px";

                    if(mobileDevice){
                        $('#cometchat_optionscontent').css({'height': optionsbuttonpopheight,'overflow-y':'auto'});
                    }else if(jqcc().slimScroll){
                        $('#cometchat_optionscontent').css({'height': optionsbuttonpopheight});
                        $('#cometchat_optionscontent').slimScroll({height: optionsbuttonpopheight});
                    }
                });

                jqcc('#cometchat_newchat').click(function(e){
                    var broadcastoption = '';
                    if(!jqcc('#cometchat_newcompose_option').length){
                        if(hasBroadcastMessage) {
                            broadcastoption = '<div class="cometchat_outer_option_box"><div id="cometchat_newBroadcast" class="cometchat_option_list list_up">'+language[113]+'</div></div>';
                        }
                        var newcompose = '<div id="cometchat_newcompose_option" class="cometchat_newcompose_option floatactive"><div class="cometchat_arrow_mark"></div><div class="cometchat_outer_option_box"><div id="cometchat_createGroup" class="cometchat_option_list list_up">'+language['new_group']+'</div></div>'+broadcastoption+'</div>';
                        jqcc('#cometchat_userstab_popup .cometchat_tabcontent').append(newcompose);

                        jqcc('#cometchat_newBroadcast').click(function(e){
                            jqcc[settings.theme].composenewBroadcast();
                        });
                        jqcc('#cometchat_createGroup').click(function(e){
                            jqcc('#cometchat_tabcontainer').find('.cometchat_tab').css("border-bottom","2px solid <?php echo setColorValue1('primary_color','#439FE0'); ?>");
                            jqcc.crdocked.createChatroomPopup();
                        });
                    } else {
                        jqcc('#cometchat_newcompose_option').remove();
                        jqcc('#cometchat_tabcontainer').find('.cometchat_tab').css("border-bottom","2px solid <?php echo setColorValue1('primary_color','#439FE0'); ?>");
                    }
                });

                jqcc('#cometchat_alertsicon').click(function(e){
                    jqcc[settings.theme].showAnnouncements();
                });

                jqcc('#cometchat_blockedusersoptions').click(function(e){
                    jqcc[settings.theme].manageBlockedUsers();
                });

                jqcc('#cometchat_minimize_optionsbuttonpopup').click(function(e){
                    jqcc('#cometchat').find('#cometchat_optionsbutton_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                });

                jqcc('#cometchat_minimize_userstabpopup').click(function(e){
                    if($('#cometchat_optionsimages_ccauth').length == 1){
                        $('#cometchat_auth_popup').css('display','none');
                        $('#cometchat_optionsimages_ccauth').css('display','none');
                    }
                    jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    jqcc.cometchat.setSessionVariable('chats', 0);
                });

                jqcc('#cometchat_recenttab').click(function(e){
                	jqcc[settings.theme].loadChatTab(0);
                });

                jqcc('#cometchat_groupstab').click(function(e){
                    jqcc[settings.theme].loadChatTab(2);
					$("#cometchat_search").val('');
                    $('#cometchat_userscontent').find('div.cometchat_grouplist').show();
                    $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','none');
                    $('#cometchat_nousers_found').remove();
                });

                jqcc('#cometchat_contactstab').click(function(e){
                	jqcc[settings.theme].loadChatTab(1);
					 $("#cometchat_search").val('');
                    $('#cometchat_userscontent').find('div.cometchat_userlist').show();
                    $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','none');
                    $('#cometchat_nousers_found').remove();
                });

                jqcc('#cometchat_recenttab').mouseenter(function(e){
                    //jqcc('#cometchat_tabcontainer').css({'border-left':'1px solid #439fe0'});
                });

                jqcc('#cometchat_recenttab').mouseleave(function(e){
                });

                document.onmousemove = function(){
                    var nowTime = new Date();
                    jqcc.cometchat.setThemeVariable('idleTime', Math.floor(nowTime.getTime()/1000));
                };

                $('.cometchat_statustextarea').keyup(function(){
                    $('.cometchat_statusmessagecount').show();
                    statusmessagecount = $(this).attr('maxlength')-$(this).val().length;
                    $('.cometchat_statusmessagecount').html(statusmessagecount);
                });
                $('.cometchat_statustextarea').mouseup(function(){
                    $('.cometchat_statusmessagecount').show();
                    statusmessagecount = $(this).attr('maxlength')-$(this).val().length;
                    $('.cometchat_statusmessagecount').html(statusmessagecount);
                });
                $('.cometchat_statustextarea').mousedown(function(){
                    $('.cometchat_statusmessagecount').show();
                    statusmessagecount = $(this).attr('maxlength')-$(this).val().length;
                    $('.cometchat_statusmessagecount').html(statusmessagecount);
                });
                $('.cometchat_statustextarea').blur(function() {
                    $('.cometchat_statusmessagecount').hide();
                });

                var cometchat_optionsbutton_popup = $('#cometchat_optionsbutton_popup');

                cometchat_optionsbutton_popup.find('#cometchat_selfname #cometchat_displayname').blur(function(){
                    var displayname = cometchat_optionsbutton_popup.find('#cometchat_selfname #cometchat_displayname').val();
                    if(jqcc.cometchat.getThemeVariable('displayname') != displayname) {
                        jqcc.cometchat.setGuestNameSet(displayname);
                    }
                });

                cometchat_optionsbutton_popup.find('#cometchat_statusmessageinput .cometchat_statustextarea').blur(function(){
                    var statusmessage = cometchat_optionsbutton_popup.find('#cometchat_statusmessageinput .cometchat_statustextarea').val();
                    if(jqcc.cometchat.getThemeVariable('statusmessage') != statusmessage) {
                        jqcc.cometchat.statusSendMessageSet(statusmessage);
                    }
                });

                cometchat_optionsbutton_popup.find('.cometchat_statusradio').on("change", function(e){
                    var status = $(this).find('input').attr('value');
                    jqcc.cometchat.sendStatus(status);
                });

                var cometchat_search = $("#cometchat_search");
                var cometchat_userscontent = $('#cometchat_userscontent');
                cometchat_search.blur(function(){
                   var searchString = $(this).val();
                    if(searchString==''){
                        cometchat_search.val(language[18]).addClass('cometchat_search_light');
                        $('#cometchat_nousers_found').remove();
                    }
                });

                cometchat_search.click(function(){
                    $(this).val('');
                    cometchat_search.addClass('cometchat_search_light');
                    if($('#cometchat_userstab_popup').find('#cometchat_contactstab').hasClass('cometchat_tab_clicked')){
                        cometchat_userscontent.find('div.cometchat_userlist').css('display','block');
                    } else {
                        cometchat_userscontent.find('div.cometchat_grouplist').css('display','block');
                    }
                    $('#cometchat_nousers_found').remove();
                    $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','none');
                });
                cometchat_search.keyup(function(event){
                    event.stopImmediatePropagation();
                    if(event.keyCode==27) {
                        $(this).val('').blur();
                    }
                    var searchString = $(this).val();
                    if($('#cometchat_userstab_popup').find('#cometchat_contactstab').hasClass('cometchat_tab_clicked')){
                        if(searchString.length>0&&searchString!=language[18]){
                            $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','block');
                            cometchat_userscontent.find("div.cometchat_userlist").hide();
                            cometchat_userscontent.find('.cometchat_subsubtitle').hide();
                            var searchResult = cometchat_userscontent.find('div.cometchat_userscontentname:icontains('+searchString+')').parentsUntil("cometchat_userlist").show();
                            var matchLength = searchResult.length;
                            if(matchLength == 0){
                                if($('#cometchat_nousers_found').length == 0) {
                                    $('#cometchat_contactslist').prepend('<div id="cometchat_nousers_found"><div class="chatmessage"><div class="search_nouser">'+language[58]+'</div></div></div></div>');
                                }
                            } else {
                                $('#cometchat_nousers_found').remove();
                            }
                            cometchat_search.removeClass('cometchat_search_light');
                        }else{
                            cometchat_userscontent.find('div.cometchat_userlist').show();
                            $('#cometchat_nousers_found').remove();
                            $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','none');
                        }
                    } else if($('#cometchat_userstab_popup').find('#cometchat_groupstab').hasClass('cometchat_tab_clicked')){
                        if(searchString.length>0&&searchString!=language[18]){
                            $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','block');
                            cometchat_userscontent.find("div.cometchat_grouplist").hide();
                            cometchat_userscontent.find('.cometchat_subsubtitle').hide();
                            var searchResult = cometchat_userscontent.find('div.cometchat_groupscontentname:icontains('+searchString+')').parentsUntil("cometchat_grouplist").show();
                            var matchLength = searchResult.length;
                            if(matchLength == 0){
                                if($('#cometchat_nousers_found').length == 0) {
                                    $('#cometchat_groupslist').prepend('<div id="cometchat_nousers_found"><div class="chatmessage"><div class="search_nouser">'+language[114]+'</div></div></div></div>');
                                }
                            } else {
                                $('#cometchat_nousers_found').remove();
                            }
                            cometchat_search.removeClass('cometchat_search_light');
                        }else{
                            cometchat_userscontent.find('div.cometchat_grouplist').show();
                            $('#cometchat_nousers_found').remove();
                            $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').css('display','none');
                        }
                    }
                });

                $("#cometchat_soundnotifications").click(function(event){
                    var notification = 'false';
                    if($("#cometchat_soundnotifications").is(":checked")){
                        $('#cometchat_soundnotifications_label').find('.cometchat_checkindicator').css('display','block');
                        notification = 'true';
                    }else{
                         $('#cometchat_soundnotifications_label').find('.cometchat_checkindicator').css('display','none');
                    }
                    $.cookie(settings.cookiePrefix+"sound", notification, {path: '/', expires: 365});
                });
                $("#cometchat_popupnotifications").click(function(event){
                    var notification = 'false';
                    if($("#cometchat_popupnotifications").is(":checked")){
                        $('#cometchat_popupnotifications_label').find('.cometchat_checkindicator').css('display','block');
                        notification = 'true';
                    }else{
                        $('#cometchat_popupnotifications_label').find('.cometchat_checkindicator').css('display','none');
                    }
                    $.cookie(settings.cookiePrefix+"popup", notification, {path: '/', expires: 365});
                });

                $('#cometchat_userstab_popup').find('.cometchat_closeboxsearch').click(function(e){
                    e.stopImmediatePropagation();
                    $('#cometchat_userstab_popup').find('#cometchat_search').val('');
                    cometchat_search.keyup();
                });
            },
            tooltip: function(id,message, orientation){
                var cometchat_tooltip = $('#cometchat_tooltip');
                cometchat_tooltip.css('display', 'none').removeClass("cometchat_tooltip_left").css('left', '-100000px').find(".cometchat_tooltip_content").html(message);
                var pos = $('#'+id).offset();
                var width = $('#'+id).width();
                var tooltipWidth = cometchat_tooltip.width();
                var displayheight = $(window).outerHeight();
                var cometchat_totalheight='';
                var popup_top='';
                var leftposition='';
                var cometchat_tooltip_height = $(cometchat_tooltip).outerHeight();
                var cometchat_userstab_height = '';
                var cometchat_userstab_width='';
                if(orientation==1){
                    cometchat_tooltip.css('left', (pos.left+width)-9).addClass("cometchat_tooltip_left");
                }else{
                    var leftposition = (pos.left+width)-tooltipWidth;
                    leftposition += 16;
                    cometchat_tooltip.removeClass("cometchat_tooltip_left").css('left', leftposition);
                    if($('#cometchat_userstab_popup').hasClass('cometchat_tabhidden')){
                        cometchat_userstab_height = $('#cometchat_userstab').outerHeight();
                        cometchat_userstab_width = $('#cometchat_userstab').width();
                        leftposition += 5;
                        cometchat_totalheight = cometchat_tooltip_height+cometchat_userstab_height;
                        popup_top = displayheight-cometchat_totalheight;
                        leftposition = (pos.left+cometchat_userstab_width)-tooltipWidth-10;
                        $(cometchat_tooltip).css('top', popup_top);
                        cometchat_tooltip.addClass("cometchat_tooltip_left").css('left',leftposition);
                    }else if($('#cometchat_userstab_popup').hasClass('cometchat_tabopen')){
                        cometchat_userstab_height = $('#cometchat_userstab_popup').outerHeight();
                        cometchat_userstab_width = $('#cometchat_userstab_popup').width();
                        leftposition += 5;
                        cometchat_totalheight = cometchat_tooltip_height+cometchat_userstab_height;
                        popup_top= displayheight-cometchat_totalheight;
                        leftposition = (pos.left+cometchat_userstab_width)-tooltipWidth-10;
                        $(cometchat_tooltip).css('top', popup_top);
                        cometchat_tooltip.addClass("cometchat_tooltip_left").css('left',leftposition);
                    }else{
                        var logoutbox_height = $('#'+id).outerHeight();
                        var logout_notification = pos.top+logoutbox_height-57;
                        cometchat_tooltip.css('top', logout_notification);
                        cometchat_tooltip.addClass("cometchat_tooltip_left").css('left',leftposition-12);
                    }
                cometchat_tooltip.css('display', 'block');
                }
            },
            userStatus: function(item){
                var cometchat_optionsbutton_popup = $('#cometchat_optionsbutton_popup');
                var count = 140-item.m.length;

                cometchat_optionsbutton_popup.find('#cometchat_selfname #cometchat_displayname').text(item.n);
                cometchat_optionsbutton_popup.find('textarea.cometchat_statustextarea').val(item.m);
                cometchat_optionsbutton_popup.find('.cometchat_statusmessagecount').html(count);
                cometchat_optionsbutton_popup.find('#cometchat_status'+item.s+'_radio').click();

                jqcc.cometchat.setThemeVariable('displayname', item.n);
                jqcc.cometchat.setThemeVariable('statusmessage', item.m);

                if(item.s=='offline'){
                    cometchat_optionsbutton_popup.find('#cometchat_statusinvisible_radio').click();
                    jqcc[settings.theme].goOffline(1);
                }

                if(item.s != 'away'){
                    jqcc.cometchat.setThemeVariable('currentStatus', item.s);
                    jqcc.cometchat.setThemeVariable('idleFlag', 0);
                }
                if(item.s == 'away') {
                    jqcc.cometchat.setThemeVariable('idleFlag', 1);
                }
                if(item.lstn==1){
                    lastseenflag = true;
                }

                if(item.id>10000000){
                    cometchat_optionsbutton_popup.find('#cometchat_displayname').attr("readonly", false);
                    cometchat_optionsbutton_popup.find('#cometchat_displayname').addClass("cometchat_guestname");
                    cometchat_optionsbutton_popup.find('.cometchat_guestname').val(item.n.replace("<?php echo $guestnamePrefix;?>-", ""));
                }
                /*if(typeof item.b != 'undefined' && item.b == '1') {
                    jqcc[settings.theme].loggedOut();
                    jqcc.cometchat.setThemeVariable('banned', '1');
                    jqcc("#loggedout").attr("title",bannedMessage);
                }*/
                jqcc.cometchat.setThemeVariable('userid', item.id);
                jqcc.cometchat.setThemeArray('buddylistStatus', item.id, item.s);
                jqcc.cometchat.setThemeArray('buddylistMessage', item.id, item.m);
                jqcc.cometchat.setThemeArray('buddylistName', item.id, item.n);
                jqcc.cometchat.setThemeArray('buddylistAvatar', item.id, item.a);
                jqcc.cometchat.setThemeArray('buddylistLink', item.id, item.l);
                jqcc.cometchat.setThemeArray('buddylistChannelHash', item.id, item.ch);
                jqcc.cometchat.setThemeArray('buddylistLastseen', item.id, item.ls);
                jqcc.cometchat.setThemeArray('buddylistLastseensetting', item.id, item.lstn);
                jqcc('#cometchat_hidden').hide();
            },
            goOffline: function(silent){
                jqcc.cometchat.setThemeVariable('offline', 1);

                if(silent!=1){
                    jqcc.cometchat.sendStatus('offline');
                }
                $('#cometchat_userstab').removeClass('cometchat_userstabclick cometchat_tabclick');
                $('div.cometchat_tabopen').removeClass('cometchat_tabopen');
                $('span.cometchat_tabclick').removeClass('cometchat_tabclick');
                jqcc.cometchat.setSessionVariable('chats', 0);
                $('#cometchat_userstab_text').html(language[17]);
                for(var chatbox in jqcc.cometchat.getThemeVariable('chatBoxesOrder')){
                    if(jqcc.cometchat.getThemeVariable('chatBoxesOrder').hasOwnProperty(chatbox)){
                        if(jqcc.cometchat.getThemeVariable('chatBoxesOrder')[chatbox]!==null){
                            $("#cometchat_user_"+chatbox).find(".cometchat_closebox_bottom").click();
                        }
                    }
                }
                $('.cometchat_container').remove();
                if(typeof window.cometuncall_function=='function'){
                    cometuncall_function(jqcc.cometchat.getThemeVariable('cometid'));
                }
            },
            composenewBroadcast:function(){
                var ncbframe = '<div><iframe id="cometchat_trayicon_newchat_iframe" src="'+baseUrl+'modules/broadcastmessage/index.php?cc_theme=docked" height="316" width="100%" style="border:0px;"></div>';
                var newchatpopup = '<div id="cometchat_newchat_popup" class="cometchat_tabpopup cometchat_tabhidden"><div class="cometchat_userstabtitle"><div class="cometchat_userstabtitletext" style="width: 80%;text-align: center;">'+language[117]+'</div><div class="cometchat_closebox cometchat_tooltip" id="cometchat_minimize_newchatpopup" title="'+language[27]+'"></div></div><div id="cometchat_newchat_content" class="cometchat_tabcontent cometchat_optionstyle" style="overflow:hidden;">'+ncbframe+'</div></div>';

                jqcc('#cometchat_sidebar').append(newchatpopup);
                jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                jqcc('#cometchat_newcompose_option').remove();
                jqcc('#cometchat_tabcontainer').find('.cometchat_tab').css("border-bottom","2px solid <?php echo setColorValue1('primary_color','#439FE0'); ?>");
                jqcc('#cometchat').find('#cometchat_newchat_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');

                jqcc('#cometchat_minimize_newchatpopup').click(function(e){
                    jqcc('#cometchat').find('#cometchat_newchat_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                    jqcc('#cometchat').find('#cometchat_newchat_popup').remove();

                });
            },
            newAnnouncement: function(item){
                if($.cookie(settings.cookiePrefix+"popup")&&$.cookie(settings.cookiePrefix+"popup")=='true'){
                    tooltipPriority = 100;
                    message = '<div class="cometchat_announcement">'+item.m+'</div>';
                    if(item.o){
                        var notifications = (item.o-1);
                        if(notifications>0){
                            message += '<div class="cometchat_notification"><div class="cometchat_notification_message cometchat_notification_message_and">'+language[36]+notifications+language[37]+'</div><div style="clear:both" /></div>';
                        }
                    }else{
                        $.cookie(settings.cookiePrefix+"an", item.id, {path: '/', expires: 365});
                    }
                    jqcc[settings.theme].tooltip("cometchat_userstab", message, 0);
                    clearTimeout(notificationTimer);
                    notificationTimer = setTimeout(function(){
                        $('#cometchat_tooltip').css('display', 'none');
                        tooltipPriority = 0;
                    }, settings.announcementTime);
                }
            },
            showAnnouncements: function(){
                var anframe = '<div><iframe id="cometchat_trayicon_announcements_iframe" src="'+baseUrl+'modules/announcements/index.php?cc_theme=docked" height="316" width="100%" style="border:0px;"></div>';
                var announcementspopup = '<div id="cometchat_announcements_popup" class="cometchat_tabpopup cometchat_tabhidden"><div class="cometchat_userstabtitle"><div class="cometchat_userstabtitletext" style="width: 80%;text-align: center;">Announcements</div><div class="cometchat_closebox cometchat_tooltip" id="cometchat_minimize_announcementspopup" title="'+language[74]+'"></div></div><div id="cometchat_announcements_content" class="cometchat_tabcontent cometchat_optionstyle" style="overflow:hidden;">'+anframe+'</div></div>';

                jqcc('#cometchat_sidebar').append(announcementspopup);
                jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                jqcc('#cometchat').find('#cometchat_announcements_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');

                jqcc('#cometchat_minimize_announcementspopup').click(function(e){
                    jqcc('#cometchat').find('#cometchat_announcements_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    jqcc('#cometchat').find('#cometchat_userstab_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                    jqcc('#cometchat').find('#cometchat_announcements_popup').remove();
                });
            },
            manageBlockedUsers: function(){
                var blockeduserframe = '<div><iframe id="cometchat_blockedusers_iframe" src="'+baseUrl+'plugins/block/index.php?basedata='+basedata+'&cc_theme=docked" height="316" width="100%" style="border:0px;"></div>';
                var blockeduserspopup = '<div id="cometchat_blockedusers_popup" class="cometchat_tabpopup cometchat_tabhidden"><div class="cometchat_userstabtitle"><div class="cometchat_userstabtitletext" style="width: 80%;text-align: center;">Manage Blocked Users</div><div class="cometchat_closebox cometchat_tooltip" id="cometchat_minimize_blockeduserspopup" title="'+language[74]+'"></div></div><div id="cometchat_blockedusers_content" class="cometchat_tabcontent cometchat_optionstyle" style="overflow:hidden;">'+blockeduserframe+'</div></div>';

                jqcc('#cometchat_sidebar').append(blockeduserspopup);
                jqcc('#cometchat').find('#cometchat_optionsbutton_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                jqcc('#cometchat').find('#cometchat_blockedusers_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');

                jqcc('#cometchat_minimize_blockeduserspopup').click(function(e){
                    jqcc('#cometchat').find('#cometchat_blockedusers_popup').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    jqcc('#cometchat').find('#cometchat_optionsbutton_popup').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                    jqcc('#cometchat').find('#cometchat_blockedusers_popup').remove();
                });
            },
            loadChatTab: function(type){
                if (type > 2 || type < 0 || typeof(type)!="number" || typeof(type)=="undefined" || isNaN(type)) {
                    type = 1;
                }
                var tabs = ['recent','contacts','groups'];
                jqcc('#cometchat_tabcontainer .cometchat_tab').removeClass('cometchat_tab_clicked');
                jqcc('#cometchat_userscontent .cometchat_tabopen').removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                jqcc('#cometchat_'+tabs[type]+'tab').addClass('cometchat_tab_clicked');
                jqcc('#cometchat_'+tabs[type]+'list').removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                jqcc.cometchat.setSessionVariable('openedtab',type);
            },
            buddyList: function(item){
                var onlineNumber = 0;
                var totalFriendsNumber = 0;
                var lastGroup = '';
                var groupNumber = 0;
                var tooltipMessage = '';
                var buddylisttemp = '';
                var buddylisttempavatar = '';
                var unreadmessagecount;
                var msgcountercss;
                $.each(item, function(i, buddy){
                    if(buddy.n == null || buddy.n == 'null' || buddy.n == '' || jqcc.cometchat.getThemeVariable('banned', '1')) {
                        return;
                    }
                    longname = buddy.n;
                    /*if(lastseenflag){
                        jqcc[settings.theme].hideLastseen(buddy.id);
                    } else if(!lastseenflag){
                        if((buddy.s == 'available')||(buddy.s == 'offline' && buddy.lstn == 1)){
                            jqcc[settings.theme].hideLastseen(buddy.id);
                        }
                        else if(buddy.s == 'offline' && buddy.lstn == 0){
                            jqcc[settings.theme].showLastseen(buddy.id, buddy.ls);
                        }
                    }*/
                    if(buddy.s!='offline'){
                        onlineNumber++;
                    }
                    totalFriendsNumber++;
                    var group = '';
                    var statusIndicator = '';

                    if(buddy.s=='invisible'){
                        buddy.s = 'offline';
                    }

                    unreadmessagecount = 0;
                    msgcountercss = "display:none;";
                    if(typeof(jqcc.cometchat.getThemeArray('buddylistUnreadMessageCount', buddy.id)) != "undefined" && jqcc.cometchat.getThemeArray('buddylistUnreadMessageCount', buddy.id) != '') {
                        unreadmessagecount = jqcc.cometchat.getThemeArray('buddylistUnreadMessageCount', buddy.id);
                        msgcountercss = "";
                    }
                    statusIndicator = '<div><div class="cometchat_userscontentdot cometchat_user_'+buddy.s+'"></div><div class="cometchat_buddylist_status" title="'+buddy.m+'">'+buddy.m+'</div></div>';

                    if((buddy.s != 'offline' && settings.hideOffline == 1) || settings.hideOffline == 0){
                        buddylisttemp += group+'<div id="cometchat_userlist_'+buddy.id+'" class="cometchat_userlist" onmouseover="jqcc(this).addClass(\'cometchat_userlist_hover\');" onmouseout="jqcc(this).removeClass(\'cometchat_userlist_hover\');" amount="'+unreadmessagecount+'"><div style="display:inline-block;"><div class="cometchat_userscontentname">'+longname+'</div><div id="cometchat_buddylist_typing_'+buddy.id+'" class="cometchat_buddylist_typing"></div></div>'+statusIndicator+'<div class="cometchat_unreadCount cometchat_floatR" style="'+msgcountercss+'">'+unreadmessagecount+'</div></div>';
                        buddylisttempavatar += group+'<div id="cometchat_userlist_'+buddy.id+'" class="cometchat_userlist" onmouseover="jqcc(this).addClass(\'cometchat_userlist_hover\');" onmouseout="jqcc(this).removeClass(\'cometchat_userlist_hover\');" amount="'+unreadmessagecount+'"><div class="cometchat_userscontentavatar"><img class="cometchat_userscontentavatarimage" original="'+buddy.a+'"></div><div style="display:inline-block;"><div class="cometchat_userscontentname">'+longname+'</div><div id="cometchat_buddylist_typing_'+buddy.id+'" class="cometchat_buddylist_typing"></div></div>'+statusIndicator+'<div class="cometchat_unreadCount cometchat_floatR" style="'+msgcountercss+'">'+unreadmessagecount+'</div></div>';
                    }

                    var message = '';
                    if(settings.displayOnlineNotification==1&&jqcc.cometchat.getExternalVariable('initialize')!=1&&jqcc.cometchat.getThemeArray('buddylistStatus', buddy.id)!=buddy.s&&buddy.s=='available'){
                        message = language[19];
                    }
                    if(settings.displayBusyNotification==1&&jqcc.cometchat.getExternalVariable('initialize')!=1&&jqcc.cometchat.getThemeArray('buddylistStatus', buddy.id)!=buddy.s&&buddy.s=='busy'){
                        message = language[21];
                    }
                    if(settings.displayOfflineNotification==1&&jqcc.cometchat.getExternalVariable('initialize')!=1&&jqcc.cometchat.getThemeArray('buddylistStatus', buddy.id)!='offline'&&buddy.s=='offline'){
                        message = language[20];
                    }
                    if(message!=''){
                        tooltipMessage += '<div class="cometchat_notification" onclick="javascript:jqcc.cometchat.chatWith(\''+buddy.id+'\')"><div class="cometchat_notification_avatar"><img class="cometchat_notification_avatar_image" src="'+buddy.a+'"></div><div class="cometchat_notification_message"><div class="cometchat_notification_uname">'+buddy.n+'&nbsp;</div>'+message+'<br/><span class="cometchat_notification_status">'+buddy.m+'</span></div><div style="clear:both" /></div>';
                    }

                    jqcc.cometchat.setThemeArray('buddylistStatus', buddy.id, buddy.s);
                    jqcc.cometchat.setThemeArray('buddylistMessage', buddy.id, buddy.m);
                    jqcc.cometchat.setThemeArray('buddylistName', buddy.id, buddy.n);
                    jqcc.cometchat.setThemeArray('buddylistAvatar', buddy.id, buddy.a);
                    jqcc.cometchat.setThemeArray('buddylistLink', buddy.id, buddy.l);
                    jqcc.cometchat.setThemeArray('buddylistIsDevice', buddy.id, buddy.d);
                    jqcc.cometchat.setThemeArray('buddylistChannelHash', buddy.id, buddy.ch);
                    jqcc.cometchat.setThemeArray('buddylistLastseen', buddy.id, buddy.ls);
                    jqcc.cometchat.setThemeArray('buddylistLastseensetting', buddy.id, buddy.lstn);
                });

                var bltemp = buddylisttempavatar;
                if(totalFriendsNumber>settings.thumbnailDisplayNumber){
                    bltemp = buddylisttemp;
                }
                if(document.getElementById('cometchat_contactslist')){
                    if(bltemp!=''){
                        jqcc.cometchat.replaceHtml('cometchat_contactslist', '<div>'+bltemp+'</div>');
                    }else{
                        $('#cometchat_contactslist').html('<div class="cometchat_nofriends">'+language[14]+'</div>');
                    }
                }

                $("div.cometchat_userscontentavatar").find("img").each(function(){
                    if($(this).attr('original')){
                        $(this).attr("src", $(this).attr('original'));
                        $(this).removeAttr('original');
                    }
                });

                if(totalFriendsNumber>settings.searchDisplayNumber) {
                    $('#cometchat_searchbar').show();
                    jqcc.cometchat.setThemeVariable('hasSearchbox', 1);
                } else {
                    $('#cometchat_searchbar').hide();
                }

                /*Slim Scroll issue is here*/
                var userstabpopup = jqcc('#cometchat_userstab_popup');
                //var chatlistheight = (userstabpopup.outerHeight(false)-userstabpopup.find('.cometchat_userstabtitle').outerHeight(true)-userstabpopup.find('#cometchat_tabcontainer').outerHeight(true)-userstabpopup.find('#cometchat_searchbar').outerHeight(true))+"px";
                if(jqcc.cometchat.getThemeVariable('hasSearchbox')){
                    var chatlistheight = ($( ".right_footer" ).length == 1) ? "240px" : "259px";
                } else {
                    var chatlistheight = ($( ".right_footer" ).length == 1) ? "270px" : "286px";
                }

                if(mobileDevice){
                    userstabpopup.find('div#cometchat_userscontent').css('height',chatlistheight);
                    userstabpopup.find('#cometchat_userscontent #cometchat_contactslist > div').css({'height': chatlistheight});
                    userstabpopup.find('#cometchat_userscontent #cometchat_contactslist > div').css('overflow-y','auto');
                }else if(jqcc().slimScroll){
                    userstabpopup.find('div#cometchat_userscontent').css('height',chatlistheight);
                    userstabpopup.find('#cometchat_userscontent #cometchat_contactslist > div').css({'height': chatlistheight});
                    userstabpopup.find('#cometchat_userscontent #cometchat_contactslist > div').slimScroll({height: chatlistheight});
                }


                /*End*/

                $("#cometchat_search").keyup();
                $('div.cometchat_userlist').unbind('click');
                $('div.cometchat_userlist').live('click', function(e){
                    jqcc.cometchat.userClick(e.target);
                });
                siteOnlineNumber = onlineNumber;
                if(tooltipMessage!=''&& (!$('#cometchat_userstab_popup').hasClass('cometchat_tabopen') || $('#cometchat_userstab_popup').hasClass('cometchat_tabopen'))){
                    if(tooltipPriority<10){
                        if($.cookie(settings.cookiePrefix+"popup")&&$.cookie(settings.cookiePrefix+"popup")=='true'){
                            tooltipPriority = 108;
                            jqcc.docked.tooltip("cometchat_userstab", tooltipMessage, 0);
                            clearTimeout(notificationTimer);
                            notificationTimer = setTimeout(function(){
                                $('#cometchat_tooltip').css('display', 'none');
                                tooltipPriority = 0;
                            }, settings.notificationTime);
                        }
                    }
                }
            },
            chatWith: function(id){
                if(jqcc.cometchat.getThemeVariable('loggedout')==0 && jqcc.cometchat.getUserID() != id){
                    if(jqcc.cometchat.getThemeVariable('offline')==1){
                        jqcc.cometchat.setThemeVariable('offline', 0);
                        $('#cometchat_userstab_text').html(language[9]+' ('+jqcc.cometchat.getThemeVariable('lastOnlineNumber')+')');
                        jqcc.cometchat.chatHeartbeat(1);
                        $("#cometchat_optionsbutton_popup").find("span.available").click();
                    }
                    jqcc[settings.theme].createChatbox(id, jqcc.cometchat.getThemeArray('buddylistName', id), jqcc.cometchat.getThemeArray('buddylistStatus', id), jqcc.cometchat.getThemeArray('buddylistMessage', id), jqcc.cometchat.getThemeArray('buddylistAvatar', id), jqcc.cometchat.getThemeArray('buddylistLink', id), jqcc.cometchat.getThemeArray('buddylistIsDevice', id));
                }
            },
            userClick: function(listing){
                var id = $(listing).attr('id');
                if(typeof id==="undefined"||$(listing).attr('id')==''){
                    id = $(listing).parents('div.cometchat_userlist').attr('id');
                }
                id = id.substr(19);
                if(typeof (jqcc[settings.theme].createChatbox)!=='undefined'){
                    jqcc[settings.theme].createChatbox(id, jqcc.cometchat.getThemeArray('buddylistName', id), jqcc.cometchat.getThemeArray('buddylistStatus', id), jqcc.cometchat.getThemeArray('buddylistMessage', id), jqcc.cometchat.getThemeArray('buddylistAvatar', id), jqcc.cometchat.getThemeArray('buddylistLink', id), jqcc.cometchat.getThemeArray('buddylistIsDevice', id));
                }
            },
            createChatbox: function(id, name, status, message, avatar, link, isdevice, silent, tryOldMessages){
                if(id==null||id==''){
                    return;
                }
                if(jqcc.cometchat.getThemeArray('buddylistName', id)==null||jqcc.cometchat.getThemeArray('buddylistName', id)==''){
                    jqcc.cometchat.createChatboxSet(id, name, status, message, avatar, link, isdevice, silent, tryOldMessages);
                }else{
                    if(typeof (jqcc[settings.theme].createChatboxData)!=='undefined'){
                        jqcc[settings.theme].createChatboxData(id, jqcc.cometchat.getThemeArray('buddylistName', id), jqcc.cometchat.getThemeArray('buddylistStatus', id), jqcc.cometchat.getThemeArray('buddylistMessage', id), jqcc.cometchat.getThemeArray('buddylistAvatar', id), jqcc.cometchat.getThemeArray('buddylistLink', id), jqcc.cometchat.getThemeArray('buddylistIsDevice', id), silent, tryOldMessages);
                    }
                }
            },
            createChatboxData: function(id, name, status, message, avatar, link, isdevice, silent, tryOldMessages){
                var cometchat_chatboxes = $("#cometchat_chatboxes");
                if(chatboxOpened[id]!=null){
                    if(!$("#cometchat_user_"+id).hasClass('cometchat_tabclick')&&silent!=1){
                        if(visibleTab.indexOf(id.toString()) == -1) {
                            jqcc[settings.theme].swapTab(id);
                        } else {
                            /*$("#cometchat_user_"+id).click();*/
                        }
                    }
                    if($("#cometchat_user_"+id+"_popup").hasClass('cometchat_tabhidden')){
                        $("#cometchat_user_"+id).click();
                    }
                    jqcc[settings.theme].scrollBars();
                    return;
                }

                var widthavailable = (jqcc(window).width() - jqcc('#cometchat_chatboxes').outerWidth() - 240);

                if(widthavailable < (chatboxWidth+chatboxDistance)){
                    var closingchatbox = $('#cometchat_chatboxes').find('span.cometchat_tabopen_bottom:last-child').attr('userid');

                    if(typeof closingchatbox != "undefined"){
                        jqcc.docked.closeChatbox(closingchatbox);
                    } else {
                        closingchatbox = $('#cometchat_chatboxes').find('span.cometchat_tabopen_bottom:last-child').attr('groupid');
                        jqcc.crdocked.closeChatroom(closingchatbox);
                    }
                }

                var isMobile = '';
                /*if(isdevice == 1) {
                     isMobile = '<div class="cometchat_isMobile cometchat_isMobile_'+status+' cometchat_floatL"><div class="cometchat_mobileDot"></div></div>';
                }*/
                $('#cometchat_chatboxes_wide').width($('#cometchat_chatboxes_wide').width()+chatboxWidth+chatboxDistance);
                $('#cometchat_chatboxes').css('right',$('#cometchat_userstab').outerWidth(true)+'px');

                shortname = name;
                longname = name;
                if(jqcc('#cometchat_user_'+id).length == 0){
                    $("<span/>").attr("id", "cometchat_user_"+id).attr("amount", 0).attr("userid", id).addClass("cometchat_tab").addClass('cometchat_tabopen_bottom').css({'margin-right':chatboxDistance+'px','width':chatboxWidth+'px'}).html(isMobile+'<div class="cometchat_user_shortname">'+shortname+'</div><div class="cometchat_closebox cometchat_tooltip" title="'+language[74]+'" id="cometchat_closebox_bottom_'+id+'" style="margin-right:5px;"></div><div class="cometchat_unreadCount cometchat_floatR" style="display:none;"></div>').prependTo($("#cometchat_chatboxes_wide"));
                }

                var startlink = '';
                var endlink = '';
                var pluginstophtml = '';
                var pluginsbottomhtml='';
                var avchathtml = '';
                var audiochathtml = '';
                var smiliehtml = '';
                var pluginslength = settings.plugins.length;

                if(jqcc.cometchat.getThemeArray('isJabber', id)!=1){
                    if(link != '' || pluginslength>0){
                        pluginstophtml += '<div class="cometchat_pluginstop">';
                        if(link != ''){
                            pluginstophtml += '<div class="cometchat_plugins_dropdownlist" name="cc_viewprofile" to="'+id+'" chatroommode="0" title="'+language['view_profile']+'" ><div class="cometchat_plugins_name <?php echo $cometchat_float;?>">'+language['view_profile']+'</div></div>';
                        }
                    }
                    if(pluginslength>0){
                        pluginsbottomhtml += '<div class="cometchat_pluginsbottom">';
                        for(var i = 0; i<pluginslength; i++){
                            var name = 'cc'+settings.plugins[i];

                            if(mobileDevice && (settings.plugins[i]=='transliterate' || settings.plugins[i]=='screenshare')) {
                                continue;
                            }

                            if(typeof ($[name])=='object'){
                                 if(settings.plugins[i]=='avchat') {
                                    if(mobileDevice){
                                        pluginsbottomhtml += '<div class="cometchat_plugins_openuplist" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'" ><div class="cometchat_plugins_name <?php echo $cometchat_float;?>">'+$[name].getTitle()+'</div></div>';
                                    } else {
                                        avchathtml = '<div id="cometchat_'+settings.plugins[i]+'_'+id+'" class="cometchat_tooltip cometchat_tabicons cometchat_'+settings.plugins[i]+'" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'"></div>';
                                    }
                                } else if(settings.plugins[i]=='audiochat') {
                                    if(mobileDevice){
                                        pluginsbottomhtml += '<div class="cometchat_plugins_openuplist" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'" ><div class="cometchat_plugins_name <?php echo $cometchat_float;?>">'+$[name].getTitle()+'</div></div>';
                                    } else {
                                        audiochathtml = '<div id="cometchat_'+settings.plugins[i]+'_'+id+'" class="cometchat_tooltip cometchat_tabicons cometchat_'+settings.plugins[i]+'" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'"></div>';
                                    }
                                } else if(settings.plugins[i]=='smilies') {
                                    smiliehtml = '<div class="cometchat_'+settings.plugins[i]+'" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'"></div>';
                                } else if(settings.plugins[i]=='clearconversation' || settings.plugins[i]=='report' || settings.plugins[i]=='chathistory' || settings.plugins[i]=='block' || settings.plugins[i]=='save'){
                                    pluginstophtml += '<div class="cometchat_plugins_dropdownlist" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'" ><div class="cometchat_plugins_name <?php echo $cometchat_float;?>">'+$[name].getTitle()+'</div></div>';
                                }else{
                                    pluginsbottomhtml += '<div class="cometchat_plugins_openuplist" name="'+name+'" to="'+id+'" chatroommode="0" title="'+$[name].getTitle()+'" ><div class="cometchat_plugins_name <?php echo $cometchat_float;?>">'+$[name].getTitle()+'</div></div>';
                                }
                            }
                        }
                        pluginsbottomhtml += '</div>';
                    }
                    if(link != '' || pluginslength>0){
                        pluginstophtml += '</div>';
                    }
                }

                if(typeof(silent)=="undefined" || silent == ''){
                    silent = 1;
                }
                var tabstateclass = (silent == 2)?'tabhidden':'tabopen';
                var prepend = '';
                var jabber = jqcc.cometchat.getThemeArray('isJabber', id);
                var plugins_openup_css = '';
                var inner_container_margin = '';
                var send_message_box = '';
                if(pluginsbottomhtml=='<div class="cometchat_pluginsbottom"></div>') {
                    plugins_openup_css = 'display:none';
                    inner_container_margin = 'margin-left:0px !important';
                }

                if(jqcc.cometchat.getThemeVariable('prependLimit') != '0' && jabber != 1){
                    prepend = '<div class="cometchat_prependMessages" onclick="jqcc.docked.prependMessagesInit('+id+')" id = "cometchat_prependMessages_'+id+'" style="display:block;">'+language[83]+'</div>';
                }
                if(mobileDevice){
                    cctextarea_width = "width:140px !important";
                    send_message_box = '<div id="cometchat_sendmessagebtn"></div>';
                }else{
                    cctextarea_width = "";
                }

                $("<div/>").attr("id", "cometchat_user_"+id+"_popup").addClass('cometchat_tabpopup').addClass('cometchat_'+tabstateclass).html('<div class="cometchat_tabtitle">'+isMobile+'<span id="cometchat_typing_'+id+'" class="cometchat_typing"></span><div class="cometchat_name" title="'+longname+'">'+longname+'</div><div id="cometchat_closebox_'+id+'" title="'+language[74]+'" class="cometchat_closebox cometchat_floatR cometchat_tooltip"></div><div class="cometchat_vline"></div>'+audiochathtml+avchathtml+'<div class="cometchat_plugins_dropdown <?php echo $cometchat_float;?>"><div class="cometchat_plugins_dropdown_icon cometchat_tooltip" id="cometchat_plugins_dropdown_icon_'+id+'" title="'+language[73]+'"></div><div class="cometchat_popup_plugins">'+pluginstophtml+'</div></div></div><div class="cometchat_tabcontent"><div class="cometchat_tabcontenttext" id="cometchat_tabcontenttext_'+id+'" onscroll="jqcc.'+settings.theme+'.chatScroll(\''+id+'\');"></div><div class="cometchat_tabcontentinput"><div class="cometchat_plugins_openup cometchat_floatL" style="'+plugins_openup_css+'"><div class="cometchat_plugins_openup_icon cometchat_tooltip" id="cometchat_plugins_openup_icon_'+id+'" title="'+language[73]+'"></div><div class="cometchat_popup_convo_plugins">'+pluginsbottomhtml+'</div></div><div class="cometchat_inner_container" style="'+inner_container_margin+'"><textarea class="cometchat_textarea" style="'+cctextarea_width+'"; placeholder="'+language[85]+'"></textarea>'+send_message_box+smiliehtml+'</div></div></div>').appendTo($('#cometchat_user_'+id));

                jqcc.cometchat.updateChatBoxState({id:id,s:silent});
                if(silent == 2 && tryOldMessages > 0){
                    jqcc.docked.addPopup(id, tryOldMessages, 0);
                } else {
                    jqcc.docked.addPopup(id, 0, 0);
                }

                /*var chatboxcontentheight = $('#cometchat_chatboxes').find('.cometchat_tabcontent .cometchat_tabcontenttext').height();*/

                /*var offlinecontent = '<div class="cometchat_offline" style="height:'+chatboxcontentheight+'px;display:none;"><div class="cometchat_offlinecontent"><img class="cometchat_offlineicon" src="'+baseUrl+'themes/'+settings.theme+'/images/internetconnection.svg" /><div style="font-weight:bolder;">'+language['you_are_offline']+'</div><div class="cometchat_offlinecontent1">'+language['check_internet']+'</div></div></div>';
                $('#cometchat_chatboxes').find('.cometchat_tabcontent .cometchat_tabcontenttext').html(offlinecontent);*/


                /*if(lastseenflag){
                    jqcc[settings.theme].hideLastseen(id);
                } else if(!lastseenflag){
                    if((jqcc.cometchat.getThemeArray('buddylistStatus', id) == 'available')||(jqcc.cometchat.getThemeArray('buddylistStatus', id) == 'offline' && jqcc.cometchat.getThemeArray('buddylistLastseensetting', id) == 1)){
                        jqcc[settings.theme].hideLastseen(id);
                    }
                    else if(jqcc.cometchat.getThemeArray('buddylistStatus', id) == 'offline' && jqcc.cometchat.getThemeArray('buddylistLastseensetting', id) == 0){
                        jqcc[settings.theme].showLastseen(id, jqcc.cometchat.getThemeArray('buddylistLastseen', id));
                    }
                }*/

                var cometchat_user_popup = $("#cometchat_user_"+id+"_popup");
                var cometchat_user_popup1 = document.getElementById("cometchat_user_"+id+"_popup");

                cometchat_user_popup.find('.cometchat_tabcontenttext').click(function(){
                    if(cometchat_user_popup.find(".cometchat_tabcontent .cometchat_chatboxpopup_"+id).length){
                        closeChatboxCCPopup(id,0);
                    }
                });

                if(cometchat_user_popup.find(".cometchat_prependMessages").length == 0){
                    $('#cometchat_user_'+id+'_popup').find('#cometchat_tabcontenttext_'+id).append(prepend);
                    $('#cometchat_user_'+id+'_popup').find(".cometchat_prependMessages").css("display","block");
                }

                jqcc.cometchat.setThemeArray('chatBoxesOrder', id, 0);
                chatboxOpened[id] = 1;
                allChatboxes[id] = 0;
                var temp = [];
                jqcc.each(chatboxOpened, function(key, value) {
                    if(value == 1) {
                        temp.push(key);
                    }
                });
                jqcc.cometchat.setThemeVariable('openChatboxId', temp);
                jqcc.docked.windowResize(1);
                var cometchat_user_id = $("#cometchat_user_"+id);

                if(!cometchat_user_popup.find('cometchat_uploadfile_'+id).length) {
                    var uploadf = document.createElement("INPUT");
                    uploadf.setAttribute("type", "file");
                    uploadf.setAttribute("class", "cometchat_fileupload");
                    uploadf.setAttribute("id", 'cometchat_uploadfile_'+id);
                    uploadf.setAttribute("name", "Filedata");
                    uploadf.setAttribute("multiple", "true");
                    cometchat_user_popup.find(".cometchat_tabcontent").append(uploadf);
                    uploadf.addEventListener("change", jqcc.ccfiletransfer.FileSelectHandler(cometchat_user_popup.find('.cometchat_tabcontent'),id,0), false);
                }

                /*var xhr = new XMLHttpRequest();
                if(xhr.upload) {
                    cometchat_user_popup1.addEventListener("dragover", jqcc.ccfiletransfer.FileDragHover(), false);
                    cometchat_user_popup1.addEventListener("dragleave", jqcc.ccfiletransfer.FileDragHover(), false);
                    cometchat_user_popup1.addEventListener("drop", jqcc.ccfiletransfer.FileSelectHandler(cometchat_user_popup.find('.cometchat_tabcontent'),id,0), false);
                }*/

                cometchat_user_popup.find('.cometchat_plugins_dropdown').click(function(e){
                    e.stopImmediatePropagation();
                    if(cometchat_user_popup.find(".cometchat_tabcontent .cometchat_chatboxpopup_"+id).length){
                        closeChatboxCCPopup(id);
                    }
                    if(cometchat_user_popup.find('.cometchat_plugins_openup').hasClass('cometchat_plugins_openup_active')) {
                        cometchat_user_popup.find('.cometchat_plugins_openup').toggleClass('cometchat_plugins_openup_active').find('div.cometchat_popup_convo_plugins').slideToggle('fast');
                        if($(this).hasClass('cometchat_plugins_openup_active')){
                            cometchat_user_popup.find('#cometchat_plugins_openup_icon_'+id).addClass('cometchat_pluginsopenup_arrowrotate');
                        } else {
                            cometchat_user_popup.find('#cometchat_plugins_openup_icon_'+id).removeClass('cometchat_pluginsopenup_arrowrotate');
                        }
                    }
                    $(this).toggleClass('cometchat_plugins_dropdown_active').find('div.cometchat_popup_plugins').slideToggle('fast');

                    if($(this).hasClass('cometchat_plugins_dropdown_active')){
                        cometchat_user_popup.find('#cometchat_plugins_dropdown_icon_'+id).addClass('cometchat_pluginsdropdown_arrowrotate');
                    } else {
                        cometchat_user_popup.find('#cometchat_plugins_dropdown_icon_'+id).removeClass('cometchat_pluginsdropdown_arrowrotate');
                    }

                    if(mobileDevice){
                        cometchat_user_popup.find('.cometchat_pluginstop').css('overflow-y','auto');
                    }
                    if(jqcc().slimScroll){
	            		var cometchat_slimscroll_height = cometchat_user_popup.find('.cometchat_pluginstop').height();
	            		cometchat_user_popup.find('.cometchat_pluginstop').slimScroll({height: (cometchat_slimscroll_height)+'px'});
                        cometchat_user_popup.find('.cometchat_popup_plugins').find('.slimScrollDiv').css({'box-shadow': '0px 5px 8px -3px #D1D1D1'});

                    }
                });

                cometchat_user_popup.find('.cometchat_plugins_openup').click(function(){
                    if(cometchat_user_popup.find(".cometchat_tabcontent .cometchat_chatboxpopup_"+id).length){
                        closeChatboxCCPopup(id);
                    } else {
                        if(cometchat_user_popup.find('.cometchat_plugins_dropdown').hasClass('cometchat_plugins_dropdown_active')) {
                            cometchat_user_popup.find('.cometchat_plugins_dropdown').toggleClass('cometchat_plugins_dropdown_active').find('div.cometchat_popup_plugins').slideToggle('fast');
                            if($(this).hasClass('cometchat_plugins_dropdown_active')){
                                cometchat_user_popup.find('#cometchat_plugins_dropdown_icon_'+id).addClass('cometchat_pluginsdropdown_arrowrotate');
                            } else {
                                cometchat_user_popup.find('#cometchat_plugins_dropdown_icon_'+id).removeClass('cometchat_pluginsdropdown_arrowrotate');
                            }
                        }
                        $(this).toggleClass('cometchat_plugins_openup_active').find('div.cometchat_popup_convo_plugins').slideToggle('fast');

                        if($(this).hasClass('cometchat_plugins_openup_active')){
                            cometchat_user_popup.find('#cometchat_plugins_openup_icon_'+id).addClass('cometchat_pluginsopenup_arrowrotate');
                        } else {
                            cometchat_user_popup.find('#cometchat_plugins_openup_icon_'+id).removeClass('cometchat_pluginsopenup_arrowrotate');
                        }
                    }

                    if(mobileDevice){
                        cometchat_user_popup.find('.cometchat_pluginsbottom').css('overflow-y','auto');
                    }else if(jqcc().slimScroll){
	            		var cometchat_slimscroll_height = cometchat_user_popup.find('.cometchat_pluginsbottom').height();
	            		if(cometchat_user_popup.find('.cometchat_pluginsbottom').parent().hasClass('slimScrollDiv')){
	            			cometchat_user_popup.find('.cometchat_popup_convo_plugins').find("div.slimScrollDiv").css('height', (cometchat_slimscroll_height+1)+'px');
	            		}else{
	            			cometchat_user_popup.find('.cometchat_pluginsbottom').slimScroll({height: (cometchat_slimscroll_height+1)+'px'});
	            		}
	            		var bottompluginsbox_height =  cometchat_user_popup.find('.cometchat_tabcontent').outerHeight();
                        var cometchat_textarea_height = cometchat_user_popup.find('.cometchat_tabcontentinput').outerHeight(true);
                        var scrolltop_height = parseInt(bottompluginsbox_height - cometchat_textarea_height-cometchat_slimscroll_height);
                        cometchat_user_popup.find('.cometchat_popup_convo_plugins').find('.slimScrollDiv').css({'top':scrolltop_height,'box-shadow': '0px -4px 10px -3px #d1d1d1'});
                    }
                });

                cometchat_user_popup.find('.cometchat_plugins_openuplist, .cometchat_plugins_dropdownlist, .cometchat_smilies, .cometchat_avchat, .cometchat_audiochat').click(function(e){
                    e.stopImmediatePropagation();
                    var name = $(this).attr('name');
                    var to = $(this).attr('to');
                    var chatroommode = $(this).attr('chatroommode');
                    var controlparameters = {"to":to, "chatroommode":chatroommode};
                    if(cometchat_user_popup.find('.cometchat_plugins_openup').hasClass('cometchat_plugins_openup_active')){
                        cometchat_user_popup.find('.cometchat_plugins_openup').toggleClass('cometchat_plugins_openup_active').find('div.cometchat_popup_convo_plugins').slideToggle('fast');
                        if($(this).hasClass('cometchat_plugins_openup_active')){
                            cometchat_user_popup.find('#cometchat_plugins_openup_icon_'+id).addClass('cometchat_pluginsopenup_arrowrotate');
                        } else {
                            cometchat_user_popup.find('#cometchat_plugins_openup_icon_'+id).removeClass('cometchat_pluginsopenup_arrowrotate');
                        }
                    }
                    if(cometchat_user_popup.find('.cometchat_plugins_dropdown').hasClass('cometchat_plugins_dropdown_active')){
                        cometchat_user_popup.find('.cometchat_plugins_dropdown').toggleClass('cometchat_plugins_dropdown_active').find('div.cometchat_popup_plugins').slideToggle('fast');
                        if($(this).hasClass('cometchat_plugins_dropdown_active')){
                            cometchat_user_popup.find('#cometchat_plugins_dropdown_icon_'+id).addClass('cometchat_pluginsdropdown_arrowrotate');
                        } else {
                            cometchat_user_popup.find('#cometchat_plugins_dropdown_icon_'+id).removeClass('cometchat_pluginsdropdown_arrowrotate');
                        }
                    }
                    if(name == 'cc_viewprofile'){
                        location.href = jqcc.cometchat.getThemeArray('buddylistLink', id);
                    } else {
                        jqcc[name].init(controlparameters);
                    }
                });

                cometchat_user_id.find('.cometchat_closebox').click(function(e){
                    e.stopImmediatePropagation();
                    jqcc.docked.closeChatbox(id);
                });

                cometchat_user_popup.find('.cometchat_tabtitle').click(function(e){
                    e.stopImmediatePropagation();
                    cometchat_user_id.find(cometchat_user_popup).removeClass('cometchat_tabopen').addClass('cometchat_tabhidden');
                    chatboxOpened[id] = 0;
                    jqcc.cometchat.updateChatBoxState({id:id,s:2});
                });

                cometchat_user_id.click(function(e){
                    cometchat_user_id.find(cometchat_user_popup).removeClass('cometchat_tabhidden').addClass('cometchat_tabopen');
                    $.each($('#cometchat_user_'+id+'_popup .cometchat_chatboxmessage'),function (i,divele){
                        if($(this).find(".cometchat_ts") != ''){
                           var msg_containerHeight = $(this).find(".cometchat_ts_margin").outerHeight()-8;
                           var cometchat_ts_margin_right = $(this).find(".cometchat_ts_margin").outerWidth(true)+5;
                           jqcc(this).find('.cometchat_ts').css('margin-top',msg_containerHeight);
                           jqcc(this).find('.cometchat_ts').css('margin-right',cometchat_ts_margin_right);
                       }
                   });
                    jqcc.cometchat.setThemeArray('chatBoxesOrder', id, 0);
                    chatboxOpened[id] = 1;
                    jqcc.cometchat.updateChatBoxState({id:id,s:1,c:0});
                    jqcc.docked.addPopup(id, 0, 0);
                });

                cometchat_user_popup.find("textarea.cometchat_textarea").keydown(function(event){
                    var txtWidth = $(this).width();
                    var cs = $(this).val().length;
                    var cctabcontenttext_resize = '';
                    /*if(cs>17){
                     $(this).width(txtWidth+5);
                    }*/

                    if(typingSenderFlag != 0 ) {
                        jqcc.cometchat.typingTo({id:id,method:'typingTo'});
                        typingSenderFlag = 0;
                        clearTimeout(typingSenderTimer);
                        typingSenderTimer = setTimeout(function(){
                            typingSenderFlag = 1;
                            jqcc.cometchat.typingTo({id:id,method:'typingStop'});
                        },5000);
                    }
                    return jqcc.docked.chatboxKeydown(event, this, id);
                });

                cometchat_user_popup.find("textarea.cometchat_textarea").blur(function(event){
                    jqcc.cometchat.typingTo({id:id,method:'typingStop'});
                });

                var cometchat_textarea = $("#cometchat_user_"+id+'_popup').find("textarea.cometchat_textarea");
                cometchat_textarea.keydown(function(event){
                    return jqcc[settings.theme].chatboxKeydown(event, this, id);
                });
                cometchat_textarea.keyup(function(event){
                    jqcc.docked.resizeinputTextarea(cometchat_user_popup,this,id,event);
                    return jqcc[settings.theme].chatboxKeyup(event, this, id);
                });
                if(settings.extensions.indexOf('ads') > -1){
                    jqcc.ccads.init(id);
                }
                jqcc('#cometchat_sendmessagebtn').click(function(e){
                    var message = cometchat_textarea.val();
                    message = message.replace(/^\s+|\s+$/g, "");
                    jqcc.cometchat.sendMessage(id, message);
                    cometchat_textarea.val('');
                    cometchat_textarea.addClass('placeholder');
                    $(cometchat_textarea).attr('style', 'height: 15px !important;width:140px !important;');
                    cometchat_user_popup.find('.cometchat_inner_container').height(20);
                    if(cometchat_user_popup.find('.cometchat_tabcontent .cometchat_chatboxpopup_'+id).length == 0){
                        cometchat_user_popup.find('.cometchat_tabcontenttext').height(285);
                    }else{
                        var iframe_name = jqcc('.cometchat_iframe').attr('id');
                        var default_height = 0;
                        if (iframe_name == 'cometchat_trayicon_smilies_iframe'){
                            default_height = 108;
                        }else if(iframe_name == 'cometchat_trayicon_stickers_iframe'){
                            default_height = 102;
                        }else if(iframe_name == 'cometchat_trayicon_handwrite_iframe'){
                            default_height = 143;
                        }
                        if(default_height!=0){
                            var embed = cometchat_user_popup.find('.cometchat_iframe').contents().find('.embed');
                            if(embed.length==1) {
                                embed.height(default_height);//108 is the default height of smiley popup
                            }else{
                                cometchat_user_popup.find('.cometchat_iframe').height(default_height);////143 is the default height of sketch popup
                            }
                        }
                    }
                });
                if(olddata[id]!=1&&(jqcc.cometchat.getExternalVariable('initialize')!=1||isNaN(id))){
                    jqcc.cometchat.updateChatboxSet(id);
                    olddata[id] = 1;
                }
                attachPlaceholder("#cometchat_user_"+id+'_popup');
                jqcc.docked.updateReadMessages(id);
                jqcc.docked.rearrange();
            },
            resizeinputTextarea: function(cometchat_user_popup,chatboxtextarea,id,event){
                var forced = 1;
                var difference = $(chatboxtextarea).innerHeight() - $(chatboxtextarea).height();
                var cctabcontenttext_resize = '';
                var container_height = cometchat_user_popup.find('.cometchat_inner_container').outerHeight();
                if ($(chatboxtextarea).innerHeight < chatboxtextarea.scrollHeight ) {
                } else if(event.keyCode != 13) {
                    if($(chatboxtextarea).height() < 50 || event.keyCode == 8) {
                        if(mobileDevice){
                            $(chatboxtextarea).attr('style', 'height: 15px !important;width:140px !important;');
                        }else{
                            $(chatboxtextarea).attr('style', 'height: 15px !important;width:165px !important;');
                        }
                        cometchat_user_popup.find('.cometchat_inner_container').height(20);
                        if(chatboxtextarea.scrollHeight - difference >= 47){
                                if(mobileDevice){
                                    $(chatboxtextarea).attr('style', 'height: 50px !important;width:140px !important;');
                                    cometchat_user_popup.find('.cometchat_inner_container').height((chatboxtextarea.scrollHeight - difference) + 12);
                                    $(chatboxtextarea).css('overflow-y','auto');
                                }else{
                                    $(chatboxtextarea).slimScroll({scroll: '1'});
                                    $(chatboxtextarea).attr('style', 'height: 50px !important;width:161px !important;');
                                    cometchat_user_popup.find('.cometchat_inner_container').height((chatboxtextarea.scrollHeight - difference) + 12);
                                    cometchat_user_popup.find('.cometchat_inner_container .slimScrollDiv').css({'float':'left','width':'172px'});
                                }
                                $(chatboxtextarea).focus();
                                cometchat_user_popup.find('.cometchat_inner_container').height(56);

                        }else if(chatboxtextarea.scrollHeight - difference>20){
                            if(mobileDevice){
                                $(chatboxtextarea).attr('style', 'height: '+(chatboxtextarea.scrollHeight - difference)+'px !important;width:140px !important;');
                            }else{
                                $(chatboxtextarea).attr('style', 'height: '+(chatboxtextarea.scrollHeight - difference)+'px !important;width:165px !important;');
                            }
                            cometchat_user_popup.find('.cometchat_inner_container').height((chatboxtextarea.scrollHeight - difference) + 7);
                        }
                        var newcontainerheight = cometchat_user_popup.find('.cometchat_inner_container').outerHeight();
                        if(container_height!=(newcontainerheight)){
	                        cctabcontenttext_resize = (cometchat_user_popup.find('.cometchat_tabcontent').height() - cometchat_user_popup.find('.cometchat_inner_container').height() - 10);
	                        if(cometchat_user_popup.find('.cometchat_tabcontent .cometchat_chatboxpopup_'+id).length == 0){
		                        cometchat_user_popup.find('.cometchat_tabcontenttext').height(cctabcontenttext_resize - 1);
		                        if($('#cometchat_tabcontenttext_'+id).parent().hasClass('slimScrollDiv') == true){
                                    $('#cometchat_tabcontenttext_'+id).parent().height(cctabcontenttext_resize);
                                }
		                        jqcc[settings.theme].scrollDown(id);
		                    }else{
                                var iframe_name = jqcc('.cometchat_iframe').attr('id');
                                var default_height = 0;//default height of sketch popup of handwrite
                                if (iframe_name == 'cometchat_trayicon_smilies_iframe'){
                                    default_height = 108;
                                }else if(iframe_name == 'cometchat_trayicon_stickers_iframe'){
                                    default_height = 102;
                                }else if(iframe_name == 'cometchat_trayicon_handwrite_iframe'){
                                    default_height = 143;
                                }
                                if(default_height!=0){
                                    var new_height = (cometchat_user_popup.find('.cometchat_tabcontentinput').height()-22);
                                    var embed = cometchat_user_popup.find('.cometchat_iframe').contents().find('.embed');
                                    if(embed.length==1) {
                                        embed.height(default_height-new_height);
                                    }else{
                                        cometchat_user_popup.find('.cometchat_iframe').height(default_height-new_height);
                                    }
                                }
                            }
	                    }
                    }
                }else{
                    if(mobileDevice){
                        $(chatboxtextarea).attr('style', 'height: 15px !important;width:140px !important;');
                    }else{
                        $(chatboxtextarea).attr('style', 'height: 15px !important;width:165px !important;');
                    }
                    cometchat_user_popup.find('.cometchat_inner_container').height(20);
                    if(cometchat_user_popup.find('.cometchat_tabcontent .cometchat_chatboxpopup_'+id).length == 0){
                        cometchat_user_popup.find('.cometchat_tabcontenttext').height(285);
                        if($('#cometchat_tabcontenttext_'+id).parent().hasClass('slimScrollDiv') == true){
                            $('#cometchat_tabcontenttext_'+id).parent().height(285);
                        }
                        jqcc[settings.theme].scrollDown(id);
               		}else{
                        var iframe_name = jqcc('.cometchat_iframe').attr('id');
                        var default_height = 0;
                        if (iframe_name == 'cometchat_trayicon_smilies_iframe'){
                            default_height = 108;
                        }else if(iframe_name == 'cometchat_trayicon_stickers_iframe'){
                            default_height = 102;
                        }else if(iframe_name == 'cometchat_trayicon_handwrite_iframe'){
                            default_height = 143;
                        }
                        if(default_height!=0){
                            var embed = cometchat_user_popup.find('.cometchat_iframe').contents().find('.embed');
                            if(embed.length==1) {
                                embed.height(default_height);//108 is the default height of smiley popup
                            }else{
                                cometchat_user_popup.find('.cometchat_iframe').height(default_height);////143 is the default height of sketch popup
                            }
                        }
                    }
                }
            },
            closeChatbox: function(id){
                var cometchat_user_popup = $("#cometchat_user_"+id+"_popup");
                cometchat_user_popup.remove();
                $("#cometchat_user_"+id).remove();
                $('#cometchat_chatboxes_wide').width($('#cometchat_chatboxes_wide').width()-chatboxWidth-chatboxDistance);
                jqcc.cometchat.setThemeArray('chatBoxesOrder', id, null);
                delete(chatboxOpened[id]);
                delete(allChatboxes[id]);
                olddata[id] = 0;
                jqcc.cometchat.updateChatBoxState({id:id,s:0});
                jqcc.docked.rearrange();
            },
            updateChatboxSuccess: function(id, data){
                var name = jqcc.cometchat.getThemeArray('buddylistName', id);
                $("#cometchat_tabcontenttext_"+id).html('');
                if(jqcc.cometchat.getThemeVariable('prependLimit') != '0' && $('#cometchat_tabcontenttext_'+id).find(".cometchat_prependMessages").length == 0){
                    var prepend = '<div class=\"cometchat_prependMessages\" onclick\="jqcc.docked.prependMessagesInit('+id+')\" id = \"cometchat_prependMessages_'+id+'\">'+language[83]+'</div>';
                    $('#cometchat_tabcontenttext_'+id).append(prepend);
                    $('#cometchat_tabcontenttext_'+id).find(".cometchat_prependMessages").css('display','block');
                }
                if(typeof (jqcc[settings.theme].addMessages)!=='undefined'&&data.hasOwnProperty('messages')){
                    jqcc[settings.theme].addMessages(data['messages']);
                }
                jqcc[settings.theme].scrollDown(id);
            },
            addMessages: function(item){
                var todaysdate = new Date();
                var tdmonth  = todaysdate.getMonth();
                var tddate  = todaysdate.getDate();
                var tdyear = todaysdate.getFullYear();
                var today_date_class = tdmonth+"_"+tddate+"_"+tdyear;
                var ydaysdate = new Date((new Date()).getTime() - 3600000 * 24);
                var ydmonth  = ydaysdate.getMonth();
                var yddate  = ydaysdate.getDate();
                var ydyear = ydaysdate.getFullYear();
                var yday_date_class = ydmonth+"_"+yddate+"_"+ydyear;
                var d = '';
                var month = '';
                var date  = '';
                var year = '';
                var msg_date_class = '';
                var msg_date = '';
                var date_class = '';
                var msg_time = '';
                var msg_date_format = '';
                var jabber = '';
                var hw_ts = '';
                var cc_dir = '<?php if ($rtl == 1) { echo 1; } else { echo 0; }?>';

                $.each(item, function(i, incoming){
                    if(typeof(incoming.self) ==='undefined' && typeof(incoming.old) ==='undefined' && typeof(incoming.sent) ==='undefined'){
                        incoming.sent = Math.floor(new Date().getTime()/1000);
                        incoming.old = 0;
                        incoming.self = 1;
                    }
                    if(typeof(incoming.m)!== 'undefined'){
                        incoming.message = incoming.m;
                    }
                    var message = jqcc.cometchat.processcontrolmessage(incoming);
                    if(message == null){
                        return;
                    }
                    if(typeof(incoming.nopopup) === "undefined" || incoming.nopopup =="") {
                        incoming.nopopup = 0;
                    }
                    if(typeof(incoming.broadcast) == "undefined" || incoming.broadcast != 0){
                        if(incoming.self ==1 ){
                             incoming.nopopup = 1;
                        }
                    }

                    if(incoming.jabber == 1 && typeof(incoming.selfadded) != "undefined" && incoming.selfadded != null) {
                       msg_time = incoming.id;
                       jabber = 1;
                    }else{
                      msg_time = incoming.sent;
                      jabber = 0;
                    }
                    msg_time = msg_time+'';

                    if (msg_time.length == 10){
                        msg_time = parseInt(msg_time * 1000);
                    }
                    months_set = new Array(language['jan'],language['feb'],language['mar'],language['apr'],language['may'],language['jun'],language['jul'],language['aug'],language['sep'],language['oct'],language['nov'],language['dec']);
                    d = new Date(parseInt(msg_time));
                    month  = d.getMonth();
                    date  = d.getDate();
                    year = d.getFullYear();
                    msg_date_class = month+"_"+date+"_"+year;
                    msg_date = months_set[month]+" "+date+", "+year;
                    date_class = "";

                    var type = 'th';
                    if(date==1||date==21||date==31){
                        type = 'st';
                    }else if(date==2||date==22){
                        type = 'nd';
                    }else if(date==3||date==23){
                        type = 'rd';
                    }
                    msg_date_format = date+type+' '+months_set[month]+', '+year;
                    if(msg_date_class == today_date_class){
                        date_class = "today";
                        msg_date = language['today'];
                    }else  if(msg_date_class == yday_date_class){
                        date_class = "yesterday";
                        msg_date = language['yesterday'];
                    }
                    checkfirstmessage = ($("#cometchat_tabcontenttext_"+incoming.from+" .cometchat_chatboxmessage").length) ? 0 : 1;

                    if(jqcc.cometchat.getCcvariable().internalVars.hasOwnProperty('chatboxstates')) {
                        var cc_states = jqcc.cometchat.getCcvariable().internalVars.chatboxstates;
                        if(!cc_states.hasOwnProperty(incoming.from) || (cc_states.hasOwnProperty(incoming.from) && (cc_states[incoming.from].split('|')[1]==0||cc_states[incoming.from].split('|')[1]=='') && (cc_states[incoming.from].split('|')[2]==''))){
                            if(settings.autoPopupChatbox==1&&incoming.self==0&&incoming.old!=1){
                                jqcc('#cometchat_contactslist').find('#cometchat_userlist_'+incoming.from).click();
                            }
                        }
                    } else if(settings.autoPopupChatbox==1&&incoming.self==0&&incoming.old!=1) {
                        jqcc('#cometchat_contactslist').find('#cometchat_userlist_'+incoming.from).click();
                    }

                    var chatboxopen = 0;
                    var alreadyreceivedunreadmessages = jqcc.cometchat.getFromStorage('receivedunreadmessages');
                    if(incoming.self!=1&&incoming.old!=1 && ((typeof(alreadyreceivedunreadmessages[incoming.from])!='undefined'&& alreadyreceivedunreadmessages[incoming.from]<incoming.id) || typeof(alreadyreceivedunreadmessages[incoming.from])=='undefined')){
                        if (incoming.self != 1 && settings.messageBeep == 1) {
                            if ((typeof $.cookie(settings.cookiePrefix+"sound") == 'undefined' || $.cookie(settings.cookiePrefix+"sound") == null) || $.cookie(settings.cookiePrefix + "sound") == 'true') {
                                jqcc.docked.playSound();
                            }
                        }
                        if(chatboxOpened[incoming.from]!=1){
                            jqcc.docked.addPopup(incoming.from, 1, 1);
                            jqcc.cometchat.updateChatBoxState({id:incoming.from,c:1});
                        }
                    }
                    if(typeof(incoming.calledfromsend) === 'undefined'){
                        jqcc.docked.updateReceivedUnreadMessages(incoming.from,incoming.id);
                    }
                    jqcc.cometchat.sendReceipt(incoming);
                    var selfstyleAvatar = "";
                    var avatar = baseUrl+"themes/docked/images/noavatar.png";
                    var smileycount = (message.match(/cometchat_smiley/g) || []).length;
                    var smileymsg = message.replace(/<img[^>]*>/g,"");
                    smileymsg = smileymsg.trim();
                    var single_smiley_avatar = '';

                    if(smileycount == 1 && smileymsg == '') {
                        message = message.replace('height="20"', 'height="64px"');
                        message = message.replace('width="20"', 'width="64px"');
                        single_smiley_avatar = "margin-top:10px";
                    }

                    if(parseInt(incoming.self)==1){
                        fromname = language[10];
                    }else{
                        fromname = jqcc.cometchat.getThemeArray('buddylistName', incoming.from);
                        if(jqcc.cometchat.getThemeArray('buddylistAvatar', incoming.from)!=""){
                            avatar = jqcc.cometchat.getThemeArray('buddylistAvatar', incoming.from);
                        }
                        selfstyleAvatar = '<a class="cometchat_floatL" href="'+jqcc.cometchat.getThemeArray('buddylistLink', incoming.from)+'"><img class="ccmsg_avatar" style="'+single_smiley_avatar+'" src="'+avatar+'" title="'+fromname+'"/></a>';
                    }

                    if($("#message_"+incoming.id).length>0){
                        $('#message_'+incoming.id).html(message);
                    }else{
                        sentdata = '';
                        if(incoming.sent!=null){
                            var ts = incoming.sent;
                            sentdata = jqcc.docked.getTimeDisplay(ts);
                        }
                        var msg = '';
                        var addMessage = 0;
                        var avatar = baseUrl+"themes/docked/images/noavatar.png";
                        var add_bg = '';
                        var add_arrow_class = '';
                        var add_style = "";//for images and smileys
                        var jabber = jqcc.cometchat.getThemeArray('isJabber', incoming.from);

                        if(jqcc.cometchat.getThemeVariable('prependLimit') != '0' && jabber != 1){
                            var prepend = '<div class=\"cometchat_prependMessages\" onclick\="jqcc.docked.prependMessagesInit('+incoming.from+')\" id = \"cometchat_prependMessages_'+incoming.from+'\">'+language[83]+'</div>';
                        }
                        if(parseInt(incoming.self)==1){
                           var sentdata_box = "<span class=\"cometchat_ts\">"+sentdata+"</span>";
                           if((message.indexOf('<img')==-1 && message.indexOf('src')==-1) || (smileycount > 0 && smileymsg != '')){
                                add_bg = 'cometchat_chatboxmessagecontent cometchat_self';
                                add_arrow_class = '<div class="selfMsgArrow"><div class="after"></div></div>';
                           }else{
                                if(message.indexOf('cometchat_smiley')!=-1) {
                                    if(smileycount > 1){
                                        add_style = "margin-right:13px;max-width:135px;";
                                    }else{
                                        add_style = "margin-right:13px";
                                    }
                                }else if(message.indexOf('cometchat_hw_lang')!=-1){
                                    add_style = "margin-right:18px;margin-left:4px";
                                }else{
                                    add_style = "margin-right:4px;margin-left:4px";
                                }
                            }
                            msg = prepend+'<div class="cometchat_time cometchat_time_'+msg_date_class+' '+date_class+'" msg_format="'+msg_date_format+'">'+msg_date+'</div><div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'"><div class="'+add_bg+' '+'cometchat_ts_margin cometchat_self_msg cometchat_floatR" style="'+add_style+'"><span id="message_'+incoming.id+'">'+message+'</span></div>'+add_arrow_class+' '+sentdata_box+'</div><span id="cometchat_chatboxseen_'+incoming.id+'"></span>';

                            addMessage = 1;

                        }else{
                            if(message.indexOf('cometchat_hw_lang')!=-1){
                                  hw_ts = 'margin-left: 4px;';
                              }

                            var sentdata_box = "<span class=\"cometchat_ts_other\" style='"+hw_ts+"'>"+sentdata+"</span>";

                            if((message.indexOf('<img')==-1 && message.indexOf('src')==-1) || (smileycount > 0 && smileymsg != '')){
                                add_bg = 'cometchat_chatboxmessagecontent';
                                add_arrow_class = '<div class="msgArrow"><div class="after"></div></div>';
                            }else{
                                if(message.indexOf('cometchat_smiley')!=-1) {
                                    if(smileycount == 1 && smileymsg == ''){
                                        add_style = "margin:-4px 0px 0px 4px";
                                    }else{
                                        if(smileycount > 1){
                                            add_style = "margin:5px 5px 0px 8px;max-width:135px";
                                        }else{
                                            add_style = "margin:5px 5px 0px 8px";
                                        }
                                    }
                                }else if(message.indexOf('cometchat_hw_lang')!=-1){
                                    add_style = "margin:0px 0px 0px 8px";
                                }else{
                                    add_style = "margin:-6px 0px 0px 8px";
                                }
                            }
                            msg = prepend+'<div class="cometchat_time cometchat_time_'+msg_date_class+' '+date_class+'" msg_format="'+msg_date_format+'">'+msg_date+'</div><div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'">'+selfstyleAvatar+'<div class="'+add_bg+' '+'cometchat_ts_margin cometchat_floatL" style="'+add_style+'"><span id="message_'+incoming.id+'" class="cometchat_msg">'+message+'</span></div>'+add_arrow_class+' '+sentdata_box+'</div>';
                            addMessage = 1;
                        }
                        $('#cometchat_user_'+incoming.from+'_popup .cometchat_prependMessages').hide();
                        if(addMessage==1&&chatboxopen==0){
                            $("#cometchat_tabcontenttext_"+incoming.from).append(msg);
                        }

                        if($("#cometchat_message_"+incoming.id).find(".cometchat_ts") != ''){
                           var msg_containerHeight = $("#cometchat_message_"+incoming.id+" .cometchat_ts_margin").outerHeight()-8;
                           var cometchat_ts_margin_right = $("#cometchat_message_"+incoming.id+" .cometchat_ts_margin").outerWidth(true)+5;
                           jqcc('#cometchat_message_'+incoming.id).find('.cometchat_ts').css('margin-top',msg_containerHeight);
                           jqcc('#cometchat_message_'+incoming.id).find('.cometchat_ts').css('margin-right',cometchat_ts_margin_right);
                        }

                        if($("#cometchat_message_"+incoming.id).find(".cometchat_ts_other") != ''){
                           var cometchat_ts_other_margin_left = $("#cometchat_message_"+incoming.id+" .cometchat_ts_margin").outerWidth(true)+30;
                           if($("#cometchat_message_"+incoming.id+" .cometchat_ts_margin").outerWidth() >= 135){
                                jqcc('#cometchat_message_'+incoming.id).find('.cometchat_ts_other').css('margin-left',-20);
                           }else if(cc_dir == 1){
                           jqcc('#cometchat_message_'+incoming.id).find('.cometchat_ts_other').css('margin-left',cometchat_ts_other_margin_left);
                             }
                        }
                        $("#cometchat_istyping_"+incoming.from).remove();

                        $.each($('#cometchat_user_'+incoming.from+'_popup .cometchat_prependMessages'),function (i,divele){
                            $('#cometchat_user_'+incoming.from+'_popup .cometchat_prependMessages:first').show();

                        });


                        if(undeliveredmessages.indexOf(incoming.id) >= 0){
                            $("#cometchat_chatboxseen_"+incoming.id).addClass('cometchat_deliverednotification');
                            undeliveredmessages.pop(incoming.id);
                        }
                        if(unreadmessages.indexOf(incoming.id) >= 0){
                            $("#cometchat_chatboxseen_"+incoming.id).addClass('cometchat_readnotification');
                            unreadmessages.pop(incoming.id);
                        }
                        var nowTime = new Date();
                        var idleDifference = Math.floor(nowTime.getTime()/1000)-jqcc.cometchat.getThemeVariable('idleTime');
                        if(idleDifference>5){
                            if(settings.windowTitleNotify==1){
                                document.title = language[15];
                            }
                        }
                        jqcc.docked.groupbyDate(incoming.from,jabber);
                        if(message.indexOf('<img')!=-1 && message.indexOf('src')!=-1){
                            $( "#cometchat_message_"+incoming.id+" img" ).load(function() {
                                jqcc.docked.scrollDown(incoming.from);
                                var cometchat_ts_margin_right = $("#cometchat_message_"+incoming.id+" .cometchat_ts_margin").outerWidth(true)+5;
                                jqcc('#cometchat_message_'+incoming.id).find('.cometchat_ts').css({'margin-right':cometchat_ts_margin_right});
                            });
                        }else{
                            jqcc.docked.scrollDown(incoming.from);
                        }
                    }
                    var newMessage = 0;
                    var isActiveChatBox = $('#cometchat_user_'+incoming.from+'_popup').find('textarea.cometchat_textarea').is(':focus');
                    if(/*(jqcc.cometchat.getThemeVariable('isMini')==1||!isActiveChatBox)&&*/incoming.self!=1&&incoming.old==0&&settings.desktopNotifications==1){
                        var callChatboxEvent = function(){
                            if(typeof incoming.from!='undefined'){
                                for(x in desktopNotifications){
                                    for(y in desktopNotifications[x]){
                                        desktopNotifications[x][y].close();
                                    }
                                }
                                desktopNotifications = {};
                                if(jqcc.cometchat.getThemeVariable('isMini')==1){
                                    window.focus();
                                }
                                jqcc.cometchat.chatWith(incoming.from);
                            }
                        };
                        if(typeof desktopNotifications[incoming.from]!='undefined'){
                            var newMessageCount = 0;
                            for(x in desktopNotifications[incoming.from]){
                                ++newMessageCount;
                                desktopNotifications[incoming.from][x].close();
                            }
                            jqcc.cometchat.notify((++newMessageCount)+' '+language[46]+' '+jqcc.cometchat.getThemeArray('buddylistName', incoming.from), jqcc.cometchat.getThemeArray('buddylistName', incoming.from), language[47], callChatboxEvent, incoming.from, incoming.id);
                        }else{
                            jqcc.cometchat.notify(language[48]+' '+jqcc.cometchat.getThemeArray('buddylistName', incoming.from), jqcc.cometchat.getThemeArray('buddylistAvatar', incoming.from), message, callChatboxEvent, incoming.from, incoming.id);
                        }
                    }
                    var totalHeight = 0;
                    $("#cometchat_tabcontenttext_"+incoming.from).children().each(function(){
                        totalHeight = totalHeight+$(this).outerHeight(false);
                    });
                    if(newMessage>0){
                        if($('#cometchat_tabcontenttext_'+incoming.from).outerHeight(false)<totalHeight){
                            $('#cometchat_tabcontenttext_'+incoming.from).append('<div class="cometchat_new_message_unread"><a herf="javascript:void(0)" onClick="javascript:jqcc.docked.scrollDown('+incoming.from+');jqcc(\'#cometchat_tabcontenttext_'+incoming.from+' .cometchat_new_message_unread\').remove();">&#9660 '+language[54]+'</a></div>');
                        }
                    }
                    if(visibleTab.indexOf(incoming.from) == -1) {
                        var unreadUnseenCount = $('#cometchat_unseenUsers').find('.unread_msg').length;
                        if(unreadUnseenCount > 0) {
                            $('#cometchat_unseenUserCount').html(unreadUnseenCount).show();
                        } else {
                            $('#cometchat_unseenUserCount').hide();
                        }
                    }
                    jqcc.docked.updateReadMessages(incoming.from);
                    if(settings.cometserviceEnabled == 1 && settings.messagereceiptEnabled == 1 && jqcc.cometchat.getCcvariable().callbackfn != "mobilewebapp" && settings.tapatalk == 0 && (settings.transport == 'cometservice' || settings.transport == 'cometservice-selfhosted')  && incoming.old == 0 && incoming.self == 1 && incoming.direction == 0){
                        jqcc.docked.sentMessageNotify(incoming);
                    }
                });
            },
            addPopup: function(id, amount, add){
                if((jqcc.cometchat.getThemeArray('buddylistName', id)==null||jqcc.cometchat.getThemeArray('buddylistName', id)=='') && amount>0){
                    if(jqcc.cometchat.getThemeArray('trying', id)===undefined){
                        jqcc[settings.theme].createChatbox(id, null, null, null, null, null, null, 1, null);
                    }
                }else{
                    if(add == 1){
                        amount = parseInt($('#cometchat_userlist_'+id).attr('amount'))+parseInt(amount);
                    }
                    var cometchat_user_id = jqcc("#cometchat_user_"+id);
                    if(amount==0){
                        cometchat_user_id.removeClass('cometchat_new_message').attr('amount', 0).find('div.cometchat_unreadCount').html(0).hide();
                        jqcc('#cometchat_userlist_'+id).removeClass('cometchat_new_message').attr('amount', 0).find('div.cometchat_unreadCount').html(0).hide();
                    }else{
                        cometchat_user_id.addClass('cometchat_new_message').attr('amount', amount).find('div.cometchat_unreadCount').html(amount).show();
                        jqcc('#cometchat_userlist_'+id).addClass('cometchat_new_message').attr('amount', amount).find('div.cometchat_unreadCount').html(amount).show();
                    }
                }
                jqcc.cometchat.setThemeArray('buddylistUnreadMessageCount', id, amount);
            },
            getTimeDisplay: function(ts){
                ts = parseInt(ts);
                var time = getTimeDisplay(ts);
                if((ts+"").length == 10){
                    ts = ts*1000;
                }
                var timeDataStart = time.hour+":"+time.minute+" "+time.ap;


                if(ts<jqcc.cometchat.getThemeVariable('todays12am')){
                    return timeDataStart+" "+time.date+time.type+" "+time.month;
                }else{
                    return timeDataStart;
                }
            },
            groupbyDate: function(id,j){
                if(j == '0' ){
                   $('#cometchat_user_'+id+'_popup .cometchat_time').hide();
                   $.each($('#cometchat_user_'+id+'_popup .cometchat_time'),function (i,divele){
                        var classes = $(divele).attr('class').split(/\s+/);
                        for(var i in classes){
                            if(typeof classes[i] == 'string') {
                                if(classes[i].indexOf('cometchat_time_') === 0){
                                	$('#cometchat_user_'+id+'_popup .'+classes[i]+':first').css('display','table');
                                }
                            }
                        }
                    });
                }else{
                    $('#cometchat_tabcontenttext_'+id+' .cometchat_time').hide();
                       $.each($('#cometchat_tabcontenttext_'+id+' .cometchat_time'),function (i,divele){
                        var classes = $(divele).attr('class').split(/\s+/);
                        for(var i in classes){
                            if(typeof classes[i] == 'string') {
                                if(classes[i].indexOf('cometchat_time_') === 0){
                                    $('#cometchat_tabcontenttext_'+id+' .'+classes[i]+':first').css('display','table');
                                }
                            }
                        }
                    });
                }
            },
            updateReadMessages: function(id){
                if($('#cometchat_user_'+id+'_popup:visible').find('.cometchat_chatboxmessage:not(.cometchat_self):last').length){
                    if(typeof (jqcc.cometchat.updateToStorage)!=='undefined'){
                        var alreadyreadmessages = jqcc.cometchat.getFromStorage('readmessages');
                        var lastid = parseInt($('#cometchat_user_'+id+'_popup').find('.cometchat_chatboxmessage:not(.cometchat_self):last').attr('id').replace('cometchat_message_',''));
                        if((typeof(alreadyreadmessages[id])!='undefined' && parseInt(alreadyreadmessages[id])<parseInt(lastid)) || typeof(alreadyreadmessages[id])=='undefined'){
                            var readmessages={};
                            readmessages[id]= parseInt(lastid);
                            jqcc.cometchat.updateToStorage('readmessages',readmessages);
                        }
                    }
                }
            },
            nointernetconnection: function() {
                /*var chatboxcontentheight = $('#cometchat_chatboxes').find('.cometchat_tabcontent .cometchat_tabcontenttext').height();
                if(!($('#cometchat_chatboxes').find('.cometchat_tabcontent .cometchat_offline').length)) {
                    var offlinecontent = '<div class="cometchat_offline" style="height:'+chatboxcontentheight+'px;"><div><img class="cometchat_offlineicon" src="'+baseUrl+'themes/'+settings.theme+'/images/internetconnection.svg" />You are Offline</div><div>Please check your internet connection.</div></div>';
                    $('#cometchat_chatboxes').find('.cometchat_tabcontent .cometchat_tabcontenttext').html(offlinecontent);
                }*/

               /* var unseenUserHtml = ''
                $.each(allChatboxes,function(id){
                   if(visibleTab.indexOf(id) == -1) {
                       var amount = parseInt($('#cometchat_user_'+id).attr('amount'));
                       var countVisible = '';
                       var unreadMsg = '';
                        if(amount > 0) {
                            countVisible = 'style="visibility: visible;" ';
                            unreadMsg = 'unread_msg';
                        }
                       unseenUserHtml += '<div id="unseenUser_'+id+'" class="cometchat_unseenUserList '+unreadMsg+'" uid="'+id+'"><div class="cometchat_unreadCount cometchat_floatL" '+countVisible+'>'+amount+'</div><div class="cometchat_userName cometchat_floatL">'+jqcc.cometchat.getThemeArray('buddylistName', id)+'</div><div class="cometchat_unseenClose cometchat_floatR" uid="'+id+'" >x</div></div>';
                   }
                });
                if(unseenUserHtml == ''){
                    $('#cometchat_chatbox_left').find(".cometchat_unseenList_open").click();
                } else {
                    $('#cometchat_unseenUsers').html(unseenUserHtml);
                }*/
            },
            createUnseenUser: function() {
                /*var unseenUserHtml = ''
                $.each(allChatboxes,function(id){
                   if(visibleTab.indexOf(id) == -1) {
                       var amount = parseInt($('#cometchat_user_'+id).attr('amount'));
                       var countVisible = '';
                       var unreadMsg = '';
                        if(amount > 0) {
                            countVisible = 'style="visibility: visible;" ';
                            unreadMsg = 'unread_msg';
                        }
                       unseenUserHtml += '<div id="unseenUser_'+id+'" class="cometchat_unseenUserList '+unreadMsg+'" uid="'+id+'"><div class="cometchat_unreadCount cometchat_floatL" '+countVisible+'>'+amount+'</div><div class="cometchat_userName cometchat_floatL">'+jqcc.cometchat.getThemeArray('buddylistName', id)+'</div><div class="cometchat_unseenClose cometchat_floatR" uid="'+id+'" >x</div></div>';
                   }
                });
                if(unseenUserHtml == ''){
                    $('#cometchat_chatbox_left').find(".cometchat_unseenList_open").click();
                } else {
                    $('#cometchat_unseenUsers').html(unseenUserHtml);
                }*/

            },
            updateReceivedUnreadMessages: function(id,lastid){
                if(typeof (jqcc.cometchat.updateToStorage)!=='undefined'){
                    var alreadyreceivedmessages = jqcc.cometchat.getFromStorage('receivedunreadmessages');
                    if((typeof(alreadyreceivedmessages[id])!='undefined' && parseInt(alreadyreceivedmessages[id])<parseInt(lastid)) || typeof(alreadyreceivedmessages[id])=='undefined'){
                        var receivedmessages={};
                        receivedmessages[id]= parseInt(lastid);
                        jqcc.cometchat.updateToStorage('receivedunreadmessages',receivedmessages);
                    }
                }
            },
            chatboxKeyup: function(event, chatboxtextarea, id){
                if(event.keyCode==27){
                    event.stopImmediatePropagation();
                    $(chatboxtextarea).val('');
                     $("#cometchat_user_"+id+"_popup").find('div.cometchat_tabtitle').click();
                }
                var adjustedHeight = chatboxtextarea.clientHeight;
                var maxHeight = 94;
                if(maxHeight>adjustedHeight){
                    adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
                    if(maxHeight)
                        adjustedHeight = Math.min(maxHeight, adjustedHeight);
                }else{
                    $(chatboxtextarea).css('overflow-y', 'auto');
                }
            },
            chatboxKeydown: function(event, chatboxtextarea, id, force){
                var condition = 1;
                if((event.keyCode==13&&event.shiftKey==0)||force==1 && !$(chatboxtextarea).hasClass('placeholder')){
                    var message = $(chatboxtextarea).val();
                    message = message.replace(/^\s+|\s+$/g, "");
                    $(chatboxtextarea).val('');
                    $(chatboxtextarea).css('overflow-y', 'hidden');
                    $(chatboxtextarea).focus();
                    if(settings.floodControl){
                        condition = ((Math.floor(new Date().getTime()))-lastmessagetime>2000);
                    }
                    if(settings.cometserviceEnabled == 1 && settings.istypingEnabled == 1 && settings.transport == 'cometservice'){
                        jqcc.cometchat.typingTo({id:id,method:'typingStop'});
                    }
                    if(message!=''){
                        if(condition){
                            var messageLength = message.length;
                            lastmessagetime = Math.floor(new Date().getTime());
                            if(jqcc.cometchat.getThemeArray('isJabber', id)!=1){
                                jqcc.cometchat.chatboxKeydownSet(id, message);
                            }else{
                                jqcc.ccjabber.sendMessage(id, message);
                            }
                        }else{
                            alert(language[53]);
                        }
                    }
                    return false;
                }
            },
            scrollDown: function(id){
            if(mobileDevice){
                 $('#cometchat_tabcontenttext_'+id).css('overflow-y','auto');
                 $('#cometchat_tabcontenttext_'+id).scrollTop(10000000);
            }else if(jqcc().slimScroll){
                    $('#cometchat_tabcontenttext_'+id).slimScroll({scroll: '1',railAlwaysVisible: true});
                }else{
                    setTimeout(function(){
                        $("#cometchat_tabcontenttext_"+id).scrollTop(50000);
                    }, 100);
                }
            },
            swapTab: function(sourceId) {
                /*var destinationId = visibleTab[visibleTab.length-1] || sourceId;
                var tempElem = $('#cometchat_user_'+sourceId+'_popup').detach();
                $('#cometchat_user_'+destinationId+'_popup').before(tempElem);
                var tempElem = $('#cometchat_user_'+sourceId).detach();
                $('#cometchat_user_'+destinationId).before(tempElem);
                tempElem.click();
                visibleTab.pop();
                visibleTab.push(sourceId);
                $.docked.createUnseenUser();
                $('#cometchat_chatbox_left').find(".cometchat_unseenList_open").click();*/
            },
            windowResize: function(silent){
                $.docked.scrollBars(silent);
                $.docked.closeTooltip();
                $.docked.rearrange();
            },
            scrollBars: function(silent){
            },
            joinChatroom: function(roomid, inviteid, roomname){
                $("#cometchat_grouplist_"+roomid).click();
                /* $("#cometchat_trayicon_chatrooms").click();
                $('#cometchat_trayicon_chatrooms_iframe,.cometchat_embed_chatrooms').attr('src', baseUrl+'modules/chatrooms/index.php?roomid='+roomid+'&inviteid='+inviteid+'&roomname='+roomname+'&basedata='+jqcc.cometchat.getThemeVariable('baseData'));
                jqcc.cometchat.setThemeVariable('openChatboxId', '');*/
            },
            closeTooltip: function(){
                $("#cometchat_tooltip").css('display', 'none');
            },
            rearrange: function(){
                var ttlWidth = 0;
                var ttlLength = $('#cometchat_chatboxes_wide').children().length;
                $('#cometchat_chatboxes_wide').children().each(function(index){
                    var thisElem = $(this);
                    var left = thisElem.offset().left;
                    var id = thisElem.attr('id').split('_')[2];
                    if(thisElem.attr('id').split('_')[1] == 'user'){
                        $('#cometchat_user_'+id+'_popup').css('left',left);
                    } else {
                        $('#cometchat_group_'+id+'_popup').css('left',left);
                    }
                });
            },
            loggedOut: function(){
                document.title = jqcc.cometchat.getThemeVariable('documentTitle');
                if(settings.ccauth.enabled=="1"){
                }else{
                    $("#loggedout").addClass("cometchat_optionsimages_exclamation");
                    $("#loggedout").attr("title",language[8]);
                }
                /* Changes for guest modal on chat.pcs START */
                    var controlparameters = {"type":"core", "name":"cometchat", "method":"foundation", "params":{"to":"0"}};
                    controlparameters = JSON.stringify(controlparameters);
                    parent.postMessage('CC^CONTROL_'+controlparameters,'*');
                /* Changes for guest modal on chat.pcs END */
                $("#loggedout").show();
                $("#cometchat_hidden").css('display','block');
                msg_beep = $("#messageBeep").detach();
                side_bar = $("#cometchat_sidebar").detach();
                option_button = $("#cometchat_optionsbutton_popup").detach();
                user_tab = $("#cometchat_userstab_popup").detach();
                chat_boxes = $("#cometchat_chatboxes").detach();
                chat_left = $("#cometchat_chatbox_left").detach();
                unseen_users = $("#cometchat_unseenUsers").detach();
                usertab2 = $("#cometchat_userstab").detach();
                $("span.cometchat_tabclick").removeClass("cometchat_tabclick");
                $("div.cometchat_tabopen").removeClass("cometchat_tabopen");
                jqcc.cometchat.setThemeVariable('loggedout', 1);
                $.cookie(settings.cookiePrefix+"loggedin", null, {path: '/'});
                $.cookie(settings.cookiePrefix+"state", null, {path: '/'});
                if($.cookie(settings.cookiePrefix+"crstate")){
                    $.cookie(settings.cookiePrefix+"crstate", null, {path: '/'});
                }
            },
            countMessage: function(){
                return;
                /*if(jqcc.cometchat.getThemeVariable('loggedout')==0){
                    var cc_state = $.cookie(settings.cookiePrefix+'state');
                    jqcc.cometchat.setInternalVariable('updatingsession', '1');
                    if(cc_state!=null){
                        var cc_states = cc_state.split(/:/);
                        if(jqcc.cometchat.getThemeVariable('offline')==0){
                            var value = 0;
                            if(cc_states[0]!=' '&&cc_states[0]!=''){
                                value = cc_states[0];
                            }
                            if((value==0&&$('#cometchat_userstab').hasClass("cometchat_tabclick"))||(value==1&&!($('#cometchat_userstab').hasClass("cometchat_tabclick")))){
                                $('#cometchat_userstab').click();
                            }
                            value = '';
                            if(cc_states[1]!=' '&&cc_states[1]!=''){
                                value = cc_states[1];
                            }
                            if(value==jqcc.cometchat.getSessionVariable('activeChatboxes')){
                                var newActiveChatboxes = {};
                                if(value!=''){
                                    var badge = 0;
                                    var chatboxData = value.split(/,/);
                                    for(i = 0; i<chatboxData.length; i++){
                                        var chatboxIds = chatboxData[i].split(/\|/);
                                        newActiveChatboxes[chatboxIds[0]] = chatboxIds[1];
                                        badge += parseInt(chatboxIds[1]);
                                    }
                                    favicon.badge(badge);
                                }
                            }
                        }
                    }
                }*/
            },
            resynch: function(){
                if(jqcc.cometchat.getThemeVariable('loggedout')==0){
                    var cc_state = jqcc.cometchat.getCcvariable().internalVars.chatboxstates;
                    var msgcount = 0;
                    if(cc_state!=null){
                        for(key in cc_state){
                            var state = cc_state[key].split('|');
                            if(key.indexOf('_') == -1 && !isNaN(parseInt(state[2]))) {
                                msgcount += parseInt(state[2]);
                            }
                        }
                        jqcc.cometchat.setThemeVariable('newMessages',msgcount);
                        if(jqcc.cometchat.getThemeVariable('newMessages')>0){
                            if(settings.windowFavicon==1){
                                jqcc[settings.theme].countMessage();
                            }
                            if(document.title==language[15]){
                                document.title = jqcc.cometchat.getThemeVariable('documentTitle');
                            }else{
                                if(settings.windowTitleNotify==1){
                                    document.title = language[15];
                                }
                            }
                        }else{
                            var nowTime = new Date();
                            var idleDifference = Math.floor(nowTime.getTime()/1000)-jqcc.cometchat.getThemeVariable('idleTime');
                            if(idleDifference<5){
                                document.title = jqcc.cometchat.getThemeVariable('documentTitle');
                                if(settings.windowFavicon==1){
                                    favicon.badge(0);
                                }
                            }
                        }
                    }
                    clearTimeout(resynchTimer);
                    resynchTimer = setTimeout(function(){
                        jqcc[settings.theme].resynch();
                    }, 5000);
                }
            },
            reinitialize: function(){
                if(jqcc.cometchat.getThemeVariable('loggedout')==1){
                    $('#loggedout').removeClass('cometchat_optionsimages_exclamation');
                    $('#loggedout').removeClass('cometchat_optionsimages_ccauth');
                    $('#loggedout').removeClass('cometchat_tabclick');
                    $('#loggedout').hide();
                    $("body").append(msg_beep);
                    $("#cometchat_base").append(side_bar);
                    $("#cometchat_base").append(option_button);
                    $("#cometchat_base").append(usertab2);
                    $("#cometchat_base").append(user_tab);
                    $("#cometchat_base").append(chat_boxes);
                    $("#cometchat_base").append(chat_left);
                    $("#cometchat_base").append(unseen_users);
                    $("#cometchat_optionsbutton,#cometchat_sidebar").show();
                    $("#cometchat_userstab").addClass('cometchat_userstabclick');
                    $("#cometchat_userstab").show();
                    jqcc.cometchat.setThemeVariable('loggedout', 0);
                    jqcc.cometchat.setExternalVariable('initialize', '1');
                    jqcc.cometchat.chatHeartbeat();
                    $('#cometchat_optionsbutton.cometchat_tabclick').click();
                }
            },
            minimizeAll: function(){
                $("div.cometchat_tabpopup").each(function(index){
                    if($(this).hasClass('cometchat_tabopen')){
                        $(this).find('div.cometchat_tabtitle').click();
                    }
                });
            },
            prependMessagesInit: function(id){
                var messages = jqcc('#cometchat_tabcontenttext_'+id).find('.cometchat_chatboxmessage');
                $('#cometchat_prependMessages_'+id).text(language[41]);
                if(messages.length > 0){
                    jqcc('#scrolltop_'+id).remove();
                    prepend = messages[0].id.split('_')[2];
                }else{
                    prepend = -1;
                }
                jqcc.cometchat.updateChatboxSet(id,prepend);
            },
            prependMessages:function(id,data){
                var oldMessages = '';
                var count = 0;
                var todaysdate = new Date();
                var tdmonth  = todaysdate.getMonth();
                var tddate  = todaysdate.getDate();
                var tdyear = todaysdate.getFullYear();
                var today_date_class = tdmonth+"_"+tddate+"_"+tdyear;
                var ydaysdate = new Date((new Date()).getTime() - 3600000 * 24);
                var ydmonth  = ydaysdate.getMonth();
                var yddate  = ydaysdate.getDate();
                var ydyear = ydaysdate.getFullYear();
                var yday_date_class = ydmonth+"_"+yddate+"_"+ydyear;
                var d = '';
                var month = '';
                var date  = '';
                var year = '';
                var msg_date_class = '';
                var msg_date = '';
                var date_class = '';
                var msg_date_format = '';
                var msg_time = '';
                var jabber = '';
                var messageid = [];
                var cc_dir = '<?php if ($rtl == 1) { echo 1; } else { echo 0; }?>';

                $('#cometchat_user_'+id+'_popup .cometchat_prependMessages').hide();
                if($('#scrolltop_'+id).length == 0){
                    $("#cometchat_tabcontenttext_"+id).prepend('<div id="scrolltop_'+id+'" class="cometchat_scrollup"><img src="'+baseUrl+'images/arrowtop.svg" class="cometchat_scrollimg" /></div>');
                }
                if($('#scrolldown_'+id).length == 0){
                    $("#cometchat_tabcontenttext_"+id).append('<div id="scrolldown_'+id+'" class="cometchat_scrolldown"><img src="'+baseUrl+'images/arrowbottom.svg" class="cometchat_scrollimg" /></div>');
                }
                $('#cometchat_tabcontenttext_'+id).unbind('wheel');
                $('#cometchat_tabcontenttext_'+id).on('wheel',function(event){
                    var scrollTop = $(this).scrollTop();
                    if(event.originalEvent.deltaY != 0){
                        clearTimeout($.data(this, 'scrollTimer'));
                        if(event.originalEvent.deltaY > 0){
                            $('#scrolltop_'+id).hide();
                            var down = jqcc("#cometchat_tabcontenttext_"+id)[0].scrollHeight-250-50;
                            if(scrollTop < down){
                                $('#scrolldown_'+id).fadeIn('slow');
                            }else{
                                $('#scrolldown_'+id).fadeOut();
                            }
                            $.data(this, 'scrollTimer', setTimeout(function() {
                                $('#scrolldown_'+id).fadeOut('slow');
                            },2000));

                        }else{
                            $('#scrolldown_'+id).hide();
                            var top = 45+50;
                            if(scrollTop > top){
                                $('#scrolltop_'+id).fadeIn('slow');
                            }else{
                                $('#scrolltop_'+id).fadeOut();
                            }
                            $.data(this, 'scrollTimer', setTimeout(function() {
                                $('#scrolltop_'+id).fadeOut('slow');
                            },2000));
                        }
                    }
                });

                $('#scrolltop_'+id).on("click",function(){
                    $('#scrolltop_'+id).hide();
                    $('#cometchat_tabcontenttext_'+id).slimScroll({scroll: 0});
                });

                $('#scrolldown_'+id).click(function(){
                    $('#scrolldown_'+id).hide();
                    $('#cometchat_tabcontenttext_'+id).slimScroll({scroll: 1});
                });

                $.each(data, function(type, item){
                    if(type=="messages"){
                        $.each(item, function(i, incoming){
                            count = count+1;

                            var message = jqcc.cometchat.processcontrolmessage(incoming);

                            if(message == null){
                                return;
                            }

                            if(incoming.sent!=null){
                                var ts = incoming.sent;
                                sentdata = jqcc[settings.theme].getTimeDisplay(ts);
                            }

                            if(incoming.jabber == 1 && typeof(incoming.selfadded) != "undefined" && incoming.selfadded != null) {
                                msg_time = incoming.id;
                                jabber = 1;
                            }else{
                                msg_time = incoming.sent;
                                jabber = 0;
                            }

                            msg_time = msg_time+'';

                            if (msg_time.length == 10){
                                msg_time = parseInt(msg_time * 1000);
                            }

                            months_set = new Array(language['jan'],language['feb'],language['mar'],language['apr'],language['may'],language['jun'],language['jul'],language['aug'],language['sep'],language['oct'],language['nov'],language['dec']);

                            d = new Date(parseInt(msg_time));
                            month  = d.getMonth();
                            date  = d.getDate();
                            year = d.getFullYear();
                            msg_date_class = month+"_"+date+"_"+year;
                            msg_date = months_set[month]+" "+date+", "+year;

                            var type = 'th';
                            if(date==1||date==21||date==31){
                                type = 'st';
                            }else if(date==2||date==22){
                                type = 'nd';
                            }else if(date==3||date==23){
                                type = 'rd';
                            }
                            msg_date_format = date+type+' '+months_set[month]+', '+year;

                            if(msg_date_class == today_date_class){
                                date_class = "today";
                                msg_date = language['today'];
                            }else  if(msg_date_class == yday_date_class){
                                date_class = "yesterday";
                                msg_date = language['yesterday'];
                            }

                            var msg = '';
                            var sentdata = '';
                            var add_bg = '';
                            var add_arrow_class = '';
                            var add_style = "";
                            var smileycount = (message.match(/cometchat_smiley/g) || []).length;
                            var smileymsg = message.replace(/<img[^>]*>/g,"");
                            smileymsg = smileymsg.trim();
                            var single_smiley_avatar = '';

                            if(smileycount == 1 && smileymsg == '') {
                                message = message.replace('height="20"', 'height="64px"');
                                message = message.replace('width="20"', 'width="64px"');
                                single_smiley_avatar = "margin-top:10px";
                            }

                            var avatar = baseUrl+"themes/docked/images/noavatar.png";
                            if(jqcc.cometchat.getThemeArray('buddylistAvatar', incoming.from)!=""){
                                avatar = jqcc.cometchat.getThemeArray('buddylistAvatar', incoming.from);
                            }
                            fromname = jqcc.cometchat.getThemeArray('buddylistName', incoming.from);
                            selfstyleAvatar = '<a class="cometchat_floatL" href="'+jqcc.cometchat.getThemeArray('buddylistLink', incoming.from)+'"><img class="ccmsg_avatar" style="'+single_smiley_avatar+'" src="'+avatar+'" title="'+fromname+'"/></a>';

                            if(incoming.sent!=null){
                                var ts = incoming.sent;
                                sentdata = jqcc.docked.getTimeDisplay(ts);
                            }
                            var jabber = jqcc.cometchat.getThemeArray('isJabber', incoming.from);
                            if(jqcc.cometchat.getThemeVariable('prependLimit') != '0' && jabber != 1){
                                var prepend = '<div class=\"cometchat_prependMessages\" onclick\="jqcc.docked.prependMessagesInit('+incoming.from+')\" id = \"cometchat_prependMessages_'+incoming.from+'\">'+language[83]+'</div>';
                            }

                            if(parseInt(incoming.self)==1){
                                if((message.indexOf('<img')==-1 && message.indexOf('src')==-1) || (smileycount > 0 && smileymsg != '')){
                                    add_bg = 'cometchat_chatboxmessagecontent cometchat_self';
                                    add_arrow_class = '<div class="selfMsgArrow"><div class="after"></div></div>';
                                }else{
                                    if(message.indexOf('cometchat_smiley')!=-1) {
                                        add_style = "margin-right:13px";
                                    }else{
                                        add_style = "margin-right:4px;margin-left:4px;";
                                    }
                                }
                                var sentdata_box = "<span class=\"cometchat_ts\">"+sentdata+"</span>";
                                msg = prepend+'<div class="cometchat_time cometchat_time_'+msg_date_class+' '+date_class+'" msg_format="'+msg_date_format+'">'+msg_date+'</div><div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'"><div class="'+add_bg+' '+'cometchat_ts_margin cometchat_self_msg cometchat_floatR" style="'+add_style+'" title="'+sentdata+'"><span id="message_'+incoming.id+'">'+message+'</span><span id="cometchat_chatboxseen_'+incoming.id+'"></span></div>'+add_arrow_class+' '+sentdata_box+'</div>';
                                addMessage = 1;

                            }else{
                                if(message.indexOf('cometchat_hw_lang')!=-1){
                                  var hw_ts = 'margin-left: 4px';
                              }
                                var sentdata_box = "<span class=\"cometchat_ts_other\" style='"+hw_ts+"'>"+sentdata+"</span>";

                                if((message.indexOf('<img')==-1 && message.indexOf('src')==-1) || (smileycount > 0 && smileymsg != '')){
                                    add_bg = 'cometchat_chatboxmessagecontent';
                                    add_arrow_class = '<div class="msgArrow"><div class="after"></div></div>';
                                }else{
                                    if(message.indexOf('cometchat_smiley')!=-1) {
                                        if(smileycount == 1 && smileymsg == ''){
                                            add_style = "margin:-4px 0px 0px 4px";
                                        }else{
                                            add_style = "margin:5px 5px 0px 8px";
                                        }
                                    }else if(message.indexOf('cometchat_hw_lang')!=-1){
                                        add_style = "margin:0px 0px 0px 8px";
                                    }else{
                                        add_style = "margin:-6px 0px 0px 8px";
                                    }
                                }
                                msg = prepend+'<div class="cometchat_time cometchat_time_'+msg_date_class+' '+date_class+'" msg_format="'+msg_date_format+'">'+msg_date+'</div><div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'">'+selfstyleAvatar+'<div class="'+add_bg+' '+'cometchat_ts_margin cometchat_floatL" style="'+add_style+'" title="'+sentdata+'"><span id="message_'+incoming.id+'" class="cometchat_msg">'+message+'</span></div>'+add_arrow_class+' '+sentdata_box+'</div>';
                                addMessage = 1;
                            }
                            oldMessages+=msg;
                        });
                    }
                });

                var current_top_element  = jqcc('#cometchat_tabcontenttext_'+id+' .cometchat_chatboxmessage:first');
                jqcc('#cometchat_user_'+id+'_popup').find('.cometchat_tabcontenttext').prepend(oldMessages);

                if(mobileDevice){
                    $('#cometchat_tabcontenttext_'+id).css('overflow-y','auto');
                }else{
                    var offsetheight = 0;
                    if(current_top_element.length>0){
                        var offsetheight = current_top_element.offset().top - jqcc('#cometchat_tabcontenttext_'+id+' .cometchat_chatboxmessage:first').offset().top+jqcc('.cometchat_time').height()+jqcc('#cometchat_prependMessages_'+id).height()+100;
                        var height = offsetheight-jqcc('#cometchat_tabcontenttext_'+id).height();
                        $('#cometchat_tabcontenttext_'+id).slimScroll({scrollTo: height+'px'});
                    }else{
                        $('#cometchat_tabcontenttext_'+id).slimScroll({scroll: 1});
                    }
                }

                var prependLimit = jqcc.cometchat.getThemeVariable('prependLimit');
                $('#cometchat_prependMessages_'+id).text(language[83]);
                if((count - parseInt(jqcc.cometchat.getThemeVariable('prependLimit')) < 0)){
                    $('#cometchat_prependMessages_'+id).text(language[84]);
                    jqcc('#cometchat_prependMessages_'+id).attr('onclick','');
                    jqcc('#cometchat_prependMessages_'+id).css('cursor','default');
                }

                $.each($('#cometchat_user_'+id+'_popup .cometchat_chatboxmessage'),function (i,divele){
                    if($(this).find(".cometchat_ts") != ''){
                       var msg_containerHeight = $(this).find(".cometchat_ts_margin").outerHeight()-8;
                       var cometchat_ts_margin_right = $(this).find(".cometchat_ts_margin").outerWidth(true)+5;
                       jqcc(this).find('.cometchat_ts').css('margin-top',msg_containerHeight);
                       jqcc(this).find('.cometchat_ts').css('margin-right',cometchat_ts_margin_right);
                   }
               });
                if(cc_dir == 1){
                    $('#cometchat_user_'+id+'_popup').find('.cometchat_ts_other').each(function(){
                        var cometchat_ts_other_margin_left = $(this).parent().find('.cometchat_ts_margin').outerWidth(true)+30;
                        $(this).css('margin-left',cometchat_ts_other_margin_left);
                    });
                }
                $.each($('#cometchat_user_'+id+'_popup .cometchat_prependMessages'),function (i,divele){
                    $('#cometchat_user_'+id+'_popup .cometchat_prependMessages:first').show();
                    });
                jqcc[settings.theme].groupbyDate(id,jabber);
            },
            messageBeep: function(baseUrl){
                if(!$('#messageBeep').length){
                    $('<audio id="messageBeep" style="display:none;"><source src="'+baseUrl+'sounds/beep.mp3" type="audio/mpeg"><source src="'+baseUrl+'sounds/beep.ogg" type="audio/ogg"><source src="'+baseUrl+'sounds/beep.wav" type="audio/wav"></audio>').appendTo($("body"));
                }
            },
            typingTo: function(item){
                if(typeof item['fromid'] != 'undefined'){

                    var id = item['fromid'];

                    $("#cometchat_typing_"+id).css('display', 'block');
                    $("#cometchat_buddylist_typing_"+id).css('display', 'block');

                   fromname = jqcc.cometchat.getThemeArray('buddylistName', id);
                    if(jqcc.cometchat.getThemeArray('buddylistAvatar', id)!=""){
                        avatar = jqcc.cometchat.getThemeArray('buddylistAvatar', id);
                    }
                	selfstyleAvatar = '<a class="cometchat_floatL" href="'+jqcc.cometchat.getThemeArray('buddylistLink', id)+'"><img class="ccmsg_avatar" src="'+avatar+'" title="'+fromname+'"/></a>';


                    var notify_typing = '<div class="cometchat_typingbox"><div class="typing_dots"></div><div class="typing_dots"></div><div class="typing_dots"></div></div>';

                    if($("#cometchat_istyping_"+id).length == 0){
                        msg = '<div class="cometchat_chatboxmessage" id="cometchat_istyping_'+id+'">'+selfstyleAvatar+'<div class="cometchat_chatboxmessagecontent cometchat_floatL"><span class="cometchat_msg">'+notify_typing+'</span></div><div class="msgArrow"><div class="after"></div></div></div>';
                        $("#cometchat_tabcontenttext_"+id).append(msg);
                        jqcc.docked.scrollDown(id);

                    }

                    typingReceiverFlag[id] = item['typingtime'];
                }

               if(typeof typingRecieverTimer == 'undefined' || typingRecieverTimer == null || typingRecieverTimer == ''){

                    typingRecieverTimer = setTimeout(function(){
                        typingRecieverTimer = '';
                        var counter = 0;
                        $.each(typingReceiverFlag, function(typingid,typingtime){
                            if(((parseInt(new Date().getTime()))+jqcc.cometchat.getThemeVariable('timedifference')) - typingtime > 5000){
                                $("#cometchat_typing_"+typingid).css('display', 'none');
                                $("#cometchat_buddylist_typing_"+typingid).css('display', 'none');
                                delete typingReceiverFlag[typingid];
                            }else{
                                counter++;
                            }

                        });
                        if(counter > 0){
                            jqcc[settings.theme].typingTo(1);
                        }

                    }, 5000);
                }

            },
            typingStop: function(item){
               $("#cometchat_typing_"+item['fromid']).css('display', 'none');
               $("#cometchat_buddylist_typing_"+item['fromid']).css('display', 'none');

               if($("#cometchat_istyping_"+item['fromid']).length == 1){
                    $("#cometchat_istyping_"+item['fromid']).remove();
                }
            },
            sentMessageNotify: function(item){
                var size = 0, key;
                for (key in item) {
                    if (typeof item[key] == 'object'){
                        jqcc[settings.theme].sentMessageNotify(item[key]);
                    }
                }
                if(typeof item['id'] != 'undefined' && $("#cometchat_chatboxseen_"+item['id']).prev().find('.cometchat_chatboxmessagecontent').hasClass('cometchat_self')){
                    $("#cometchat_chatboxseen_"+item['id']).addClass('cometchat_sentnotification');
                }
            },
            deliveredMessageNotify: function(item){
                if($("#cometchat_message_"+item['message']).length == 0){
                    undeliveredmessages.push(item['message']);
                } else if(typeof item['fromid'] != 'undefined' && $("#cometchat_chatboxseen_"+item['message']).prev().find('.cometchat_chatboxmessagecontent').hasClass('cometchat_self')){
                    $("#cometchat_chatboxseen_"+item['message']).addClass('cometchat_deliverednotification');
                }
            },
            readMessageNotify: function(item){
                if($("#cometchat_message_"+item['fromid']).length == 0 && jqcc.cometchat.getExternalVariable('messagereceiptsetting') == 0){
                    unreadmessages.push(item['fromid']);
                }
                if(jqcc.cometchat.getExternalVariable('messagereceiptsetting') == 0) {
                    jqcc("#cometchat_user_"+item['fromid']+"_popup span.cometchat_deliverednotification").addClass('cometchat_readnotification');
                }
            },
            deliveredReadMessageNotify: function(item){
               if($("#cometchat_message_"+item['message']).length == 0){
                    undeliveredmessages.push(item['message']);
                    unreadmessages.push(item['message']);
                } else if(typeof item['fromid'] != 'undefined' && $("#cometchat_chatboxseen_"+item['message']).prev().find('.cometchat_chatboxmessagecontent').hasClass('cometchat_self') && jqcc.cometchat.getExternalVariable('messagereceiptsetting') == 0){
                    $("#cometchat_chatboxseen_"+item['message']).addClass('cometchat_readnotification');
                }
            },
            updateSettings: function(){
                var guestname = '';
                var statusmessage = '';
                var status = '';
                var lastseensetting = 0;
                var readreceiptsetting = 0;
                var optionspopup = $('#cometchat_optionsbutton_popup');

                if(optionspopup.find('.cometchat_guestname').length){
                    guestname = optionspopup.find('.cometchat_guestname').val();
                }
                if(optionspopup.find('#cometchat_statusmessageinput').length){
                    statusmessage = optionspopup.find('#cometchat_statusmessageinput > textarea').val();
                }
                if(optionspopup.find('.cometchat_statusinputs').length){
                    status = optionspopup.find('input[name=cometchat_statusoptions]:checked', '#cometchat_optionsform').val();
                }
                jqcc.cometchat.updateSettings(guestname, statusmessage, status, lastseensetting, readreceiptsetting);

                /*this needs to be done in success of jqcc.cometchat.updateSettings*/
                if(status == 'away'){
                    jqcc.cometchat.setThemeVariable('currentStatus', status);
                    jqcc.cometchat.setThemeVariable('idleFlag', 1);
                } else {
                    jqcc.cometchat.setThemeVariable('idleFlag', 0);
                }
                /*end*/
            },
            chatScroll: function(id){
                if($('#scrolltop_'+id).length == 0){
                    $("#cometchat_tabcontenttext_"+id).prepend('<div id="scrolltop_'+id+'" class="cometchat_scrollup"><img src="'+baseUrl+'images/arrowtop.svg" class="cometchat_scrollimg" /></div>');
                }
                if($('#scrolldown_'+id).length == 0){
                    $("#cometchat_tabcontenttext_"+id).append('<div id="scrolldown_'+id+'" class="cometchat_scrolldown"><img src="'+baseUrl+'images/arrowbottom.svg" class="cometchat_scrollimg" /></div>');
                }
                $('#cometchat_tabcontenttext_'+id).unbind('wheel');
                $('#cometchat_tabcontenttext_'+id).on('wheel',function(event){
                    var scrollTop = $(this).scrollTop();
                    if(event.originalEvent.deltaY != 0){
                        clearTimeout($.data(this, 'scrollTimer'));
                        if(event.originalEvent.deltaY > 0){
                            $('#scrolltop_'+id).hide();
                            var down = jqcc("#cometchat_tabcontenttext_"+id)[0].scrollHeight-250-50;
                            if(scrollTop < down){
                                $('#scrolldown_'+id).fadeIn('slow');
                            }else{
                                $('#scrolldown_'+id).fadeOut();
                            }
                            $.data(this, 'scrollTimer', setTimeout(function() {
                                $('#scrolldown_'+id).fadeOut('slow');
                            },2000));

                        }else{
                            $('#scrolldown_'+id).hide();
                            var top = 45+50;
                            if(scrollTop > top){
                                $('#scrolltop_'+id).fadeIn('slow');
                            }else{
                                $('#scrolltop_'+id).fadeOut();
                            }
                            $.data(this, 'scrollTimer', setTimeout(function() {
                                $('#scrolltop_'+id).fadeOut('slow');
                            },2000));
                        }
                    }
                });

                $('#scrolltop_'+id).on("click",function(){
                    $('#scrolltop_'+id).hide();
                    $('#cometchat_tabcontenttext_'+id).slimScroll({scroll: 0});
                });

                $('#scrolldown_'+id).click(function(){
                    $('#scrolldown_'+id).hide();
                    $('#cometchat_tabcontenttext_'+id).slimScroll({scroll: 1});
                });
            },
            openMainContainer: function(){
                if(!($('#cometchat_userstab').hasClass("cometchat_tabclick"))){
                    $('#cometchat_userstab').click();
                }
            },
            openChatTab: function(openedtab){
                if(typeof(openedtab) != "undefined") {
                    jqcc[settings.theme].loadChatTab(parseInt(openedtab));
                }
            },
            scrollToTop: function(){
                $("html,body").animate({scrollTop: 0}, {"duration": "slow"});
            },
            applyChatBoxStates: function(statestoapply){
                jqcc.each(statestoapply, function(i, state){
                    var id = state.id;
                    var silent = 0;
                    var count = 0;
                    if (state.hasOwnProperty('s')) {
                        silent = state.s;
                    }
                    if (state.hasOwnProperty('c')) {
                        count = state.c;
                    }
                    if(typeof(state.g)!="undefined" && state.g==1){
                        var chatroomDetails = jqcc.cometchat.getChatroomDetails(id);
                        if(chatroomDetails != '') {
                            if(silent>0){
                                chatroomDetails = JSON.parse(chatroomDetails);
                                jqcc.cometchat.silentroom(id, chatroomDetails.password, urlencode(chatroomDetails.name),silent,count);
                            } else if(count>0){
                                jqcc.crdocked.addMessageCounter(id,count,0);
                            }
                        }
                    } else {
                        if(typeof(jqcc.docked.createChatbox)!=='undefined'){
                            if(silent>0){
                                jqcc[settings.theme].createChatbox(id, jqcc.cometchat.getThemeArray('buddylistName', id), jqcc.cometchat.getThemeArray('buddylistStatus', id), jqcc.cometchat.getThemeArray('buddylistMessage', id), jqcc.cometchat.getThemeArray('buddylistAvatar', id), jqcc.cometchat.getThemeArray('buddylistLink', id), jqcc.cometchat.getThemeArray('buddylistIsDevice', id),silent,count);
                            } else if(count>0){
                                jqcc.docked.addPopup(id,count,0);
                            }
                        }
                    }
                });
            }
        };
    })();
})(jqcc);

if(typeof(jqcc.docked) === "undefined"){
    jqcc.docked=function(){};
}

jqcc.extend(jqcc.docked, jqcc.ccdocked);

jqcc(window).resize(function(){
    jqcc.docked.windowResize(1);
});

/* code for Cloud Mobileapp compatibilty to Hide CometChat bar. */
jqcc(document).ready(function() {
    var platform = jqcc.cookie('cc_platform_cod');
    if(platform == 'android' || platform == 'ios' || platform == 'dm') {
        var hideInterval = setInterval(function(){
            if(jqcc('.cometchat_ccmobiletab_redirect').length>0||jqcc('#cometchat').length>0){
                jqcc('#cometchat').hide();
                jqcc('.cometchat_ccmobiletab_redirect').hide();
                clearTimeout(hideInterval);
            }
        },500);
    }
});

/* for IE8 */
if(!Array.prototype.indexOf){
    Array.prototype.indexOf = function(obj, start){
        for(var i = (start||0), j = this.length; i<j; i++){
            if(this[i]===obj){
                return i;
            }
        }
        return -1;
    }
}

if(!Array.prototype.forEach){
    Array.prototype.forEach = function(fun)
    {
        var len = this.length;
        if(typeof fun!="function")
            throw new TypeError();
        var thisp = arguments[1];
        for(var i = 0; i<len; i++)
        {
            if(i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}