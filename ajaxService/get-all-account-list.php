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
	
	$year = escape_string($_POST['year']);
	$month = escape_string($_POST['month']);
	if(is_numeric($year) && is_numeric($month)){
		$startMonth = date('Y-m-d', mktime(0, 0, 0, $month, 1, $year));
		$endMonth = date('Y-m-d', mktime(0, 0, 0, $month + 1, 0, $year));
		$queryString = "SELECT c.id	FROM bill c,category t WHERE t.id = c.categoryId AND c.uid=$uid AND c.occurredTime BETWEEN '$startMonth' AND '$endMonth'";
		//查询总数
		$totalCount = $tbdb->getcount($queryString);
		$records = array();
		if($totalCount){//没有符合条件的记录时，减少一次数据库查询
			$queryString = "SELECT c.id as id, amount, categoryId, t.name as categoryName, remark, occurredTime, c.type as accountType
				FROM bill c,category t WHERE t.id = c.categoryId AND c.uid=$uid AND c.occurredTime BETWEEN '$startMonth' AND '$endMonth'
				ORDER BY c.type DESC, occurredTime ASC";
			$qresult = $tbdb->query($queryString);
			while($row=$tbdb->getarray($qresult)){
				$records[] = array(
						id=>$row[id],
						amount=>$row[amount],
						categoryId=>$row[categoryId],
						categoryName=>$row[categoryName],
						remark=>$row[remark],
						occurredTime=>$row[occurredTime],
						accountType=>$row[accountType]
					);
			}
		}else{
			$totalCount = 0;
		}
		$result[success] = 1;
		$result[total] = $totalCount;
		$result[records] = $records;
		$result[year] = $year;
		$result[month] = $month;
		print($json->encode($result));
		
	}else{
		$result[success] = 0;
		$result[code] = $_VAR_TYPE_ERROR;
		print($json->encode($result));
	}


?>