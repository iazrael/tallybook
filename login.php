<?php 
	if(isset($_POST['submit'])){
		require_once('db/tb-db.php');
		require_once('functions.php');
		
		$uname = escape_string($_POST['uname']);
		$upwd = escape_string($_POST['upwd']);
		$ip = $_SERVER["REMOTE_ADDR"];
		$info = '';
		if($uname && $upwd){
			$pwdMd5 = md5($upwd);
			$queryString = "SELECT * FROM user WHERE uname='$uname' AND pwd='$pwdMd5'";
			$user = $tbdb->getfirst($queryString);
			if($user){

      		$queryString = "UPDATE user SET lastLoginTime=now(), lastLoginIp='$ip' WHERE uname='$uname'";
      		$tbdb->update($queryString);
				session_start();
				$_SESSION['uid'] = $user[uid];
				$_SESSION['username'] = $uname;
				header("HTTP/1.1 303 To Index");
				header("Location: ./");
				exit();
			}else{
				$info = 'username or password is wrong, please try again.';
			}
		}else{
			$info = 'please fill all the field.';
		}
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Please Login</title>
</head>
<body>
<div id="container" style="width: 300px;margin: 100px auto;">
	<form action="" method="post" >
		<fieldset>
			<legend>Login</legend>
			<p><lable>Username: </lable><input name="uname" type="text"></p>
			<p><lable>Password: </lable><input name="upwd" type="password"></p>
			<p style="text-align: right;"><input name="submit" type="submit" value="Submit"></p>
			<p style="text-align: center;color: red;"><?php echo $info;?></p>
		</fieldset>
	</form>
</div>
</body>
</html>