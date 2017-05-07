<?php

/*

CometChat
Copyright (c) 2016 Inscripts
License: https://www.cometchat.com/legal/license

*/

if (!defined('CCADMIN')) { echo "NO DICE"; exit; }

$navigation = <<<EOD
	<div id="leftnav">
		<a href="?module=layouts&amp;ts={$ts}" class="active_setting">Layouts</a>
	</div>
EOD;

function index() {
	global $body;
	global $navigation;
	global $color_original;
    global $theme_original;
    global $ts;

    $athemes = array();

	if ($handle = opendir(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'themes')) {
		while (false !== ($file = readdir($handle))) {
			if ($file != "." && $file != ".." && $file != "base" && $file !="mobile" && is_dir(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'themes'.DIRECTORY_SEPARATOR.$file) && file_exists(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'themes'.DIRECTORY_SEPARATOR.$file.DIRECTORY_SEPARATOR.'config.php')) {
				if((defined('TAPATALK')&&TAPATALK==1&&$file=='tapatalk')||(!defined('TAPATALK')&&$file!='tapatalk')||(defined('TAPATALK')&&TAPATALK==0&&$file!='tapatalk')){
					if($file == 'embedded' || $file == 'docked')
						$athemes[] = $file;
				}
			}
		}
		closedir($handle);
	}
	asort($athemes);
	array_push($athemes, "mobile");

	$activethemes = '';
	$no = 0;

	foreach ($athemes as $ti) {
		$title = ucwords($ti);

		++$no;

		$default = '';
		$opacity = '0.5';
		$titlemakedefault = 'title="Activate this theme"';
		$setdefault = '';
		
		if (strtolower($theme_original) == strtolower($ti)) {
			$opacity = '1;cursor:default';
			$titlemakedefault = '';
			$setdefault = '';
        }

        if (strtolower($ti) == 'mobile' || strtolower($ti) == 'synergy' || strtolower($ti) == 'tapatalk' || strtolower($ti) == 'embedded') {
			$Default = ' (Default)';
			$opacity = '1;cursor:default';
			$titlemakedefault = '';
			$setdefault = '';
		}

		if(strtolower($ti) == 'embedded'){
			$default = '';
		}

		if (strtolower($ti) == 'embedded'){
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;"></span><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:0px;"><a href="../cometchat_embedded.php" target="_blank" style="margin-right:5px;"><img src="images/link.png" title="Direct link to Embedded"></a><a href="javascript:void(0)" onclick="javascript:themetype_embedcode(\''.$ti.'\')" style="margin-right:5px;"><img src="images/embed.png" title="Generate Embed Code" ></a></span><div style="clear:both"></div></li>';
		}else if(strtolower($ti) == 'docked'){
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;"><a href="javascript:void(0)" onclick="javascript:themetype_embedcode(\''.$ti.'\')"><img src="images/embed.png" title="Generate Footer Code" ></a></span><div style="clear:both"></div></li>';
		} else {
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;"><a href="javascript:void(0)" onclick="javascript:themetype_configmodule(\''.$ti.'\')" style="margin-right:5px;"><img src="images/config.png" title="Edit '.$title.'"></a></span><div style="clear:both"></div></li>';
		}
	}

	$body = <<<EOD
	$navigation

	<div id="rightcontent" style="float:left;width:720px;border-left:1px dotted #ccc;padding-left:20px;">
                 <div>
		<h2>Layouts</h2>

		<div>
			<ul id="modules_livethemes">
				$activethemes
			</ul>
		</div>
                 </div>


EOD;

	$athemes = array();

	$sql = ("select distinct `color` from `cometchat_colors`");
    $query = mysqli_query($GLOBALS['dbh'],$sql);

    while ($color = mysqli_fetch_assoc($query)) {
    	if((defined('TAPATALK')&&TAPATALK==1&&$color['color']=='tapatalk')||(!defined('TAPATALK')&&$color['color']!='tapatalk')||(defined('TAPATALK')&&TAPATALK==0&&$color['color']!='tapatalk')){
			$athemes[] = $color['color'];
		}
    }

	$activethemes = '';
	$no = 0;
	asort($athemes);
	foreach ($athemes as $ti) {

		$title = ucwords($ti);

		++$no;

		$default = '';
		$opacity = '0.5';
		$titlemakedefault = 'title="Activate this color-scheme"';
		$setdefault = 'onclick="javascript:themes_makedefault(\''.$ti.'\')"';

		if (strtolower($color_original) == strtolower($ti)) {
			$default = ' (Active)';
			$opacity = '1;cursor:default';
			$titlemakedefault = '';
			$setdefault = '';
		}

                $isdefault = '<a href= "javascript:void(0)" onclick="javascript:themes_editcolor(\''.$ti.'\')" style="margin-right:5px;"><img src="images/config.png" title="Edit Color"></a><a href="?module=themes&amp;action=clonecolor&amp;theme='.$ti.'&amp;ts={$ts}"><img src="images/clone.png" title="Clone Color" style="margin-right:5px;"></a><a href="javascript:void(0)" onclick="javascript:themes_removecolor(\''.$ti.'\')"><img src="images/remove.png" title="Remove Color"></a>';
		if($ti == 'docked'){
            		$isdefault = '<a href="?module=themes&amp;action=clonecolor&amp;theme='.$ti.'&amp;ts={$ts}"><img src="images/clone.png" title="Clone Color" style="margin-right:5px;"></a>';
		} elseif($ti == 'synergy'){
			$isdefault = '<a href= "javascript:void(0)" onclick="javascript:themes_editcolor(\''.$ti.'\')" style="margin-right:5px;"><img src="images/config.png" title="Edit Color"></a>';
		} elseif ($ti == 'tapatalk') {
			$isdefault = '<a href= "javascript:void(0)" onclick="javascript:themes_editcolor(\''.$ti.'\')" style="margin-right:5px;"><img src="images/config.png" title="Edit Color"></a>';
		} elseif ($ti == 'embedded') {
			$isdefault = '<a href= "javascript:void(0)" onclick="javascript:themes_editcolor(\''.$ti.'\')" style="margin-right:5px;"><img src="images/config.png" title="Edit Color"></a>';
		}
		if($ti == 'synergy'){
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;">'.$isdefault.'</span><div style="clear:both"></div></li>';
		}elseif($ti == 'tapatalk'){
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;">'.$isdefault.'</span><div style="clear:both"></div></li>';
		}elseif($ti == 'embedded'){
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;">'.$isdefault.'</span><div style="clear:both"></div></li>';
		}else{
			$activethemes .= '<li class="ui-state-default" id="'.$no.'" d1="'.$ti.'"><span style="font-size:11px;float:left;margin-top:3px;margin-left:5px;" id="'.$ti.'_title">'.stripslashes($title).$default.'</span><span style="font-size:11px;float:right;margin-top:0px;margin-right:5px;"><a href="javascript:void(0)" '.$setdefault.' style="margin-right:5px;"><img src="images/default.png" '.$titlemakedefault.' style="opacity:'.$opacity.';"></a>'.$isdefault.'</span><div style="clear:both"></div></li>';
		}
	}
	$createcolor ='';
	if(!defined('TAPATALK') || (defined('TAPATALK')&&TAPATALK==0)){
		$createcolor= '<div style="clear:both"></div><input type="button" value="Create new Color" class="button margin-top" onclick="javascript:create_new_colorscheme()">';
	}

	/*$body .= <<<EOD
            <div class="margin-top">
				<h2>Colors</h2>
				<h3>To set the Color, click on the star button next to the Color.</h3>
				<div>
					<ul id="modules_livethemes">
						$activethemes
					</ul>
				</div>
			</div>
			{$createcolor}
		</div>
	<div style="clear:both"></div>
EOD;*/
global $color;
// print_r($settings['color']);
// print_r($color);
$colors = array('color1'=>'56a8e3','color2'=>'4DC5CE','color3'=>'FFC107','color4'=>'FB4556','color5'=>'DBA0C3','color6'=>'3B5998','color7'=>'065E52','color8'=>'FF8A2E','color9'=>'E99090','color10'=>'23025E','color11'=>'24D4F6','color12'=>'289D57','color13'=>'D9B197','color14'=>'FF67AB','color15'=>'9C27B0');
$colorbox = '';
foreach($colors as $colorname => $val){
	$colorbox .= '<div id="'.$colorname.'_'.$val.'" style="background:#'.$val.'" class="colorbox"><div class="tick" id="tick_'.$colorname.'_'.$val.'"><img src="images/check.svg"/></div> </div>';
}
$body .= <<<EOD
			<script type="text/javascript">
				$(document).ready(function(){
					$('#{$color}_{$colors[$color]}').find('.tick').css('display','table');
					$('#{$color}_{$colors[$color]}').find('.tick').addClass('selected');
					$('.colorbox').click(function(){
						$('.tick').css('display','none');
						$('.tick').removeClass('selected');
						$('#'+this.id).find('.tick').css('display','table');
						$('#'+this.id).find('.tick').addClass('selected');
					});
					$('#submit_color').click(function(){
						var tickclass = $('.tick');
						$.each(tickclass,function(i,val){
							if($('#'+this.id).hasClass('selected')){
								var name = this.id.split('_');
								$("#color_text").val(name[1]);
							}
						});
					});
				});
			</script>
			<div class="margin-top">
				<h2>Colors</h2>
				<div style="width:400px;"class="outerbox">
					{$colorbox}
				</div>
				<form action="?module=layouts&action=updatecolorval&ts={$ts}" method="post">
				<input id="color_text" type="hidden" name="color"/>
				<input type="submit" id="submit_color" class="button" value="Update color">
			</div>
EOD;

	template();

}

function updatecolorval(){
	$color = $_POST['color'];
	global $ts;
	configeditor(array('color'=>$color));
	$_SESSION['cometchat']['error'] = 'Color updated successfully.';
	header('Location:?module=layouts&ts='.$ts);
}

function makedefault() {
	if (!empty($_POST['theme'])) {
		$save_color = array('color' => $_POST['theme']);
		configeditor($save_color);
		$_SESSION['cometchat']['error'] = 'Successfully updated color. Please clear your browser cache and try.';
	}
	echo "1";
}

function themestypemakedefault() {

	if (!empty($_POST['theme'])) {
        configeditor($_POST);
        $_SESSION['cometchat']['error'] = 'Successfully updated theme. Please clear your browser cache and try.';
    }

	echo "1";

}

function checkcolor($color) {

	if (substr($color,0,1) == '#') {
		$color = strtoupper($color);

		if (strlen($color) == 4) {
			$color = $color[0].$color[1].$color[1].$color[2].$color[2].$color[3].$color[3];
		}

	}

	return $color;

}

function restorecolorprocess() {
	global $client;

	$sql = ("delete from `cometchat_colors` where `color` = 'synergy' and `color_key`!='parentColor'");
	mysqli_query($GLOBALS['dbh'],$sql);
	removeCachedSettings($client.'cometchat_color');

	$_SESSION['cometchat']['error'] = 'Colors have been restored successfully.';

	echo "1";
	exit;

}

function editcolor() {
	global $body;
	global $navigation;
    global $ts;
    global $themeSettings;

    $parent = getParentColor($_GET['data']);
    if(!empty($parent)){
    	if (file_exists(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'colors'.DIRECTORY_SEPARATOR.$parent.'.php')) {
			include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'colors'.DIRECTORY_SEPARATOR.$parent.'.php');
		}
    }
    $themeSettings = setNewColorValue($themeSettings,$_GET['data']);

	$restore = '<a href="?module=themes&amp;ts={$ts}">cancel</a>';
	if($_GET['data'] == 'synergy'){
		$restore = '<a onclick="javascript:themes_restorecolors()" href="">restore</a>' ;
	}

	$form = '';
	$inputs = '';
	$js = '';
	$uniqueColor = array();

	foreach ($themeSettings as $field => $input) {
		$input = checkcolor($input);

		$form .= '<div class="titlesmall" style="padding-top:14px;" >'.$field.'</div><div class="element">';

		if (substr($input,0,1) == '#') {

			if (empty($uniqueColor[$input])) {
				$inputs .= '<div class="themeBox colors" oldcolor="'.$input.'" newcolor="'.$input.'" style="background:'.$input.';"></div>';
			}

			$uniqueColor[$input] = 1;

			$form .= '<input type="text" class="inputbox themevariables" id=\''.$field.'_field\' name=\''.$field.'\' value=\''.$input.'\' style="width: 100px;height:28px" required="true"/>';
			$form .= '<div class="colorSelector themeSettings" field="'.$field.'" id="'.$field.'" oldcolor="'.$input.'" newcolor="'.$input.'" ><div style="background:'.$input.'" style="float:right;margin-left:10px"></div></div>';

			$input = substr($input,1);
			$js .= <<<EOD
$('#$field').ColorPicker({
	color: '#$input',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#$field div').css('backgroundColor', '#' + hex);
		$('#$field').attr('newcolor','#'+hex);
		document.getElementById('{$field}_field').setAttribute('value','#'+hex);
		$('#{$field}_field').trigger("change");
	}
});

EOD;

		} else {
			$form .= '<input type="text" class="inputbox themevariables" name=\''.$field.'\' value=\''.$input.'\' style="height:28px;width:250px;" required="true"/>';
		}

		$form .= '</div><div style="clear:both;padding:7px;"></div>';

	}

	$js .= <<<EOD
$(function() {
	$( "#slider" ).slider({
		value:0,
		min: 0,
		max: 1,
		step: 0.0001,
		slide: function( event, ui ) {
			shift(ui.value);
		}
	});
});

EOD;

	$body = <<<EOD

	<script>

	$(function(){
		var changedArr = {};
	    $("input.themevariables").live("change",function() {
	        changedArr[$(this).attr('name')] = $(this).val().replace(/\'/g,'"');
	    });

		$('#update_var').click(function(){
			themes_updatevariables('{$_GET['data']}',changedArr);
		});
	});

	$(function() { $js });

	</script>
	$navigation
	<form>
	<div id="rightcontent" style="float:left;width:720px;border-left:1px dotted #ccc;padding-left:20px;">
		<h2>Theme Editor</h2>
		<h3>Edit your theme using two simple tools. If you need advanced modifications, then manually edit the CSS files in the <b>cometchat</b> folder on your server.</h3>

		<div>
			<div id="centernav">
				<h2>Color changer</h2>
				<h3>Use the slider to change the base colors.</h3>
				$inputs
				<div style="clear:both;padding:7.5px;"></div>
				<div id="slider"></div>
				<div style="clear:both;padding:7.5px;"></div>
				<input type="button" value="Update colors" class="button" onclick="javascript:themes_updatecolors('{$_GET['data']}')">&nbsp;&nbsp;or {$restore}
				<div style="clear:both;padding:20px;"></div>

				<h2>Theme Variables</h2>
				<h3>Update colors, font family and font sizes of your theme.</h3>

				<div>
					<div id="centernav" style="width:700px">
						$form
					</div>
				</div>

				<div style="clear:both;padding:7.5px;"></div>
				<input type="button" value="Update variables" id="update_var" class="button" >&nbsp;&nbsp;or {$restore}
			</div>
			<div id="rightnav">
				<h1>Tips</h1>
				<ul id="modules_availablethemes">
					<li>For more advanced modifications, please edit themes/{$_GET['data']}/cometchat.css file.</li>
 				</ul>
			</div>
		</div>
	</div>

	<div style="clear:both"></div>

EOD;

	template();
}

function updatecolorsprocess() {
    global $themeSettings;
	$colors = $_POST['colors'];
	$_GET['data'] = $_POST['theme'];

	$parent = getParentColor($_GET['data']);
    if(!empty($parent)){
    	if (file_exists(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'colors'.DIRECTORY_SEPARATOR.$parent.'.php')) {
			include_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'colors'.DIRECTORY_SEPARATOR.$parent.'.php');
		}
    }

	$themeSettings = setNewColorValue($themeSettings,$_GET['data']);

	foreach ($themeSettings as $field => $input) {
		$input = checkcolor($input);

		if (!empty($colors[strtoupper($input)])) {
			$themeSettings[$field] = strtoupper($colors[$input]);
		}
	}

	$_SESSION['cometchat']['error'] = 'Color scheme updated successfully';

	coloreditor($themeSettings,$_GET['data']);

	echo 1;

}

