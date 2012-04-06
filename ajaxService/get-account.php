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
	if(is_numeric($id)){
		
		$queryString = "SELECT c.id as id, amount, categoryId, t.name as categoryName, remark, addTime, c.type FROM account c,category t WHERE c.id = $id AND t.id = c.categoryId";
		$records;
		$qresult = $tbdb->query($queryString);
		while($row=$tbdb->getarray($qresult)){
			$records = array(
				id=>$row[id],
				amount=>$row[amount],
				categoryId=>$row[categoryId],
				remark=>$row[remark],
				addTime=>$row[addTime],
				categoryName=>$row[categoryName],
				accountType=>$row[type]
			);
		}
		$result[success] = 1;
		$result[records] = $records;
		print($json->encode($result));
	}else{
		$result[success] = 0;
		$result[code] = $_VAR_TYPE_ERROR;
		print($json->encode($result));
	}


?>