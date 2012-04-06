-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	6.0.4-alpha-community


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema tally_book
--

CREATE DATABASE IF NOT EXISTS tally_book;
USE tally_book;

--
-- Definition of table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryId` int(10) unsigned DEFAULT NULL COMMENT '账单种类',
  `remark` varchar(200) DEFAULT NULL,
  `addTime` date NOT NULL COMMENT '录入时间',
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `type` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '账单类型:0:支出/1:收入',
  PRIMARY KEY (`id`),
  KEY `FK_account_category` (`categoryId`),
  CONSTRAINT `FK_account_category` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--


--
-- Definition of table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `parentId` int(10) unsigned DEFAULT NULL,
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `type` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '种类类型:0,支出/1:收入',
  PRIMARY KEY (`id`),
  KEY `FK_category_parent` (`parentId`),
  CONSTRAINT `FK_category_parent` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`id`,`name`,`parentId`,`createTime`,`updateTime`,`type`) VALUES 
 (1,'饮食',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (2,'零食/水果',1,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (3,'工作就餐',1,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (4,'聚餐请客',1,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (5,'日常开支',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (6,'房租物业',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (7,'水电煤气',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (8,'生活用品',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (9,'休闲娱乐',5,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (10,'债务',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (11,'借款',10,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (12,'还款',10,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (13,'服装美容',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (14,'衣服',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (15,'鞋类',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (16,'护肤品',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (17,'理发',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (18,'其他',13,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (19,'通讯费',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (20,'手机费',19,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (21,'上网费',19,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (22,'医疗费用',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (23,'看病',22,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (24,'买药',22,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (25,'电子产品',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (26,'电脑/配件',25,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (27,'移动电话',25,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (28,'交通费',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (29,'旅游',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (30,'书籍',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (31,'礼品',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (32,'其他支出',NULL,'2010-10-13 22:50:02','2010-10-13 22:50:02',0),
 (33,'虚拟物品',25,'2010-10-14 21:38:54','2010-10-14 21:38:54',0),
 (34,'买菜',1,'2010-10-16 13:17:54','2010-10-16 13:17:54',0),
 (35,'公用费用',5,'2010-10-16 13:18:46','2010-10-16 13:18:46',0),
 (36,'工资',NULL,'2010-10-13 22:49:56','2010-10-13 22:49:56',1),
 (37,'奖金',NULL,'2010-10-13 22:49:56','2010-10-13 22:49:56',1),
 (38,'兼职',NULL,'2010-10-13 22:49:56','2010-10-13 22:49:56',1),
 (39,'其他',NULL,'2010-10-13 22:49:56','2010-10-13 22:49:56',1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
