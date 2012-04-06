<?php
	require_once('../db/tb-db.php');
	require_once('../JSON.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
	$json = new Services_JSON();
	
	$inTypeQueryString = 'SELECT * FROM category c WHERE type=1 AND parentId=0 ORDER BY c.index DESC';
	$inTypeQueryString2 = 'SELECT * FROM category c WHERE type=1 AND parentId!=0 ORDER BY c.index DESC';
	$outTypeQueryString = 'SELECT * FROM category c WHERE type=0 AND parentId=0 ORDER BY c.index DESC';
	$outTypeQueryString2 = 'SELECT * FROM category c WHERE type=0 AND parentId!=0 ORDER BY c.index DESC';
	
	$result = array();
	$typeArr = array();
	$typeArr2 = array();
	$qresult = $tbdb->query($inTypeQueryString);
	while($row=$tbdb->getarray($qresult)){
	 	$typeArr[$row[id]] = array('id'=>"$row[id]",'name'=>"$row[name]");
	}
	$qresult = $tbdb->query($inTypeQueryString2);
	while($row=$tbdb->getarray($qresult)){
	 	$typeArr[$row[parentId]][children][$row[id]] = array('id'=>"$row[id]",'name'=>"$row[name]");
	}
	
	$qresult = $tbdb->query($outTypeQueryString);
	while($row=$tbdb->getarray($qresult)){
	 	$typeArr2[$row[id]] = array('id'=>"$row[id]",'name'=>"$row[name]");
	}
	$qresult = $tbdb->query($outTypeQueryString2);
	while($row=$tbdb->getarray($qresult)){
	 	$typeArr2[$row[parentId]][children][$row[id]] = array('id'=>"$row[id]",'name'=>"$row[name]");
	}
	
	$result['success'] = '1';
	$result['inType'] = $typeArr;
	$result['outType'] = $typeArr2;
	
	$output = $json->encode($result);
	print($output);
	
?>