<?php
if($_IS_NEED_LOGIN){
	session_start();
	$uid = $_SESSION['uid'];
	if(!isset($uid)){
		header("HTTP/1.1 303 To Login");
		header("Location: login.php");
		exit();
	}
}
?>