function updatevariablesprocess() {
	if(!empty($_POST['colors'])){
		$colors = $_POST['colors'];
		$_GET['data'] = $_POST['theme'];
		$_SESSION['cometchat']['error'] = 'Color scheme updated successfully';
		coloreditor($colors, $_GET['data']);
	}
	echo 1;
}

function clonecolor() {
	global $body;
	global $navigation;
        global $ts;

	$body = <<<EOD
	$navigation
	<form action="?module=themes&action=clonecolorprocess&ts={$ts}" method="post" enctype="multipart/form-data">
	<div id="rightcontent" style="float:left;width:720px;border-left:1px dotted #ccc;padding-left:20px;">
		<h2>Create color scheme</h2>
		<h3>Please enter the name of your new color scheme. Do not include special characters in your theme name.</h3>
		<div>
			<div id="centernav">
				<div class="title">Color scheme name:</div><div class="element"><input type="text" class="inputbox" name="theme" required="true"/><input type="hidden" name="clone" value="{$_GET['theme']}"></div>
				<div style="clear:both;padding:10px;"></div>
			</div>
		</div>

		<div style="clear:both;padding:7.5px;"></div>
		<input type="submit" value="Add Color scheme" class="button">&nbsp;&nbsp;or <a href="?module=themes&amp;ts={$ts}">cancel</a>
	</div>

	<div style="clear:both"></div>

EOD;

	template();

}

