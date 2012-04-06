<?php
	function escape_string($str){
		return mysql_real_escape_string(trim($str));
	}
	
?>