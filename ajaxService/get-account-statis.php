<?php
	require_once('../db/tb-db.php');
	require_once('../JSON.php');
	require_once('../consts.php');
	require_once('../functions.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	$result = array();
	$uid = $_SESSION['uid'];

	$startYear = escape_string($_POST['startYear']);
	$endYear = escape_string($_POST['endYear']);
	$startMonth = escape_string($_POST['startMonth']);
	$endMonth = escape_string($_POST['endMonth']);
    if(is_numeric($startYear) && is_numeric($endYear) && 
        is_numeric($startMonth) && is_numeric($endMonth)){
        $start = date('Y-m-d', mktime(0, 0, 0, $startMonth, 1, $startYear));
        $end = date('Y-m-d', mktime(0, 0, 0, $endMonth + 1, 0, $endYear));
        if($start > $end){
        	$result[success] = 0;
	        $result[code] = $_VAR_VALUE_ERROR;
	        $result[start] = $start;
	        $result[end] = $end;
	        print($json->encode($result));
        }else{
	        $records = array();
	        $queryString = "SELECT SUM(amount) AS amount, SUBSTR(occurredTime, 1, 7) AS month
	            FROM bill a WHERE type = 0 AND uid=$uid AND occurredTime BETWEEN '$start' AND '$end'
	            GROUP BY month ORDER BY occurredTime";
	        $qresult = $tbdb->query($queryString);
	        while($row=$tbdb->getarray($qresult)){
	            $records['out'][] = array(
	                    $row[month],
	                    0 + $row[amount]
	                );
	        }
	        $queryString = "SELECT SUM(amount) AS amount, SUBSTR(occurredTime, 1, 7) AS month
	            FROM bill a WHERE type = 1 AND uid=$uid AND occurredTime BETWEEN '$start' AND '$end'
	            GROUP BY month ORDER BY occurredTime";
	        $qresult = $tbdb->query($queryString);
	        while($row=$tbdb->getarray($qresult)){
	            $records['in'][] = array(
	                    $row[month],
	                    0 + $row[amount]
	                );
	        }
	        $result[params] = array($start, $end);
	        $result[success] = 1;
	        $result[records] = $records;
//	        $result[sql] = $queryString;
	        print($json->encode($result));
        }
    }else{
        $result[success] = 0;
        $result[code] = $_VAR_TYPE_ERROR;
        
        print($json->encode($result));
    }

?>