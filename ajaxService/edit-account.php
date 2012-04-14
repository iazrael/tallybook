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
	$id = escape_string($_POST['id']);
	$uid = $_SESSION['uid'];
	
	if(is_numeric($id) && is_numeric($amount) && is_numeric($typeValue) && preg_match('/\d{4}-\d{2}-\d{2}/',$date)){
		
		$sqlString = "UPDATE bill SET amount=$amount,occurredTime='$date',categoryId=$typeValue,remark='$remark', updateTime=now(),type=$type WHERE id=$id AND uid=$uid";
		if($tbdb->update($sqlString)){
			$record = array(
				id=>$id,
				amount=>$amount,
				categoryId=>$typeValue,
				remark=>$remark,
				addTime=>$date,
				accountType=>$type
			);
			$result[success] = 1;
			$result[record] = $record;
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