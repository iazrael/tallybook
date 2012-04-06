<?php
	require_once('../db/tb-db.php');
	require_once('../JSON.php');
	require_once('../consts.php');
	require_once('../functions.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	$records = array();
	$queryString = "SELECT SUM(amount) AS amount, type
	            FROM account a 
	            GROUP BY type";
	$qresult = $tbdb->query($queryString);
	while($row=$tbdb->getarray($qresult)){
		$records[($row[type] ? 'in' : 'out')] = 0 + $row[amount];
	}
	$result[success] = 1;
	$result[records] = $records;
	print($json->encode($result));

?>