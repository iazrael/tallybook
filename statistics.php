<?php
    require_once('consts.php');
	require_once('check-login.php');
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>My Tally Statistics</title>
	<link rel="stylesheet" href="css/jquery.ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/jquery.jqplot.min.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/statistics.css" type="text/css" media="screen" />
</head>
<body class="bodyLoading">
<div id="container" class="clearfix">
	<div id="header"><h1>My Tally Statistics<span class="version">V1.6</span></h1></div>
	<div id="tabsContainer">
	    <ul>
	        <li><a href="#tabs-1" name="line">收支趋势</a></li>
	        <li><a href="#tabs-2" name="bar">分类比较</a></li>
	        <li><a href="#tabs-3" name="pie">圆饼图</a></li>
	    </ul>
	    <div id="tabsCustombtns" class="ui-tabs-nav-custombtns"><a id="gobackButton" href="./">返回</a></div>
	    <div class="statis-sum-panel border6 corner5">
	       <span>Totally Expend: </span>$<span id="statisSumExpend" class="statis-sum-item">0</span><span class="statis-sum-separator">|</span>
	       <span>Totally Earning: </span>$<span id="statisSumEarning" class="statis-sum-item">0</span><span class="statis-sum-separator">|</span>
	       <span>Surplus: </span>$<span id="statisSumSurplus" class="statis-sum-item">0</span>
	       <span id="statisSumLoading" class="loading1"></span> 
        </div>
	    <div class="chart-control-panel border4 corner5">
	       <div class="chart-control-row chart-range">Range: <select id="chartStartYear"></select> / <select id="chartStartMonth"></select> <span> ~ </span>
	           <select id="chartEndYear"></select> / <select id="chartEndMonth"></select>
	       </div>
	       <div class="chart-control-row chart-io-type clearfix">
	           <label class="cate-label">Type: </label>
	           <div id="selectedCateContainer" class="cate-container selected-cates border7 corner5 clearfix"></div>
	           <button id="listAllCateButton" type="button">List Categorys</button>
	           <span id="statisTypeLoading" class="loading1"></span>
	           <div id="cateContainer" class="cate-container candidate-cates border7 corner5 clearfix"></div>
	           <!--<select id="chartIoType"><option value="0" selected="selected">支出</option><option value="1">收入</option></select> / 
	           <select id="chartSubType" multiple="multiple"></select> 
	       --></div>
	       <button id="chartDrawBtn" class="chart-control-draw-button">draw it!</button>   
        </div>
        <div id="chartTip" style="display: none;" class="chart-tip tip2 border5 corner5"></div>
	    <div id="tabs-1">
	       <div id="chartcontainer-line" class="chartcontainer"></div>
	    </div>
	    <div id="tabs-2">
	       <div id="chartcontainer-bar" class="chartcontainer"></div>
	    </div>
	    <div id="tabs-3">
	       <div id="chartcontainer-pie" class="chartcontainer"></div>
	    </div>
	</div>
	<div id="footer" class="hide">Copyright &copy; 2011 <a href="http://www.imatlas.com">imatlas.com</a> | Designed by <a href="http://www.imatlas.com">Atlas</a></div>
	<div id="dataLoading" class="loading2"></div>
	<div id="bubbleTip"></div>
	
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

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery.ui.min.js"></script>
	<script type="text/javascript" src="js/jquery.jqplot.min.js"></script>
	<script type="text/javascript" src="js/statistics.all.js"></script>
</body>
</html>