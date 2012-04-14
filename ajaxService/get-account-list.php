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
	$start = escape_string($_POST['start']);
	$count = escape_string($_POST['count']);
	$uid = $_SESSION['uid'];
	if(is_numeric($start) && is_numeric($count) && preg_match('/\d{4}-\d{2}-\d{2}/',$date)){
	
		if($start < 0 || $count < 0){
			$result[success] = 0;
			$result[code] = $_VAR_VALUE_ERROR;
			print($json->encode($result));
		}else{
			$queryString = "SELECT c.id	FROM bill c,category t WHERE t.id = c.categoryId AND c.occurredTime = '$date' AND c.uid=$uid";
			//查询总数
			$totalCount = $tbdb->getcount($queryString);
			$records = array();
			if($totalCount){//没有符合条件的记录时，减少一次数据库查询
				$queryString = "SELECT c.id as id, amount, categoryId, t.name as categoryName, remark, occurredTime, c.type as accountType
					FROM bill c,category t WHERE t.id = c.categoryId AND c.occurredTime = '$date' AND c.uid=$uid ORDER BY c.createTime DESC LIMIT $start,$count";
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
			$result[date] = $date;
			print($json->encode($result));
		}
	}else{
		$result[success] = 0;
		$result[code] = $_VAR_TYPE_ERROR;
		print($json->encode($result));
	}


?>