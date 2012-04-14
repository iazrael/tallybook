<?php
	require_once('../db/tb-db.php');
//	require_once('../JSON.php');
	require_once('../consts.php');
	require_once('../functions.php');
	require_once('../check-right.php');
	
	header('Content-Type: application/json; charset=UTF-8');
//	$json = new Services_JSON();
	$result = array();
	
	$sequence = $_POST['sequence'];
	$sequence = stripslashes($sequence);
    $sequence = json_decode($sequence);
    $uid = $_SESSION['uid'];
    if(is_array($sequence)){
        $failureIds = array();
    	foreach($sequence as $s){
    	    $sqlString = "UPDATE category c SET c.index=$s->index WHERE c.id=$s->id AND uid=$uid";
            if(!$tbdb->update($sqlString)){
                $failureIds[] = $s->id;
            }
    		if(is_array($s->children)){
    			foreach($s->children as $c){
	                $sqlString = "UPDATE category c SET c.index=$c->index, c.parentId=$s->id WHERE c.id=$c->id AND uid=$uid";
	                if(!$tbdb->update($sqlString)){
	                    $failureIds[] = $c->id;
	                }
    			}
    		}
        }
//            $result[sqlString] = $sqlString;
        $result[success] = 1;
        $result[failureIds] = $failureIds;
        print(json_encode($result));
    }else{
        $result[success] = 0;
        $result[code] = $_VAR_TYPE_ERROR;
        print(json_encode($result));
    }
	
?>