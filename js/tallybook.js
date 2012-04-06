/**
 * tallybook main js
 * @author azrael
 */


$(function(){
    
    var $container = $('#container'),
        $datepicker = $('#datepicker'),
        $pagination = $('#pagination'),
        $paginationLoading = $('#paginationLoading'),
        $dataLoading = $('#dataLoading'),
        $dialog = $('#dialog'),
        $bubbleTip = $('#bubbleTip'),
        $footer = $('#footer'),
        
        $bill = $('#bill'),
        $billTable = $('#billTable'),
        $billTbody = $('#billTbody'),
        $billTableLoading = $('#billTableLoading'),
    
        //表单及其标签
        $newAccountButton = $('#newAccountButton'),
        $accountForm = $('#accountForm'),
        $accountDate = $('#accountDate'),
        $accountAmount = $('#accountAmount'),
        $accountRemark = $('#accountRemark'),
        $accountFormTitle = $('#accountFormTitle'),
        $accountId = $('#accountId'),
        
        $accountInTypeDiv = $('#accountInTypeDiv'),
        $accountInTypeRadio = $('#accountInTypeRadio'),
        $accountInTypeSelect = $('#accountInTypeSelect'),
        $accountInTypeLoading = $('#accountInTypeLoading'),
        $newAccountInTypeButton = $('#newAccountInTypeButton'),
        
        $accountOutTypeDiv = $('#accountOutTypeDiv'),
        $accountOutTypeRadio = $('#accountOutTypeRadio'),
        $accountOutTypeSelect = $('#accountOutTypeSelect'),
        $accountOutTypeLoading = $('#accountOutTypeLoading'),
        $newAccountOutTypeButton = $('#newAccountOutTypeButton'),
        
        $accountTypeParent = $('#accountTypeParent'),
        $accountTypeName = $('#accountTypeName'),
        $accountTypeVer = $('#accountTypeVer'),
        $accountTypeAcceptButton = $('#accountTypeAcceptButton'),
        $accountTypeCancelButton = $('#accountTypeCancelButton'),
        $accountTypeForm = $('#accountTypeForm'),
        $customButtonContainer = $('#datepickerCustombtns'),
        $currentMonth = $('#currentMonth'),
        $showByMonthButton = $('#showByMonthButton');
    
    var CONST = {
        DATE_FORMAT: 'yyyy-MM-dd',
        AMOUNT_REGEX: /[\d\.]+/,
        DATE_REGEX: /\d{4}-\d{2}-\d{2}/,
        NUMBER_REGEX: /\d+/,
        GET_ACCOUNT_TYPE_URL: 'ajaxService/get-account-type.php',
        ADD_ACCOUNT_URL: 'ajaxService/add-account.php',
        EDIT_ACCOUNT_URL: 'ajaxService/edit-account.php',
        GET_ACCOUNT_LIST_URL: 'ajaxService/get-account-list.php',
        GET_ALL_ACCOUNT_LIST_URL: 'ajaxService/get-all-account-list.php',
        ADD_ACCOUNT_TYPE_URL: 'ajaxService/add-account-type.php',
        DEL_ACCOUNT_URL: 'ajaxService/del-account.php',
        GET_SINGLE_ACCOUNT_URL: 'ajaxService/get-account.php'
    };
    
    var firstLoad = true,
        reLoad = false,
        dataLoading,
        handlingSubmit = false,
        accountTypeActionSwitcher,
        accountTypeActionStateSwitcher,
        accountFormValidator,
        accountTypeFormValidator,
        topZindex = 10000,
        stopYearMonthEvent = false,
        showByMonth = false,
        currentYearMonth = [],
        showByMonthTipTimer,
        accountTypeStorage = {};
    
     /**
     * 根据id从accountTypeStorage中查找typeName
     */
    accountTypeStorage.findById = function(id){
        var t,r,arr = [this.inType,this.outType];
        for(var t in arr){
            for(var i in arr[t]){
                r = arr[t][i];
                if(i == id){
                    return r.name;
                }else if(r.children){
                    for(var c in r.children){
                        if(c == id){
                            return r.children[c].name;
                        }
                    }
                }
            }
        }
        return 'undefinded';
    };
    
    //*****************/
    //定义各种事件处理函数
    //*****************/
    var observer = {
        onDateSelect: function(dateText, instant){
            reLoad = true;
            stopYearMonthEvent = false;
            if(firstLoad){
                firstLoad = false;
                //给currentYearMonth赋初值
                currentYearMonth = dateText.format(CONST.DATE_FORMAT).split('-');
                $container.width(780);
                $datepicker.css('margin-left','220px');
                
                var animateOption = {
                    marginLeft: 0,
                    fontSize: '1em'
                };
                $datepicker.animate(animateOption, 500, function(){
                    $billTbody.empty();
                    $billTableLoading.show();
                    $bill.slideDown('normal',function(){
                        ajaxInteraction.loadAccountList(dateText,0,observer.onAccountListLoad);
                    });
                    $customButtonContainer.fadeIn();
                    
                });
            }else{
                $billTbody.empty();
                $billTableLoading.show();
                $pagination.hide();
                ajaxInteraction.loadAccountList(dateText,0,observer.onAccountListLoad);
            }
        },
        //改变年份,月份时触发的事件
        onChangeMonthYear: function(year, month, inst){
            currentYearMonth[0] = year;
            currentYearMonth[1] = month;
            if(showByMonth && !stopYearMonthEvent){
                $billTbody.empty();
                $billTableLoading.show();
                $paginationLoading.hide();
                ajaxInteraction.loadAllAccountList(year, month, observer.onMonthAccountListLoad);
            }
        },
        //帐目列表读取回调
        onAccountListLoad: function(data){
            if(data.success){
                $billTableLoading.hide();
                $paginationLoading.hide();
                $billTbody.empty();
                if(data.total){
                    var record, $tr, trInner;
                    for(var r=0; r<data.records.length; r++){
                        record = data.records[r];
				        $tr = $('<tr class="item">');
				        $tr.attr('id','account-item-'+record.id)
				            .attr('aid',record.id)
				            .attr('atype',record.accountType);
				        trInner = '<td class="index">'
				                + (r + 1)
				                + '.</td><td class="date">'
				                + record.addTime
				                + '</td><td class="in-out">'
				                + (record.accountType == 1 ? '收入' : '支出')
				                + '</td><td class="amount">'
				                + (record.accountType == 1 ? '＋' : '－')
				                + Number.format(record.amount, '#.00')
				                + '</td><td class="type">'
				                + record.categoryName
				                + '</td><td class="remark">'
				                + record.remark
				                + '</td><td class="action"><div><a action="edit" class="button account-edit" href="javascript:void(0);" title="修改"></a>'
				                + '<a action="del" class="button account-del" href="javascript:void(0);" title="删除"></a></div></td>'
				        $tr.html(trInner).appendTo($billTbody);
                    }
                }else{
                    var $tr = $('<tr class="empty"><td colspan="7"><span class="tip2">Sorry, “'
                            + data.date + '”当天没有收支记录.</span></td></tr>');
                    $billTbody.append($tr);
                }
                if(reLoad){
                    reLoad = false;
                    $pagination.pagination(data.total,configs.paginationOption);
                }
                if(data.total > configs.paginationOption.items_per_page){
                    $pagination.slideDown('slow');
                }
            }else{
                alert(data.code);
            }
        },
        paginationCallback: function(pageId, instant){
            if(pageId > 0){
                var date = $datepicker.datepicker('getDate');
                date = date.format(CONST.DATE_FORMAT);
                $paginationLoading.show();
                ajaxInteraction.loadAccountList(date,pageId - 1,observer.onAccountListLoad);
            }
        },
        
        //监听tbody的点击事件,并判断点击的是那个按钮,执行相应动作
        onBillTbodyClick: function(e){
            if(e.target.tagName.toLowerCase() == 'a'){
                if(dataLoading.isShow()){
                    return;
                }
                var $link = $(e.target);
                var $tr = $link.parent().parent().parent();
                var action = $link.attr('action');
                if(action == 'del'){//删除操作
	                $tr.css('background-color','#ffff00');
	                $dialog.html('<p>你确定要删除该记录?</p>');
	                $dialog.dialog({
	                    title: '提示',
	                    resizable: false,
	                    buttons: {
	                        '确定': function(){
	                            $dialog.dialog('close');
	                            var data = {
	                                id: $tr.attr('aid'),
	                                type: $tr.attr('atype')
	                            };
                                dataLoading.show();
	                            ajaxInteraction.delAccount(data,observer.onDelAccountSuccess);
	                        },
	                        '取消':function(){
	                            $dialog.dialog('close');
	                        }
	                    },
                        close: function(){
                            $tr.css('background-color','');
                        }
	                });
                }else if(action == 'edit'){
                    $tr.css('background-color','#ffff00');
                    var data = {
                        id: $tr.attr('aid'),
                        type: $tr.attr('atype')
                    };
                    dataLoading.show();
                    ajaxInteraction.getAccount(data,observer.onGetAccountSuccess);
                }
            }
        },
        onNewAccountButtonClick: function(){
            handlingSubmit = false;
            
            accountFormValidator.resetForm();
            dataLoading.hide();
            
            $accountInTypeSelect.empty();
            $accountOutTypeSelect.empty();
            
            accountTypeActionStateSwitcher.enableAll();
            
            accountTypeActionSwitcher.switchTo('out');
            
            ajaxInteraction.loadAccountType(observer.onAccountTypeLoad);
            $accountDate.val($datepicker.datepicker('getDate').format(CONST.DATE_FORMAT));
            $accountId.val('');
            $accountForm.setDialogTitle('新增收支记录');
            $accountForm.dialog('open');   
            
            $accountAmount.focus();
        },
        //帐目类型加载成功回调
        onAccountTypeLoad: function(data){
            if(data.success){
                accountTypeStorage.inType = data.inType,
                accountTypeStorage.outType = data.outType;
                drawAccountTypeList(accountTypeStorage);
            }else{
                alert(data.code);
            }
        },
        onAccountRemarkKeydown: function(e){
            if(e.keyCode == 13){
                $accountForm.submit();
            }
        },
        onAddAccountSuccess: function(data){
            dataLoading.hide();
            if(data.success){
                $dialog.html('<p>添加成功!</p>');
                $dialog.dialog({
                    title: '提示',
                    resizable: false,
                    buttons: {
                        '确定': function(){
//                            accountFormValidator.resetForm();
//                            $accountDate.val(new Date().format(CONST.DATE_FORMAT));
                            $dialog.dialog('close');
//                            $accountForm.dialog('close');
//                            $accountForm.dialog('enable');
                            handlingSubmit = false;
                            
                            //定位到帐目产生那天,并更新列表
                            stopYearMonthEvent = true;
                            $datepicker.datepicker('setDate',data.date);
                            observer.onDateSelect.call($datepicker.get(0),data.date);
                            $accountForm.dialog('close');
                        },
                        '继续添加': function(){
//                            accountFormValidator.resetForm();
//                            $accountDate.val(new Date().format(CONST.DATE_FORMAT));
                            $accountAmount.val('');
                            $accountRemark.val('');
                            $dialog.dialog('close');
//                            $accountForm.dialog('close');
//                            $accountForm.dialog('enable');
                            handlingSubmit = false;
                            $accountAmount.focus();
                        }
                    }
                });
            }else{
                alert(data.code);
                handlingSubmit = false;
            }
        },
        
        onNewAccountTypeButtonClick: function(e){
            //判断是哪种类型的添加事件
            var type = e.data.type;
            if($accountTypeForm.bubble('isShow') && $accountTypeVer.val() == type){
                $accountTypeName.val('').focus();
                return;
            }
            var options = '<option  selected="selected" value="0">顶级</option>';
            var $this = $(this);
            if(type == 'in'){
                var types = accountTypeStorage.inType;
                for(var t in types){
	                options += '<option value="'+types[t].id+'">'+types[t].name+'</option>';
	            }
                $accountTypeVer.val(1);
            }else if(type == 'out'){
                var types = accountTypeStorage.outType;
                for(var t in types){
                    options += '<option value="'+types[t].id+'">'+types[t].name+'</option>';
	            }
	            $accountTypeVer.val(0);
            }else{
                alert('onNewAccountTypeButtonClick - Error');
                return;
            }
            $accountTypeParent.html(options);
            $accountForm.dialog('disable');
            $accountTypeForm.bubble('show',$(this));
            $accountTypeName.val('').focus();
        },
        //添加类型的回调
        onAddAccountTypeSuccess: function(data){
           
            if(data.success){
                var typeArr,$typeSelect;
                if(~~data.type){
                    typeArr = accountTypeStorage.inType;
                    $typeSelect = $accountInTypeSelect;
                }else{
                    typeArr = accountTypeStorage.outType;
                    $typeSelect = $accountOutTypeSelect;
                }
                if(~~data.parent){
                    if(!typeArr[data.parent].children){
                        typeArr[data.parent].children = {};
                    }
                    typeArr[data.parent].children[data.id] = {id:data.id,name:data.name};
                    
                    var option = '<option parent="'+data.parent+'" value="'+data.id+'">&nbsp;&nbsp;&nbsp;&nbsp;'+data.name+'</option>'
                    var lastOption = $typeSelect.find('option[parent="'+data.parent+'"]:last');
                    if(lastOption.length < 1){//父类没有子类
                        lastOption = $typeSelect.find('option[value="'+data.parent+'"]');
                    }
                    lastOption.after(option);
                    
                    $typeSelect.val(data.id);
                }else{
                    typeArr[data.id] = {id:data.id,name:data.name};
                    var option = '<option value="'+data.id+'">'+data.name+'</option>'
                    $typeSelect.append(option);
                    $typeSelect.val(data.id);
                }
                var type = ~~data.type ? 'in' : 'out';
                accountTypeActionStateSwitcher.get(type).disable();
            }else{
                accountTypeActionStateSwitcher.disableAll();
                
                alert(data.code);
            }
        },
        onDelAccountSuccess: function(data){
            dataLoading.hide();
            if(data.success){
                var $tr = $('#account-item-'+data.id);
                $tr.fadeOut('slow',function(){$tr.remove();});
            }else{
                alert(data.code);
            }
        },
        onGetAccountSuccess: function(data){
            if(data.success){
                var record = data.records;
                accountFormValidator.resetForm();
                $accountForm.setDialogTitle('编辑收支记录');
                var $targetSelect = $accountOutTypeSelect;
                var type = 'out';
                if(~~record.accountType){//data.accountType == 1收入
                    type = 'in';
                    $targetSelect = $accountInTypeSelect;
                    $accountInTypeRadio.attr('checked','checked');
                }
                $targetSelect.html('<option selected="selected" value="'+record.categoryId+'">'+record.categoryName+'</option>');
                $accountDate.val(record.addTime);
                $accountAmount.val(Number.format(record.amount, '#.00'));
                $accountRemark.val(record.remark);
                $accountId.val(record.id);
                accountTypeActionSwitcher.switchTo(type);
                ajaxInteraction.loadAccountType(observer.onAccountTypeLoad);
                var $tr = $('#account-item-'+record.id);
                $accountForm.onCloseCallbacks.push(function(){
                    $tr.css('background-color','');
                });
	            $accountForm.dialog('open');
                dataLoading.hide();
            }else{
                dataLoading.hide();
                alert(data.code);
            }
        },
        onEditAccountSuccess: function(data){
            if(data.success){
                var record = data.record;
                var categoryName = accountTypeStorage.findById(record.categoryId);
                var $tr = $('#account-item-'+record.id);
				// if($datepicker.datepicker('getDate').format(CONST.DATE_FORMAT) == record.addTime){
					$tr.attr('atype',record.accountType);
					$tr.children('.date').text(record.addTime);
					$tr.children('.in-out').text((~~record.accountType ? '收入' : '支出'));
					$tr.children('.amount').text((~~record.accountType ? '＋' : '－') + Number.format(record.amount, '#.00'));
					$tr.children('.type').text(categoryName);
					$tr.children('.remark').text(record.remark);
				// }else{
					// $tr.remove();
					// /*定位到帐目产生那天,并更新列表*/
					// $datepicker.datepicker('setDate',data.date);
					// observer.onDateSelect.call($datepicker.get(0),data.date);
				// }
                $accountForm.dialog('close');
                dataLoading.hide();
            }else{
                dataLoading.hide();
                alert(data.code);
            }
        },
		//********************
		// 显示当月记录
		//********************
        onCurrentMonthButtonClick: function(){
            $billTbody.empty();
            $billTableLoading.show();
            $paginationLoading.hide();
            ajaxInteraction.loadAllAccountList(currentYearMonth[0], currentYearMonth[1], observer.onMonthAccountListLoad);
        },
        onShowByMonthButtonMouseEnter: function(){
            var $this = $(this);
            //延时300毫秒再显示
            showByMonthTipTimer = setTimeout(function(){
                $bubbleTip.bubble('setHtml','<div style="width: 150px;padding: 5px 8px;">启用该设置后，切换月份时将显示当月所有收支记录。</div>');
                $bubbleTip.bubble('show', $this);
            }, 300);
        },
        onShowByMonthButtonMouseLeave: function(){
            if(showByMonthTipTimer){
                clearTimeout(showByMonthTipTimer);
            }
            $bubbleTip.bubble('hide');
        },
        onShowByMonthButtonClick: function(){
            if(this.checked){
                showByMonth = true;
//                observer.onCurrentMonthButtonClick();
            }else{
                showByMonth = false;
            }
        },
		onMonthAccountListLoad: function(data){
			if(data.success){
                $billTableLoading.hide();
                $billTbody.empty();
                if(data.total){
                    var record, outCount = 0, inCount = 0, $tr, trInner, cls;
                    for(var r = 0, len = data.records.length; r < len; r++){
                        record = data.records[r];
                        if(~~record.accountType){
                            cls = 'in';
                            inCount += parseFloat(record.amount);
                        }else{
                            cls = 'out';
                            outCount += parseFloat(record.amount);
                        }
				        $tr = $('<tr class="item ' + cls + '">');
				        $tr.attr('id','account-item-'+record.id)
				            .attr('aid',record.id)
				            .attr('atype',record.accountType);
				        trInner = '<td class="index">'
				                + (r + 1)
				                + '.</td><td class="date">'
				                + record.addTime
				                + '</td><td class="in-out">'
				                + (record.accountType == 1 ? '收入' : '支出')
				                + '</td><td class="amount">'
				                + (record.accountType == 1 ? '＋' : '－')
				                + Number.format(record.amount, '#.00')
				                + '</td><td class="type">'
				                + record.categoryName
				                + '</td><td class="remark">'
				                + record.remark
				                + '</td><td class="action"><div><a action="edit" class="button account-edit" href="javascript:void(0);" title="修改"></a>'
				                + '<a action="del" class="button account-del" href="javascript:void(0);" title="删除"></a></div></td>'
				        $tr.html(trInner).appendTo($billTbody);
                    }
                    var $tr = $('<tr class="total"><td colspan="7"><span class="tip3">总收入：￥'
							+ inCount.format('#.00')
							+ '</span>　<span class="tip3">总支出：￥'
                            + outCount.format('#.00') + '</span>　<span class="tip3">结算：￥'
                            + (inCount - outCount).format('#.00') + '</span></td></tr>');
                    $billTbody.append($tr);
                    
                    
                    
                }else{
                    var $tr = $('<tr class="empty"><td colspan="7"><span class="tip2">Sorry, '
                            + data.year + '年' + data.month + '月' + '没有收支记录.</span></td></tr>');
                    $billTbody.append($tr);
                }
            }else{
                alert(data.code);
            }
		},
        
        emptyFunc: function(){
		}
    };
    
    var drawAccountTypeList = function(data){
        var $option = '',
            inType = data.inType,it;
        for(var i in inType){
            it = inType[i];
            $option += '<option value="'+it.id+'">'+it.name+'</option>';
            if(it.children){
                for(var c in it.children){
                    var child = it.children;
                    $option += '<option parent="'+it.id+'" value="'+child[c].id+'">&nbsp;&nbsp;&nbsp;&nbsp;'+child[c].name+'</option>';
                }
            }
        }
        var orginalValue = $accountInTypeSelect.val();
        $accountInTypeSelect.html($option);
        if(orginalValue){//还原之前的选择
            $accountInTypeSelect.val(orginalValue);
        }
        
        var outType = data.outType,ot;
        $option = '';
        for(var o in outType){
            ot = outType[o];
            $option += '<option value="'+ot.id+'">'+ot.name+'</option>';
            if(ot.children){
                for(var c in ot.children){
                    var child = ot.children;
                    $option += '<option parent="'+ot.id+'" value="'+child[c].id+'">&nbsp;&nbsp;&nbsp;&nbsp;'+child[c].name+'</option>';
                }
            }
        }
        orginalValue = $accountOutTypeSelect.val();
        $accountOutTypeSelect.html($option);
        if(orginalValue){//还原之前的选择
            $accountOutTypeSelect.val(orginalValue);
        }
        $accountInTypeLoading.hide();
        $newAccountInTypeButton.show();
        $accountOutTypeLoading.hide();
        $newAccountOutTypeButton.show();
    };
    
    //*****************/
    //各种事件ajax请求
    //*****************/
    var ajaxInteraction = {
        loadAccountList: function(date,page,callback){
            var itemsPerPage = configs.paginationOption.items_per_page;
            if(page < 0){
                page = 0;
            }
            var start = page * itemsPerPage;
            var data = {
                date: date,
                start: start,
                count: itemsPerPage
            };
            $.post(CONST.GET_ACCOUNT_LIST_URL,data,callback);
        },
        loadAllAccountList: function(year, month,callback){
            var data = {
                year: year,
                month: month
            };
            $.post(CONST.GET_ALL_ACCOUNT_LIST_URL,data,callback);
        },
        loadAccountType: function(callback){
//            if(accountTypeStorage.inType && accountTypeStorage.outType){
//                drawAccountTypeList(accountTypeStorage);
//            }else{
                $.post(CONST.GET_ACCOUNT_TYPE_URL,callback);
//            }
        },

        addNewAccount: function(data,callback){
            $.post(CONST.ADD_ACCOUNT_URL,data,callback);
        },
        addNewAccountType: function(data,callback){
            $.post(CONST.ADD_ACCOUNT_TYPE_URL,data,callback);
        },
        delAccount: function(data,callback){
            $.post(CONST.DEL_ACCOUNT_URL,data,callback);
        },
        getAccount: function(data,callback){
            $.post(CONST.GET_SINGLE_ACCOUNT_URL,data,callback);
        }
        
    };
   
    //*****************/
    var configs = {
        mainDateOption: {
            showButtonPanel: true,
            onSelect: observer.onDateSelect,
            onChangeMonthYear: observer.onChangeMonthYear
        },
        paginationOption: {
            items_per_page:10,
            num_display_entries:5,
            num_edge_entries:2,
            current_page:0,
            callback:observer.paginationCallback
        },
        accountFormDialogOption: {
            autoOpen: false,
            height: 300,
            width: 390,
            modal: true,
            resizable: false,
            show: 'fade',
            hide: 'fade',
            buttons: {
                '确定': function(){
                    $accountForm.submit();      
                },
                '取消': function() {
                    $accountForm.dialog('close');
                }
            },
            close: function(){
                $accountTypeForm.bubble('hide');
                dataLoading.hide();
                accountTypeActionSwitcher.disableAll();
                if($accountForm.onCloseCallbacks && $accountForm.onCloseCallbacks.length){
                    //关闭窗口回调,执行之后就删除
                    var callbacks = $accountForm.onCloseCallbacks;
                    while(callback = callbacks.shift()){
                        callback.call(this);
                    }
                }
                handlingSubmit = false;
            }
        },
        accountDateOption: {
            showOn: 'button',
            showAnim: 'drop',
            buttonImage: 'images/calendar.png',
            buttonImageOnly: true
        }
    };
	
    //*****************/
    //初始化代码
    //*****************/
	dataLoading = new $.Loading($dataLoading, $container);
	
    accountTypeActionSwitcher = new $.Switcher();
    accountTypeActionSwitcher.add({
        id: 'in',
        trigger: $accountInTypeRadio,
        enable: function(){
            $accountInTypeDiv.removeClass('disable');
            $accountInTypeSelect.attr('disabled','');
	        $newAccountInTypeButton.bind('click',{type:'in'},observer.onNewAccountTypeButtonClick);
        },
        disable: function(){
            $accountInTypeDiv.addClass('disable');
            $accountInTypeSelect.attr('disabled','disabled');
            $newAccountInTypeButton.unbind('click',observer.onNewAccountTypeButtonClick);
        }
    });
    accountTypeActionSwitcher.add({
        id: 'out',
        trigger: $accountOutTypeRadio,
        enable: function(){
            $accountOutTypeDiv.removeClass('disable');
            $accountOutTypeSelect.attr('disabled','');
            $newAccountOutTypeButton.bind('click',{type:'out'},observer.onNewAccountTypeButtonClick);
        },
        disable: function(){
            $accountOutTypeDiv.addClass('disable');
            $accountOutTypeSelect.attr('disabled','disabled');
            $newAccountOutTypeButton.unbind('click',observer.onNewAccountTypeButtonClick);
        }
    });
    accountTypeActionSwitcher.init();
    
    accountTypeActionStateSwitcher =  new $.Switcher();
    accountTypeActionStateSwitcher.add({
        id: 'in',
        enable: function(){
            $accountInTypeSelect.attr('disabled','disabled');
            $accountInTypeLoading.show();
            $newAccountInTypeButton.hide();
        },
        disable: function(){
            $accountInTypeSelect.attr('disabled','');
            $accountInTypeLoading.hide();
            $newAccountInTypeButton.show();
        }
    });
    accountTypeActionStateSwitcher.add({
        id: 'out',
        enable: function(){
            $accountOutTypeSelect.attr('disabled','disabled');
            $accountOutTypeLoading.show();
            $newAccountOutTypeButton.hide();
        },
        disable: function(){
            $accountOutTypeSelect.attr('disabled','');
            $accountOutTypeLoading.hide();
            $newAccountOutTypeButton.show();
        }
    });
    accountTypeActionStateSwitcher.init();
    
    
    $newAccountButton.click(observer.onNewAccountButtonClick);
    $accountForm.dialog(configs.accountFormDialogOption);
    $accountRemark.keydown(observer.onAccountRemarkKeydown);
    $accountForm.dialogTitle = $('#ui-dialog-title-accountForm');
    $accountForm.setDialogTitle = function(title){
        $accountForm.dialogTitle.html(title);
        $accountFormTitle.html(title);
    };
    $accountForm.onCloseCallbacks = [];
    $accountDate.datepicker(configs.accountDateOption);
    
    accountFormValidator = $accountForm.validate({
            submitHandler: function(form) {
                if(handlingSubmit){
                    return;
                }
                handlingSubmit = true;
                dataLoading.show($accountForm);
                
                if($accountId.val()){//id存在,是编辑
                    $accountForm.ajaxSubmit({
                        url: CONST.EDIT_ACCOUNT_URL,
                        type: 'post',
                        success: observer.onEditAccountSuccess
                    });
                }else{
	                $accountForm.ajaxSubmit({
	                    url: CONST.ADD_ACCOUNT_URL,
	                    type: 'post',
	                    success: observer.onAddAccountSuccess
	                });
                }
            },
            messages: {
	            amount: {
	                max: '你有那么多钱么'
	            }
	        }
        });
    
    accountTypeFormValidator = $accountTypeForm.validate({
        submitHandler: function(form) {
            
            $accountTypeForm.ajaxSubmit({
                url: CONST.ADD_ACCOUNT_TYPE_URL,
                type: 'post',
                success: observer.onAddAccountTypeSuccess
            });
        }
    });
    $accountTypeForm.bubble({
        style: {
            'z-index': topZindex
        },
        className: 'border3 corner5',
        position: 'top right'
    });
    $accountTypeAcceptButton.click(function(){
        var type = ~~$accountTypeVer.val() ? 'in' : 'out';
        accountTypeActionStateSwitcher.get(type).enable();
        $accountTypeForm.submit();
        $accountTypeForm.bubble('hide');
        $accountForm.dialog('enable');
    });
    $accountTypeCancelButton.click(function(){
        $accountTypeForm.bubble('hide');
        $accountForm.dialog('enable');
    });
    $accountTypeName.keydown(function(e){
        if(e.keyCode == 13){
            $accountTypeAcceptButton.click();
        }
    });
    $bubbleTip.bubble({
        style: {
            'z-index': topZindex + 1
        },
        className: 'border3 corner5',
        position: 'top left'
    });
    //绑定点击事件,监听修改/删除等按钮的点击
    $billTbody.click(observer.onBillTbodyClick);
    
    $currentMonth.button().click(observer.onCurrentMonthButtonClick);
	$showByMonthButton.attr('checked', false);
    $showByMonthButton.button().button('widget')
                .hover(observer.onShowByMonthButtonMouseEnter, observer.onShowByMonthButtonMouseLeave);
	$showByMonthButton.change(observer.onShowByMonthButtonClick);
	
	/*********初始化效果**********/
    $datepicker.datepicker(configs.mainDateOption);
    
    $container.fadeIn('slow',function(){
        $(document.body).removeClass('bodyLoading');
        $footer.slideDown('slow');
    });
	
    /*$('#tallyMenu a').button();
    
    var $controlArea = $('#tallyMenu');
    var $controlButtons = $('#tallyMenu li');
    var rectArr = [];
    $controlButtons.each(function(i, o){
        var $this =$(this);
        rectArr.push([$this.width()+2, $this.height()+2, $this])
    });
    var randomPosition = new RandomPosition(rectArr, [$controlArea.width(), $controlArea.height()]);
    randomPosition.start(function(result){
        $(result).each(function(){
            this.getData().css({
                left: this.getX1(),
                top: this.getY1()
            });
        });
    }); */
});