function clonecolorprocess() {
    global $ts;
    global $client;

	$color = createslug($_POST['theme']);
	$clone = createslug($_POST['clone']);
	$_SESSION['cometchat']['error'] = 'Invalid arguments color and clone.';
	if(!empty($color) && !empty($clone)){
		$sql = ("select `color_value` from `cometchat_colors` where `color` = '".mysqli_real_escape_string($GLOBALS['dbh'],$color)."' limit 1");
		$query = mysqli_query($GLOBALS['dbh'],$sql);
		$result = mysqli_fetch_assoc($query);

		if(empty($result)){
			$sql = ("select `color_value` from `cometchat_colors` where `color` = '".mysqli_real_escape_string($GLOBALS['dbh'],$clone)."' and `color_key` = 'parentColor'");

			$query = mysqli_query($GLOBALS['dbh'],$sql);
			$result = mysqli_fetch_assoc($query);

			if($result['color_value'] != $clone){
				$sql = ("insert into `cometchat_colors`(`color_key`,`color_value`,`color`) select `color_key`,`color_value`,'".mysqli_real_escape_string($GLOBALS['dbh'],$color)."' from `cometchat_colors` where `color` = '".mysqli_real_escape_string($GLOBALS['dbh'],$clone)."'");
			}else{
				$sql = ("insert into `cometchat_colors`(`color_key`,`color_value`,`color`) values ('parentColor','".mysqli_real_escape_string($GLOBALS['dbh'],$result['color_value'])."','".mysqli_real_escape_string($GLOBALS['dbh'],$color)."')");
			}
			$query = mysqli_query($GLOBALS['dbh'],$sql);
			$_SESSION['cometchat']['error'] = 'New color scheme added successfully';
			removeCachedSettings($client.'cometchat_color');
			header("Location:?module=themes&ts={$ts}");
			exit;
		}else{
			$_SESSION['cometchat']['error'] = ucfirst($color).' color scheme already exists.';

		}
	}
	header("Location:?module=themes&action=clonecolor&theme={$clone}&ts={$ts}");
	exit;
}

function removecolorprocess() {
    global $ts;
    global $client;
	$color = $_GET['data'];
	$color_array = array('docked','embedded');

	if (!in_array($color, $color_array) && !empty($color)) {
		$sql = ("delete from `cometchat_colors` where `color` = '".mysqli_real_escape_string($GLOBALS['dbh'],$color)."'");
		mysqli_query($GLOBALS['dbh'],$sql);
		removeCachedSettings($client.'cometchat_color');
		$_SESSION['cometchat']['error'] = 'Color scheme deleted successfully';
	} else {
		$_SESSION['cometchat']['error'] = 'Sorry, this color scheme cannot be deleted. Please manually remove the theme from the "themes/color" folder.';
	}
	header("Location:?module=themes&ts={$ts}");
}