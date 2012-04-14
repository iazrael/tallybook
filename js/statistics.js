/**
 * tallybook statistics js
 * @author azrael
 */


$(function(){
    
    var $container = $('#container'),
        $tabsContainer = $('#tabsContainer'),
        $dataLoading = $('#dataLoading'),
        $footer = $('#footer'),
        $bubbleTip = $('#bubbleTip'),
        
        $chartContainers = $('.chartcontainer'),
        $tabsCustombtns = $('#tabsCustombtns'),
        $gobackButton = $('#gobackButton'),
        $chartTip = $('#chartTip'),
        
        $startYear = $('#chartStartYear'),
        $endYear = $('#chartEndYear'),
        $startMonth = $('#chartStartMonth'),
        $endMonth = $('#chartEndMonth'),
        $chartDrawBtn = $('#chartDrawBtn'),
        
        $listAllCateButton = $('#listAllCateButton'),
        $statisTypeLoading = $('#statisTypeLoading'),
        $cateContainer = $('#cateContainer'),
        $selectedCateContainer = $('#selectedCateContainer'),
        
        $statisSumExpend = $('#statisSumExpend'),
        $statisSumEarning = $('#statisSumEarning'),
        $statisSumSurplus = $('#statisSumSurplus'),
        $statisSumLoading = $('#statisSumLoading')
        ;
    
    var CONST = {
        YEARS: [2010, 2012],
        MONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        CHART_PREFIX: 'chartcontainer-',
        GET_IO_TYPE_URL: 'ajaxService/get-account-type.php',
        GET_STATIS_BY_TYPE_URL: 'ajaxService/get-statis-by-type.php',
        GET_ACCOUNT_STATIS_URL: 'ajaxService/get-account-statis.php',
        GET_ACCOUNT_SUMMARY_URL: 'ajaxService/get-account-summary.php'
    };
    
    var dataLoading,
        accountDataIsLoading = false,
        drawCharBtnClicked = false,
        loadingChartType,
        ioTypeCache,
        bubbleTipTimeout,
        topZindex = 10000;
    
    //*****************/
    //定义各种事件处理函数
    //*****************/
    var observer = {
        onTabSelected: function(event, ui){
            loadingChartType = ui.tab.getAttribute('name');
            $chartContainers.hide();
            if(bubbleTipTimeout){
                clearTimeout(bubbleTipTimeout);
            }
            $bubbleTip.bubble('setHtml','<div style="width: 100px;padding: 5px 8px;">click me to start !</div>');
            $bubbleTip.bubble('show', $chartDrawBtn);
            bubbleTipTimeout = setTimeout(function(){
                $bubbleTip.bubble('hide');
            }, 3000);
//            dataLoading.show($tabsContainer);
//            loadChartData();
        },
        onIoTypeDataLoad: function(data){
            $statisTypeLoading.hide();
            if(data.success){
                ioTypeCache = {
                    '1': data.inType,
                    '0': data.outType
                }
                drawIoType();
            }else{
                alert(data.code);
            }
        },
        onAccountDataLoad: function(data){
            accountDataIsLoading = false;
            if(data.success){
                dataLoading.hide();
                var id = CONST.CHART_PREFIX + loadingChartType;
                drawChart(id, loadingChartType, data);
            }else{
                alert(data.code);
            }
        },
        onListAllCateButtonClick: function(){
            if(!ioTypeCache){
                $statisTypeLoading.show();
                ajaxInteraction.loadIoTypeData();
            }else{
                $cateContainer.slideDown();
            }
        },
        onLoadDataButtonClick: function(){
//            drawCharBtnClicked = true;
            hideTips();
            var startYear = $startYear.val(),
                endYear = $endYear.val(),
                startMonth = $startMonth.val(),
                endMonth = $endMonth.val();
            var start = startYear + startMonth;
            var end = endYear + endMonth;
            if(~~start > ~~end){
                showTips('结束月份必须大于等于开始月份!');
                return;
            }
            var param = {
                startYear: startYear,
                endYear: endYear,
                startMonth: startMonth,
                endMonth: endMonth
            };
            if(loadingChartType === 'bar'){
                var typeArr = [];
                $selectedCateContainer.children().each(function(i, item){
                    typeArr.push(item.getAttribute('value'));
                });
                if(!typeArr){
                    showTips('请至少选择一个分类!');
                    return;
                }
                param.cate = '[' + typeArr + ']';
            }
            loadChartData(param);
        },
        onSummaryDataLoad: function(data){
            $statisSumLoading.hide();
            if(data.success){
                drawSummaryData(data);
            }else{
                alert(data.code);
            }
        },
        onCategoryStatisDataLoad: function(data){
            accountDataIsLoading = false;
            if(data.success){
                dataLoading.hide();
                var id = CONST.CHART_PREFIX + loadingChartType;
                drawChart(id, loadingChartType, data);
            }else{
                alert(data.code);
            }
        }
    };
    
    //*****************/
    //各种事件ajax请求
    //*****************/
    var ajaxInteraction = {
        loadIoTypeData: function(){
            $.post(CONST.GET_IO_TYPE_URL, observer.onIoTypeDataLoad);
        },
        loadAccountData: function(data){
            $.post(CONST.GET_ACCOUNT_STATIS_URL, data, observer.onAccountDataLoad);
        },
        loadSummaryData: function(){
            $.post(CONST.GET_ACCOUNT_SUMMARY_URL, observer.onSummaryDataLoad);
        },
        loadCategoryStatisData: function(data){
            $.post(CONST.GET_STATIS_BY_TYPE_URL, data, observer.onCategoryStatisDataLoad);
        }
    };
    
    //*****************/
    //配置
    //*****************/
    var configs = {
        tabsConfig: {
            selected: -1,
            select: observer.onTabSelected
        }
    };
    
    var loadSummaryData = function(){
        ajaxInteraction.loadSummaryData();
    };
    var drawSummaryData = function(data){
        var records = data.records;
        var outgo = Number.format(records['out'] || 0, '#.00'),
            income = Number.format(records['in'] || 0, '#.00'),
            surplus = Number.format(income - outgo, '#.00');
        $statisSumExpend.text(outgo);
        $statisSumEarning.text(income);
        $statisSumSurplus.text(surplus);
//        if(!drawCharBtnClicked){
//            $chartDrawBtn.click();
//        }
    };
    var loadChartData = function(param){
        if(accountDataIsLoading){//已经有请求正在进行中
            return;
        }
        dataLoading.show($tabsContainer);
        accountDataIsLoading = true;
        if(loadingChartType === 'line'){
            ajaxInteraction.loadAccountData(param);
        }else if(loadingChartType === 'bar'){
            ajaxInteraction.loadCategoryStatisData(param);
        }
    };
    var drawIoType = function(){
        if(!ioTypeCache){
            return;
        }
        var itemsHtml = '', it, types;
        for(var i in ioTypeCache){
            types = ioTypeCache[i];
            for(var t in types){
                it = types[t];
                itemsHtml += '<span class="cate-item border1" value="'+it.id+'">'+it.name+'</span>';
            }
        }
        $cateContainer.html(itemsHtml);
        
        $('.cate-container').sortable({
            connectWith: '.cate-container',
            items: '.cate-item',
            revert: 'invalid'
        });
        
        $cateContainer.slideDown();
    };
    //*****************/
    //画图表方法
    //*****************/
    var drawChart = function(id, type, data){
        $.jqplot.config.enablePlugins = true;
        switch(type){
            case 'line':
                drawLineChart(id, data);
                break;
            case 'bar':
                drawBarChart(id, data);
                break;
            case 'pie':
                drawPieChart(id, data);
                break;
            default:
                break;
        }
        
    };
    var drawLineChart = function(id, data){
        var $chart = $('#'+id),
            records = data.records;
        var drawData = [], drawLabel = [];
        if(records['out']){
            drawData.push(records['out']);
            drawLabel.push({label: '支出'});
        }
        if(records['in']){
            drawData.push(records['in']);
            drawLabel.push({label: '收入'});
        }
        if(drawData.length == 0){
            showTips(data.params[0] + '至' + data.params[1] + '没有收支数据');
            $chart.hide();
            return;
        }
        $chart.empty().height('500px').width('100%').show();
        var yLimit = findMaxMin(drawData);
        var maxY = Math.floor(yLimit[0] / 1000) * 1000 + 2000;
        var minY = Math.floor(yLimit[1] / 1000) * 1000;
        $.jqplot(id, drawData, {
            title: data.params[0] + '至' + data.params[1] + '收支趋势图',
            legend: {show:true, location: 'ne'},
            axes:{
                xaxis:{
                    min:1, 
                    max:12, 
                    renderer: $.jqplot.CategoryAxisRenderer//,
                   // ticks: CONST.MONTHS
                },
                yaxis:{
                    min: minY,
                    max: maxY,
                    tickInterval: 1000,
                    tickOptions: {
                       formatString: '$%.2f'
                    }
                }
            },
            series:drawLabel,
            seriesDefaults:{
                renderer:$.jqplot.LineRenderer,
                pointLabels: { 
                    formatString: '%.2f',
                    show: true 
                }
            },
            highlighter: {
                showTooltip: false
//                sizeAdjust: 10,
//                tooltipLocation: 'n',
//                tooltipAxes: 'y',
//                useAxesFormatters: false,
//                tooltipFormatString: '%.2f'
           }
        });
    };
    var drawBarChart = function(id, data){
        var $chart = $('#'+id),
            records = data.records;
        var drawData = [], drawLabel = [];
        for(var i in records){
            drawData.push(records[i]);
            drawLabel.push({label: i});
        }
        if(drawData.length == 0){
            showTips('所选择的分类没有收支数据');
            $chart.hide();
            return;
        }
        $chart.empty().height('400px').width('100%').show();
        var yLimit = findMaxMin(drawData);
        var maxY = Math.floor(yLimit[0] / 200) * 200 + 200;
        var minY = Math.floor(yLimit[1] / 200) * 200;
        $.jqplot(id, drawData, {
            title: data.params[0] + '至' + data.params[1] + '收支分类比较图',
            axes:{
                xaxis:{
                    min:1, 
                    max:12, 
                    renderer: $.jqplot.CategoryAxisRenderer
                },
                yaxis:{
                    min: minY, 
                    max: maxY,
                    tickInterval: 100,
                    tickOptions: {
                       formatString: '$%.2f'
                    }
                }
            },
            legend: {show:true, location: 'ne'},
            series: drawLabel,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: { 
                    formatString: '%.2f',
                    show: true 
                }
            },
            highlighter: { show: false }
        });
    };
    var drawPieChart = function(id, data){
        var $chart = $('#'+id);
        var drawData = [], drawLabel = [];
        if(data['out']){
            drawData.push(data['out']);
            drawLabel.push({label: '支出'});
        }
//        if(data['in']){
//            drawData.push(data['in']);
//            drawLabel.push({label: '收入'});
//        }
        if(drawData.length == 0){
            showTips(data.params[0] + '至' + data.params[1] + '没有收支数据');
            $chart.hide();
            return;
        }
        $chart.empty().height('300px').width('100%').show();
        $.jqplot(id, drawData, {
            title: data.params[0] + '至' + data.params[1] + '支出饼图',
            seriesDefaults:{
                renderer:$.jqplot.PieRenderer,
                pointLabels: { 
                    formatString: '%.2f',
                    show: true 
                }
            },
            highlighter: { show: false }
        });
    };
    //*****************/
    //工具方法
    //*****************/
    var getFillArrayKey = function(o){
        return o[0];
    };
    var fillArray = function(array, getKeyFunc){
        if(array.length == 12){
            return array;
        }
        for(var start = 1, end = 12; start <= end; start++){
            var a = array[start - 1];
            if(a){
                if(getKeyFunc(a) == start){
                    continue;
                }else{
                    var differ = getKeyFunc(a) - start;
                    for(var d = 0; d < differ; d++){
                        array.splice(start + d - 1, 0, [start + d, 0]);
                    }
                }
            }else{
                array.splice(start - 1, 0, [start, 0]);
            }
        }
        return array;
    };
    var numberSortFuncton = function(a, b){
        if(~~a < ~~b){
            return 1;
        }else{
            return -1;
        }
    };
    var findMaxMin = function(arr){
        var arrStr = arr.toString().replace(/\d+\-\d+,?/g,'');
        arr = arrStr.split(',');
        arr.sort(numberSortFuncton);
        return [arr[0], arr[arr.length-1]];
    };
    var showTips = function(text){
        $chartTip.text(text);
        $chartTip.show();
    };
    var hideTips = function(){
        $chartTip.hide();
    };
    //*************************
    // 初始化代码
    //*************************
    
    dataLoading = new $.Loading($dataLoading, $container);
    $bubbleTip.bubble({
        style: {
            'z-index': topZindex + 1
        },
        className: 'border3 corner5',
        position: 'top left'
    });
    
    $tabsContainer.tabs(configs.tabsConfig);
    $gobackButton.button();
    $chartDrawBtn.button().click(observer.onLoadDataButtonClick);
    $startYear.change(function(){
        var selectedValue = this.value;
        $endYear.empty();
        for(var y = selectedValue, end = CONST.YEARS[1]; y <= end; y++){
            $endYear.append('<option value="' + y + '">' + y + '</option>')
        }
    });
    for(var y = CONST.YEARS[0], end = CONST.YEARS[1]; y <= end; y++){
        $startYear.append('<option value="' + y + '">' + y + '</option>')
        $endYear.append('<option value="' + y + '">' + y + '</option>')
    }
    for(var m = 0; m < CONST.MONTHS.length; m++){
        $startMonth.append('<option value="' + (m + 1) + '">' + CONST.MONTHS[m] + '</option>')
        $endMonth.append('<option value="' + (m + 1) + '">' + CONST.MONTHS[m] + '</option>')
    }
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    $endYear.val(nowYear);
    $endMonth.val(nowMonth);
    $startYear.val(nowYear - 1);
    $startMonth.val(nowMonth);
    
    $listAllCateButton.button().click(observer.onListAllCateButtonClick);
    
    var onInitReady = function(){
        setTimeout(loadSummaryData, 500);
//        loadIoTypeData();
    };
    $container.fadeIn('slow',function(){
        $(document.body).removeClass('bodyLoading');
        $footer.slideDown('slow', onInitReady);
        $tabsCustombtns.fadeIn();
        $tabsContainer.tabs('select', 0);
    });
});