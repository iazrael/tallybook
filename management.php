<?php
    require_once('consts.php');
	require_once('check-login.php');
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>My Tally Management</title>
	<link rel="stylesheet" href="http://static.imatlas.com/jquery/jquery.ui.1.8.5.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/management.css" type="text/css" media="screen" />
</head>
<body class="bodyLoading">
<div id="container" class="clearfix">
	<div id="header"><h1>My Tally Management<span class="version">V0.3 beta</span></h1></div>
	<div id="tabsContainer">
        <ul>
            <li><a href="#categoryTab" name="category">分类管理</a></li>
            <li><a href="#otherTab" name="other">More</a></li>
        </ul>
        <div id="categoryTab" class="clearfix">
            <div class="category-control-panel corner5 border4">
                <input type="checkbox" id="autoSaveButton" checked="" /><label for="autoSaveButton">Auto Save Sort</label>
                <button type="button" id="saveSortButton">Save Sort</button>
                <span id="saveCateSortLoading" class="loading1"></span>
                <span id="saveCateSortTip" class="tip1"></span>
            </div>
            <ul id="incomeCateContainer" class="cate-container border7 corner5 " name="income"></ul>
            <ul id="outgoCateContainer" class="cate-container border7 corner5 " name="outgo"></ul>
        </div>
        <div id="otherTab">
            <h1>More...</h1>
        </div>
    </div>
	<div id="footer" class="hide">Copyright &copy; 2011 <a href="http://www.imatlas.com">imatlas.com</a> | Designed by <a href="http://www.imatlas.com">Atlas</a></div>
	
    <div id="tallyMenuContainer" class="tally-menu-container">
        <ul id="tallyMenu" class="tally-menu clearfix">
            <li><a href="./">记录</a></li>
            <li><a href="./statistics.php">统计</a></li>
            <li><a href="./management.php">管理</a></li>
            <!-- <li><a href="javascript:void(0);">账户</a></li>
            <li><a href="javascript:void(0);">设置</a></li> -->
        </ul>
        <div class="tally-menu-trigger"></div>
    </div>

</div>
    <script src="http://static.imatlas.com/jquery/jquery-1.6.4.js"></script>
    <script src="http://static.imatlas.com/jquery/jquery.ui.1.8.5.min.js"></script>

	<script output="js/management.all.js" src="js/az.core.js"></script>
	<script output="js/management.all.js" src="js/az.json.js"></script>
	<script output="js/management.all.js" src="js/jquery.center.js"></script>
	<script output="js/management.all.js" src="js/common.js"></script>
	<script output="js/management.all.js" src="js/management.js"></script>
</body>
</html>