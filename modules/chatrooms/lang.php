<?php

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$addonfolder = str_replace(DIRECTORY_SEPARATOR.'lang.php','', __FILE__);
$addonarray = explode(DIRECTORY_SEPARATOR, $addonfolder);
$addonname = end($addonarray);
$addontype = rtrim(prev($addonarray),'s');

/* LANGUAGE */

${$addonname.'_language'}['title']				= setLanguageValue('title','Chatrooms',$lang,$addontype,$addonname);
${$addonname.'_language'}['login_to_use_cr']		= setLanguageValue('login_to_use_cr','Please login to use our chatrooms.',$lang,$addontype,$addonname);
${$addonname.'_language'}['select_chatroom'] 		= setLanguageValue('select_chatroom','Please select a public/private chatroom you would like to join',$lang,$addontype,$addonname);
${$addonname.'_language'}['create_chatroom'] 		= setLanguageValue('create_chatroom','Create Chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['lobby'] 				= setLanguageValue('lobby','Lobby',$lang,$addontype,$addonname);
${$addonname.'_language'}['leave_chatroom'] 			= setLanguageValue('leave_chatroom','<a href="javascript:void(0);" onclick="javascript:jqcc.cometchat.leaveChatroom()">Leave room</a>',$lang,$addontype,$addonname);
${$addonname.'_language'}['create_a_chatroom']	= setLanguageValue('create_a_chatroom','You can create a chatroom here',$lang,$addontype,$addonname);
${$addonname.'_language'}['me'] 					= setLanguageValue('me','Me',$lang,$addontype,$addonname);
${$addonname.'_language'}['semicolon'] 			= setLanguageValue('semicolon',':',$lang,$addontype,$addonname);
${$addonname.'_language'}['chatroom_password'] 	= setLanguageValue('chatroom_password','Please enter the chatroom password :',$lang,$addontype,$addonname);
${$addonname.'_language'}['popout'] 				= setLanguageValue('popout','Popout',$lang,$addontype,$addonname);
${$addonname.'_language'}['close_popout'] 		= setLanguageValue('close_popout','Close popout',$lang,$addontype,$addonname);
${$addonname.'_language'}['close_cr_window'] 		= setLanguageValue('close_cr_window','A popout session is already in progress or another chatroom window is open. Please close the other windows to continue.',$lang,$addontype,$addonname);
${$addonname.'_language'}['retry'] 				= setLanguageValue('retry','Click here to retry',$lang,$addontype,$addonname);
${$addonname.'_language'}['left_chatroom'] 		= setLanguageValue('left_chatroom',' has left the chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['joined_chatroom'] 		= setLanguageValue('joined_chatroom',' has joined the chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['closing_window'] 		= setLanguageValue('closing_window','Closing window shortly',$lang,$addontype,$addonname);
${$addonname.'_language'}['users_successfully_invited'] 	= setLanguageValue('users_successfully_invited','Users have been successfully invited',$lang,$addontype,$addonname);
${$addonname.'_language'}['users_invited'] 		= setLanguageValue('users_invited','Users Invited Successfully!',$lang,$addontype,$addonname);
${$addonname.'_language'}['chatroom_invite'] 		= setLanguageValue('chatroom_invite','has invited you to join chatroom ',$lang,$addontype,$addonname);
${$addonname.'_language'}['join'] 				= setLanguageValue('join','Join',$lang,$addontype,$addonname);
${$addonname.'_language'}['invite_users_button'] 	= setLanguageValue('invite_users_button','Invite Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['select_users'] 		= setLanguageValue('select_users','Please select users',$lang,$addontype,$addonname);
${$addonname.'_language'}['invite_users_title'] 	= setLanguageValue('invite_users_title','Invite Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['incorrect_password'] 	= setLanguageValue('incorrect_password','Incorrect password. Please try again.',$lang,$addontype,$addonname);
${$addonname.'_language'}['lock_image'] 			= setLanguageValue('lock_image','<img src="lock.png" />',$lang,$addontype,$addonname);
${$addonname.'_language'}['user_image'] 			= setLanguageValue('user_image','<img src="user.png" />',$lang,$addontype,$addonname);
${$addonname.'_language'}['enter_password'] 		= setLanguageValue('enter_password','Please enter a password',$lang,$addontype,$addonname);
${$addonname.'_language'}['name'] 				= setLanguageValue('name','Name',$lang,$addontype,$addonname);
${$addonname.'_language'}['type'] 				= setLanguageValue('type','Type',$lang,$addontype,$addonname);
${$addonname.'_language'}['public_room'] 			= setLanguageValue('public_room','Public Group',$lang,$addontype,$addonname);
${$addonname.'_language'}['pass_protected_room'] 	= setLanguageValue('pass_protected_room','Password-protected Group',$lang,$addontype,$addonname);
${$addonname.'_language'}['invitation_only_room'] = setLanguageValue('invitation_only_room','Invitation only Group',$lang,$addontype,$addonname);
${$addonname.'_language'}['password'] 			= setLanguageValue('password','Password',$lang,$addontype,$addonname);
${$addonname.'_language'}['create_room'] 			= setLanguageValue('create_room','Create Group',$lang,$addontype,$addonname);
${$addonname.'_language'}['online'] 				= setLanguageValue('online','online',$lang,$addontype,$addonname);
${$addonname.'_language'}['chatrooms'] 			= setLanguageValue('chatrooms','Chatrooms',$lang,$addontype,$addonname);
${$addonname.'_language'}['kicked'] 				= setLanguageValue('kicked','You have been kicked from this group.',$lang,$addontype,$addonname);
${$addonname.'_language'}['banned'] 				= setLanguageValue('banned','Sorry, you are banned from this group.',$lang,$addontype,$addonname);
${$addonname.'_language'}['roomname_not_available'] = setLanguageValue('roomname_not_available','This room name is not available.',$lang,$addontype,$addonname);
${$addonname.'_language'}['unban_cr_users'] 		= setLanguageValue('unban_cr_users','Unban Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['kick'] 				= setLanguageValue('kick','Kick',$lang,$addontype,$addonname);
${$addonname.'_language'}['ban'] 					= setLanguageValue('ban','Ban',$lang,$addontype,$addonname);
${$addonname.'_language'}['visit_profile'] 		= setLanguageValue('visit_profile','Visit Profile',$lang,$addontype,$addonname);
${$addonname.'_language'}['private_chat'] 		= setLanguageValue('private_chat','Private Chat',$lang,$addontype,$addonname);
${$addonname.'_language'}['no_users_to_unban'] 	= setLanguageValue('no_users_to_unban','There are no users to unban.',$lang,$addontype,$addonname);
${$addonname.'_language'}['no_users_available'] 	= setLanguageValue('no_users_available','Sorry, there are no users available at the moment to invite.',$lang,$addontype,$addonname);
${$addonname.'_language'}['delete'] 				= setLanguageValue('delete','delete',$lang,$addontype,$addonname);
${$addonname.'_language'}['confirm_delete_msg'] 	= setLanguageValue('confirm_delete_msg','Are you want to sure you want to delete this message?',$lang,$addontype,$addonname);
${$addonname.'_language'}['invite_cr_users'] 		= setLanguageValue('invite_cr_users','<a href="javascript:void(0);" class="inviteChatroomUsers">Invite users</a>',$lang,$addontype,$addonname);
${$addonname.'_language'}['do_not_spam'] 			= setLanguageValue('do_not_spam','Please do not spam in chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['enter_roomname'] 		= setLanguageValue('enter_roomname','Please enter the room name.',$lang,$addontype,$addonname);
${$addonname.'_language'}['cancel'] 				= setLanguageValue('cancel','Cancel',$lang,$addontype,$addonname);
${$addonname.'_language'}['new'] 					= setLanguageValue('new','New',$lang,$addontype,$addonname);
${$addonname.'_language'}['no_rooms_available'] 	= setLanguageValue('no_rooms_available','No groups available',$lang,$addontype,$addonname);
${$addonname.'_language'}['creating_chatroom'] 	= setLanguageValue('creating_chatroom','Creating chatroom...',$lang,$addontype,$addonname);
${$addonname.'_language'}['room_deleted'] 		= setLanguageValue('room_deleted','The group has been deleted.',$lang,$addontype,$addonname);
${$addonname.'_language'}['room_deleted_successfully']= setLanguageValue('room_deleted_successfully','The group has been deleted successfully',$lang,$addontype,$addonname);
${$addonname.'_language'}['no_permissions'] 		= setLanguageValue('no_permissions','You do not have permissions to delete the chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['delete_room'] 			= setLanguageValue('delete_room','Delete this room',$lang,$addontype,$addonname);
${$addonname.'_language'}['cr_delete_confirmation'] 	= setLanguageValue('cr_delete_confirmation','Are you sure you want to delete this chatroom?',$lang,$addontype,$addonname);
${$addonname.'_language'}['find_a_chatroom'] 		= setLanguageValue('find_a_chatroom','Find a chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['users'] 				= setLanguageValue('users','Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['moderators'] 			= setLanguageValue('moderators','Moderators',$lang,$addontype,$addonname);
${$addonname.'_language'}['enter_cr_name'] 		= setLanguageValue('enter_cr_name','Enter the name for Chatroom',$lang,$addontype,$addonname);
${$addonname.'_language'}['type_message'] 		= setLanguageValue('type_message','Type your message',$lang,$addontype,$addonname);
${$addonname.'_language'}['click_here'] 			= setLanguageValue('click_here','Click here',$lang,$addontype,$addonname);
${$addonname.'_language'}['social_auth'] 			= setLanguageValue('social_auth','to login using Social Auth.',$lang,$addontype,$addonname);
${$addonname.'_language'}['invite_users'] 		= setLanguageValue('invite_users','Invite Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['unban_users'] 			= setLanguageValue('unban_users','Unban Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['cr_plugins'] 			= setLanguageValue('cr_plugins','Chatroom Plugins',$lang,$addontype,$addonname);
${$addonname.'_language'}['cr_user_options'] 		= setLanguageValue('cr_user_options','Chatroom user options',$lang,$addontype,$addonname);
${$addonname.'_language'}['cr_users'] 			= setLanguageValue('cr_users','Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['leave_group'] 			= setLanguageValue('leave_group','Leave Group',$lang,$addontype,$addonname);
${$addonname.'_language'}['already_invited'] 		= setLanguageValue('already_invited','Already invited to this chatroom.',$lang,$addontype,$addonname);
${$addonname.'_language'}['load_earlier_msgs'] 	= setLanguageValue('load_earlier_msgs','Load Earlier Messages',$lang,$addontype,$addonname);
${$addonname.'_language'}['no_more_msgs'] 		= setLanguageValue('no_more_msgs','No more messages',$lang,$addontype,$addonname);
${$addonname.'_language'}['loading'] 				= setLanguageValue('loading','Loading...',$lang,$addontype,$addonname);
${$addonname.'_language'}['other_groups'] 	= setLanguageValue('other_groups','OTHER GROUPS',$lang,$addontype,$addonname);
${$addonname.'_language'}['joined_groups'] 	= setLanguageValue('joined_groups','JOINED GROUPS',$lang,$addontype,$addonname);
${$addonname.'_language'}['close_room'] 			= setLanguageValue('close_room','Close room',$lang,$addontype,$addonname);
${$addonname.'_language'}['rename_room'] 			= setLanguageValue('rename_room','Rename this room',$lang,$addontype,$addonname);
${$addonname.'_language'}['get_started'] 			= setLanguageValue('get_started','To get started, select a chatroom from the left tab.',$lang,$addontype,$addonname);
${$addonname.'_language'}['Password_start_with_space'] 			= setLanguageValue('Password_start_with_space','Password can\'t start with space.',$lang,$addontype,$addonname);
${$addonname.'_language'}['chatroom_name_blank'] 			= setLanguageValue('chatroom_name_blank','Chatroom name can\'t be blank.',$lang,$addontype,$addonname);
${$addonname.'_language'}['more_options'] 		= setLanguageValue('more_options','Options',$lang,$addontype,$addonname);


${$addonname.'_language'}['jan'] 			= setLanguageValue('jan','January',$lang,$addontype,$addonname);
${$addonname.'_language'}['feb'] 			= setLanguageValue('feb','February',$lang,$addontype,$addonname);
${$addonname.'_language'}['mar'] 			= setLanguageValue('mar','March',$lang,$addontype,$addonname);
${$addonname.'_language'}['apr'] 			= setLanguageValue('apr','April',$lang,$addontype,$addonname);
${$addonname.'_language'}['may'] 			= setLanguageValue('may','May',$lang,$addontype,$addonname);
${$addonname.'_language'}['jun'] 			= setLanguageValue('jun','June',$lang,$addontype,$addonname);
${$addonname.'_language'}['jul'] 			= setLanguageValue('jul','July',$lang,$addontype,$addonname);
${$addonname.'_language'}['aug'] 			= setLanguageValue('aug','August',$lang,$addontype,$addonname);
${$addonname.'_language'}['sep'] 			= setLanguageValue('sep','September',$lang,$addontype,$addonname);
${$addonname.'_language'}['oct'] 			= setLanguageValue('oct','October',$lang,$addontype,$addonname);
${$addonname.'_language'}['nov'] 			= setLanguageValue('nov','November',$lang,$addontype,$addonname);
${$addonname.'_language'}['dec'] 			= setLanguageValue('dec','December',$lang,$addontype,$addonname);
${$addonname.'_language'}['today'] 			= setLanguageValue('today','Today',$lang,$addontype,$addonname);
${$addonname.'_language'}['yesterday'] 		= setLanguageValue('yesterday','Yesterday',$lang,$addontype,$addonname);
${$addonname.'_language'}['create_group'] 	= setLanguageValue('create_group','Create Group',$lang,$addontype,$addonname);
${$addonname.'_language'}['close_tab'] 		= setLanguageValue('close_tab','Close Tab',$lang,$addontype,$addonname);
${$addonname.'_language'}['participants'] 	= setLanguageValue('participants','Participants',$lang,$addontype,$addonname);
${$addonname.'_language'}['view_users'] 	= setLanguageValue('view_users','View Users',$lang,$addontype,$addonname);
${$addonname.'_language'}['group_users'] 	= setLanguageValue('group_users','Group Users',$lang,$addontype,$addonname);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

${$addonname.'_key_mapping'} = array(
	'100'	=>	'title',
	'0'		=>	'login_to_use_cr',
	'1'		=>	'select_chatroom',
	'2'		=>	'create_chatroom',
	'3'		=>	'lobby',
	'4'		=>	'leave_chatroom',
	'5'		=>	'create_a_chatroom',
	'6'		=>	'me',
	'7'		=>	'semicolon',
	'8'		=>	'chatroom_password',
	'9'		=>	'popout',
	'10'	=>	'close_popout',
	'11'	=>	'close_cr_window',
	'12'	=>	'retry',
	'13'	=>	'left_chatroom',
	'14'	=>	'joined_chatroom',
	'15'	=>	'closing_window',
	'16'	=>	'users_successfully_invited',
	'17'	=>	'users_invited',
	'18'	=>	'chatroom_invite',
	'19'	=>	'join',
	'20'	=>	'invite_users_button',
	'21'	=>	'select_users',
	'22'	=>	'invite_users_title',
	'23'	=>	'incorrect_password',
	'24'	=>	'lock_image',
	'25'	=>	'user_image',
	'26'	=>	'enter_password',
	'27'	=>	'name',
	'28'	=>	'type',
	'29'	=>	'public_room',
	'30'	=>	'pass_protected_room',
	'31'	=>	'invitation_only_room',
	'32'	=>	'password',
	'33'	=>	'create_room',
	'34'	=>	'online',
	'35'	=>	'chatrooms',
	'36'	=>	'kicked',
	'37'	=>	'banned',
	'38'	=>	'roomname_not_available',
	'39'	=>	'unban_cr_users',
	'40'	=>	'kick',
	'41'	=>	'ban',
	'42'	=>	'visit_profile',
	'43'	=>	'private_chat',
	'44'	=>	'no_users_to_unban',
	'45'	=>	'no_users_available',
	'46'	=>	'delete',
	'47'	=>	'confirm_delete_msg',
	'48'	=>	'invite_cr_users',
	'49'	=>	'do_not_spam',
	'50'	=>	'enter_roomname',
	'51'	=>	'cancel',
	'52'	=>	'new',
	'53'	=>	'no_rooms_available',
	'54'	=>	'creating_chatroom',
	'55'	=>	'room_deleted',
	'56'	=>	'room_deleted_successfully',
	'57'	=>	'no_permissions',
	'58'	=>	'delete_room',
	'59'	=>	'cr_delete_confirmation',
	'60'	=>	'find_a_chatroom',
	'61'	=>	'users',
	'62'	=>	'moderators',
	'63'	=>	'enter_cr_name',
	'64'	=>	'type_message',
	'65'	=>	'click_here',
	'66'	=>	'social_auth',
	'67'	=>	'invite_users',
	'68'	=>	'unban_users',
	'69'	=>	'cr_plugins',
	'70'	=>	'cr_user_options',
	'71'	=>	'cr_users',
	'72'	=>	'leave_group',
	'73'	=>	'already_invited',
	'74'	=>	'load_earlier_msgs',
	'75'	=>	'no_more_msgs',
	'76'	=>	'loading',
	'77'	=>	'other_groups',
	'78'	=>	'joined_groups',
	'79'	=>	'close_room',
	'80'	=>	'rename_room',
	'81'	=>	'get_started',
	'82'	=>	'Password_start_with_space',
	'83'	=>	'chatroom_name_blank',
	'90' 	=>	'jan',
	'91' 	=>	'feb',
	'92' 	=>  'mar',
	'93'	=>  'apr',
	'94' 	=>  'may',
	'95' 	=>  'jun',
	'96' 	=>  'jul',
	'97' 	=>  'aug',
	'98' 	=>  'sep',
	'99' 	=>  'oct',
	'101' 	=>	'nov',
	'102' 	=>  'dec',
	'103' 	=>  'today',
	'104' 	=>	'yesterday',
	'105' 	=>	'create_group'
);

${$addonname.'_language'} = mapLanguageKeys(${$addonname.'_language'},${$addonname.'_key_mapping'},$addontype,$addonname);