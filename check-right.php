<?php
if($_IS_NEED_LOGIN){
	session_start();
	$login = $_SESSION['logininfo'];
	if(!$_IS_NEED_LOGIN || (isset($login) && $login='3.141592654')){
		
	}else{
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
}
?>