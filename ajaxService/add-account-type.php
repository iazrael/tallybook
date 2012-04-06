<?php
	require_once('../db/tb-db.php');
	require_once('../JSON.php');
	require_once('../consts.php');
	require_once('../functions.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	
	$type = escape_string($_POST['type']);
	$name = escape_string($_POST['name']);
	$parent = escape_string($_POST['parent']);

	
	if(is_numeric($parent) && strlen($name) < 200){
		if($parent > 0){
			$insertString = "INSERT INTO category(name,parentId,type,createTime,updateTime) 
				VALUES('$name',$parent,$type,now(),now())";
		}else{
			$insertString = "INSERT INTO category(name,type,createTime,updateTime) 
				VALUES('$name',$type,now(),now())";
		}
		
		if($tbdb->insert($insertString)){
			$result[success] = 1;
			$result[name] = $name;
			$result[type] = $type;
			$result['parent'] = $parent;
			$result[id] = $tbdb->getid();
			print($json->encode($result));
		}else{
			$result[success] = 0;
			$result[code] = $_DATABASE_INSERT_ERROR;
			print($json->encode($result));
		}
		
	}else{
		$result[success] = 0;
		$result[code] = $_VAR_TYPE_ERROR;
		print($json->encode($result));
	}
	
	
	
	
?>