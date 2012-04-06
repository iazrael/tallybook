<?php
	require_once('../db/tb-db.php');
	require_once('../JSON.php');
	require_once('../consts.php');
	require_once('../functions.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	
	$id = escape_string($_POST['id']);
	$type = escape_string($_POST['type']);
	if(!$_IS_RECORD_DELETABLE){
		$result[success] = 0;
        $result[code] = $_NO_AUTHORIZATION;
        
        $result[id] = $id;
        $result[type] = $type;
        
        print($json->encode($result));
	}else if(is_numeric($id) && is_numeric($type)){
		
		$deleteString = "DELETE FROM account WHERE id = $id";
		if($tbdb->delete($deleteString)){
			$result[success] = 1;
			$result[id] = $id;
			print($json->encode($result));
		}else{
			$result[success] = 0;
			$result[code] = $_DATABASE_INSERT_ERROR;
			print($json->encode($result));
		}
		
	}else{
		$result[success] = 0;
		$result[code] = $_VAR_TYPE_ERROR;
		
		$result[id] = $id;
		$result[type] = $type;
		
		print($json->encode($result));
	}
	
	
	
	
?>