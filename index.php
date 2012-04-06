<?php
    require_once('consts.php');
	require_once('check-login.php');
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>My Tally Book</title>
	<link rel="stylesheet" href="css/jquery.ui.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/tallybook.css" type="text/css" media="screen" />
</head>
<body class="bodyLoading">
<div id="container" class="clearfix">
	<div id="header"><h1>My Tally Book<span class="version">V1.9</span></h1></div>
	<div id="datepicker">
	   <div id="datepickerCustombtns" class="ui-datepicker-buttonpane-custombtns"><button id="currentMonth">当月</button></button><input type="checkbox" id="showByMonthButton" /><label for="showByMonthButton">按月显示</label></div>
	</div>
	<div id="bill" class="corner5 border3">
        <table id="billTable" class="border1" cellpadding="0" cellspacing="0" border="0">
            <thead>
                <tr class="header"><th class="index"><a name="billTableHeader"></a></th><th class="date">日期</th><th class="in-out">收支</th><th class="amount">金额</th><th class="type">分类</th><th class="remark">备注</th><th class="action"><a id="newAccountButton" href="javascript:void(0);"><span class="button account-add"></span>新记录</a></th></tr>  
            </thead>
            <tbody id="billTbody">
                <!--<tr class="item" id="account-item-123" aid="123" atype="0"><td class="index">6.</td><td class="date">2010-10-19</td><td class="in-out">支出</td><td class="amount">￥ 553</td><td class="type">水电煤气</td><td class="remark">好贵</td><td class="action"><div><a title="修改" href="javascript:void(0);" class="button account-edit" action="edit"></a><a title="删除" href="javascript:void(0);" class="button account-del" action="del"></a></div></td></tr>-->      
            </tbody>
            <tfoot>
                <tr id="billTableLoading" ><td colspan="7"><span class="loading1"></span></td></tr>
            </tfoot>
        </table>
        <div id="pagination" class="pagination"></div><span id="paginationLoading" class="loading1"></span>
    </div>
	<div class="clearfix"></div>
	<div id="footer" class="hide">Copyright &copy; 2011 <a href="http://www.imatlas.com">imatlas.com</a> | Designed by <a href="http://www.imatlas.com">Atlas</a></div>
	<div id="dataLoading" class="loading2"></div>
	
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

<form id="accountForm" title="新增收支记录" >
	<fieldset class="border1">
		<legend id="accountFormTitle">新增收支记录</legend>
		<div class="row"><label for="accountDate" class="label"><span class="tip1">*</span>收支日期：</label>
			<input id="accountDate" name="date" type="text" class="border3 required date" readonly="readonly" tabindex="1"/>
			<input id="accountId" name="id" type="hidden" />
		</div>
		<div id="accountType" class="row"><label class="label column"><span class="tip1">*</span>收支项目：</label>
			<div class="column">
				<div id="accountInTypeDiv" class="disable row" ><label><input type="radio" id="accountInTypeRadio" name="type" value="1" tabindex="2"/>收入：</label>
					<select id="accountInTypeSelect" name="typeValue" class="border3 required" disabled="disabled"></select><span id="accountInTypeLoading" class="loading1"></span>
					<a id="newAccountInTypeButton" class="hide" href="javascript:void(0);" title="新增收入项目"><span class="button account-add"></span>新增</a>
				</div>
				<div id="accountOutTypeDiv" class="row"><label><input type="radio" id="accountOutTypeRadio" name="type" value="0" checked="checked"  tabindex="3"/>支出：</label>
					<select id="accountOutTypeSelect" name="typeValue" class="border3 required"></select><span id="accountOutTypeLoading" class="loading1"></span>
					<a id="newAccountOutTypeButton" class="hide" href="javascript:void(0);" title="新增支出项目"><span class="button account-add"></span>新增</a>
				</div>
			</div>
		</div>
		<div class="row"><label for="accountAmount" class="label"><span class="tip1">*</span>金额：</label>
			<input id="accountAmount" name="amount" type="text" class="border3 required number" tabindex="4" max="20000"/> 元
		</div>
		<div class="row"><label for="accountRemark" class="label">说明：</label>
			<input id="accountRemark" name="remark" type="text" class="border3" tabindex="5" maxlength="200"/>
		</div>
	</fieldset>
</form>

<form id="accountTypeForm" style="display: none;">
	<fieldset class="border0">
		<div class="row"><label for="accountTypeName"><span class="tip1">*</span>名称：</label>
			<input id="accountTypeName" name="name" type="text" class="border3 required" tabindex="1" maxlength="10"/>
			<input id="accountTypeVer" name="type" type="hidden" value="" />
		</div>
		<div class="row"><label for="accountTypeParent"><span class="tip1">*</span>从属于：</label>
			<select id="accountTypeParent" name="parent" class="border3 required"></select>
			<a id="accountTypeAcceptButton" href="javascript:void(0);">添加</a><a id="accountTypeCancelButton" href="javascript:void(0);">取消</a>
		</div>
	</fieldset>
</form>

<div id="dialog" title="dialog"></div>

<div id="bubbleTip"></div>

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery.ui.min.js"></script>
	<script type="text/javascript" src="js/jquery.plugin.js"></script>
	<script type="text/javascript" src="js/tallybook.all.js"></script>
</body>
</html>