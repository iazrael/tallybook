<?php
	require_once('../db/tb-db.php');
	require_once('../JSON.php');
	require_once('../consts.php');
	require_once('../functions.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	
	$date = escape_string($_POST['date']);
	$amount = escape_string($_POST['amount']);
	$remark = escape_string($_POST['remark']);
	$type = escape_string($_POST['type']);
	$typeValue = escape_string($_POST['typeValue']);
	
	if(is_numeric($amount) && is_numeric($type) && is_numeric($typeValue) && preg_match('/\d{4}-\d{2}-\d{2}/',$date)){

		$sqlString = "INSERT INTO account(amount,addTime,categoryId,remark,type,createTime,updateTime) 
			VALUES($amount,'$date',$typeValue,'$remark',$type,now(),now())";
		if($tbdb->insert($sqlString)){
			$result[success] = 1;
			$result[date] = $date;
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
		
		$result[date] = $date;
		$result[amount] = $amount;
		$result[remark] = $remark;
		$result[type] = $type;
		
		print($json->encode($result));
	}
	
	
	
	
?>