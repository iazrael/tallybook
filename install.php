<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Install Tally Book</title>
    <style type="text/css">
    	p{
    		text-align: center;
    	}
    	.info{
    		color: #000;
    	}
    	.error{
    		color: #ff0000;
    	}
    	.success{
    	   color: #369;
    	}
    </style>
</head>
<body>
<?php
/*******定义表信息**********/
$account = "CREATE TABLE `account` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryId` int(10) unsigned NOT NULL COMMENT '账单种类',
  `remark` varchar(200) DEFAULT NULL,
  `addTime` date NOT NULL COMMENT '录入时间',
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `type` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '账单类型:0:支出/1:收入',
  PRIMARY KEY (`id`),
  KEY `FK_account_category` (`categoryId`),
  CONSTRAINT `FK_account_category` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=444 DEFAULT CHARSET=utf8;";

$category = "CREATE TABLE `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `parentId` int(10) unsigned DEFAULT '0',
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `type` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '种类类型:0,支出/1:收入',
  `index` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;";

$cateData = "INSERT INTO `category` (`id`,`name`,`parentId`,`createTime`,`updateTime`,`type`,`index`) VALUES 
 (1,'饮食',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,13),
 (2,'零食/水果',1,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,5),
 (3,'工作就餐',1,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (4,'聚餐请客',1,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (5,'日常开支',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,12),
 (6,'房租物业',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,4),
 (7,'水电煤气',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,3),
 (8,'生活用品',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (9,'休闲娱乐',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (10,'债务',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,11),
 (11,'借款',10,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (12,'还款',10,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (13,'服装美容',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,10),
 (14,'衣服',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,4),
 (15,'鞋类',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,3),
 (16,'护肤品',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (17,'理发',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (18,'其他',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,5),
 (19,'通讯费',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,9),
 (20,'手机费',19,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (21,'上网费',19,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (22,'医疗费用',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,8),
 (23,'看病',22,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (24,'买药',22,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (25,'电子产品',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,6),
 (26,'电脑/配件',25,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,3),
 (27,'移动电话',25,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,2),
 (28,'交通费',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,7),
 (29,'旅游',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,3),
 (30,'书籍',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,5),
 (31,'礼品',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,4),
 (32,'其他支出',0,'2010-10-13 22:50:02','2010-10-13 22:50:02',0,1),
 (33,'虚拟物品',25,'2010-10-14 21:38:54','2010-10-14 21:38:54',0,1),
 (34,'买菜',1,'2010-10-16 13:17:54','2010-10-16 13:17:54',0,4),
 (35,'公用费用',5,'2010-10-16 13:18:46','2010-10-16 13:18:46',0,5),
 (36,'工资',0,'2010-10-13 22:49:56','2010-10-13 22:49:56',1,7),
 (37,'奖金',0,'2010-10-13 22:49:56','2010-10-13 22:49:56',1,6),
 (38,'兼职',0,'2010-10-13 22:49:56','2010-10-13 22:49:56',1,5),
 (39,'其他',0,'2010-10-13 22:49:56','2010-10-13 22:49:56',1,4),
 (40,'打的',28,'2010-11-07 23:14:01','2010-11-07 23:14:01',0,3),
 (41,'公交',28,'2010-11-07 23:14:24','2010-11-07 23:14:24',0,2),
 (42,'收款',10,'2010-11-19 19:54:59','2010-11-19 19:54:59',0,3),
 (43,'吃饭',1,'2010-11-19 19:55:58','2010-11-19 19:55:58',0,3),
 (44,'慈善',0,'2010-12-03 23:48:14','2010-12-03 23:48:14',0,2),
 (45,'收款',0,'2010-12-06 23:14:20','2010-12-06 23:14:20',1,3),
 (46,'地铁',28,'2011-01-03 20:25:40','2011-01-03 20:25:40',0,1),
 (47,'借款',0,'2011-01-03 20:26:56','2011-01-03 20:26:56',1,2),
 (48,'红包',0,'2011-02-10 18:19:05','2011-02-10 18:19:05',1,1),
 (49,'电影',5,'2011-05-29 18:06:31','2011-05-29 18:06:31',0,0),
 (53,'饮料',1,'2011-05-29 18:07:47','2011-05-29 18:07:47',0,0);";

$user = "CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(40) NOT NULL,
  `pwd` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;";
$userData = "INSERT INTO `user` (`id`,`uid`,`pwd`) VALUES 
	 (1,'root','123');";

require_once('db/db-config.php');
$connect = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);

if(mysql_select_db(DB_NAME,$connect)){
	echo '<p class="info">数据库已经存在.</p>';
}else{
	if(mysql_query("CREATE DATABASE ".DB_NAME , $connect)){
		echo '<p class="info">创建数据库成功.</p>';
	}else{
		echo '<p class="error">创建数据库出错,请检查配置!<br/>'.mysql_error().'</p>';
		return;
	}
}
mysql_query("SET NAMES 'utf8'") or startUpError('SET NAMES Error.');
if(mysql_select_db(DB_NAME,$connect)){
	$result = mysql_query("SHOW TABLES FROM ".DB_NAME);
	$tables = array();
	while ($row = @mysql_fetch_row($result)) {
       $tables[] = $row[0];
    }
	$table = 'category';
	if(in_array($table,$tables)){
		echo "<p class='info'>表: $table 已存在!</p>";
	}else if(!mysql_query($category)){
		echo "<p class='error'>创建表 $table 出错: ".mysql_error()."</p>";
		return;
	}else if(!mysql_query($cateData)){
		echo "<p class='error'>预插入分类数据出错: ".mysql_error()."</p>";
		return;
	}else {
		echo "<p class='info'>创建数据表 $table 成功!</p>";
	}
	
	$table = 'account';
	if(in_array($table,$tables)){
		echo "<p class='info'>表: $table 已存在!</p>";
	}else if(!mysql_query($account)){
		echo "<p class='error'>创建表 $table 出错: ".mysql_error()."</p>";
		return;
	}else {
		echo "<p class='info'>创建数据表 $table 成功!</p>";
	}
	
	$table = 'user';
	if(in_array($table,$tables)){
		echo "<p class='info'>表: $table 已存在!</p>";
	}else if(!mysql_query($user)){
		echo "<p class='error'>创建表 $table 出错: ".mysql_error()."</p>";
		return;
	}else if(!mysql_query($userData)){
		echo "<p class='error'>预插入用户数据出错: ".mysql_error()."</p>";
		return;
	}else {
		echo "<p class='info'>创建数据表 $table 成功!请登录后尽快修改帐号及密码!</p>";
	}
	
	echo '<p class="success">数据库初始化成功!<br/><br/>你现在可以开始使用了!</p><p class="success">点击<a href="./" >这里</a>回到首页</p>';
}else{
	echo '<p class="error">选择数据库出错!<br/>'.mysql_error().'</p>';
	return;
}
?>
</body>
</html>
