<?php
	session_start();
	$uid = $_SESSION['uid'];
	if(!isset($uid) ){
		require_once('JSON.php');
		require_once('consts.php');
		header('Content-Type: application/json; charset=UTF-8');
		$json = new Services_JSON();
		$result = array();
		$result[success] = 0;
		$result[code] = $_NOT_LOGIN;
		print($json->encode($result));
		exit();
	}
?>