/**
 * tallybook management js
 * @author azrael
 */

jQuery(function($){
    var $container = $('#container'),
        $footer = $('#footer'),
        $tabsContainer = $('#tabsContainer');

//-------------------------------------------------------------        
// 各种模块定义
//-------------------------------------------------------------        
    az.namespace('management');        
    az.module('management.category', function(z){
        var $outgoCateContainer = $('#outgoCateContainer'),
            $incomeCateContainer = $('#incomeCateContainer'),
            $saveSortButton = $('#saveSortButton'),
            $autoSaveButton = $('#autoSaveButton'),
            $saveSortLoading = $('#saveCateSortLoading'),
            $saveCateSortTip = $('#saveCateSortTip');
        
        var CONST = {
            GET_CATEGORY_DATA_URL: 'ajaxService/get-account-type.php',
            EDIT_BATCH_CATEGORY_URL: 'ajaxService/edit-batch-account-type.php'
        }
        
        var dataIsLoaded = false,
            autoSaveCateSort = false;
        
        var observer = {
            onAutoSaveButtonChange: function(){
                if(this.checked){
                    autoSaveCateSort = true;
                    $saveSortButton.hide();
                }else{
                    autoSaveCateSort = false;
                    $saveSortButton.show();
                }
            },
            onSaveSortButtonClick: function(){
                saveCateSequence([$outgoCateContainer, $incomeCateContainer]);
            },
            onCateContainerClick: function(e){
                if(e.target.tagName === 'A'){
                    e.preventDefault();
                    var cmd = e.target.getAttribute('name');
                    cmd && executeCommand(e.target, cmd);
                }
            },
            onCateSortStop: function(event, ui){
                var item = ui.item;
                var $correctParent = (item.attr('name') === 'outgo') ? $outgoCateContainer : $incomeCateContainer;
                if(item.attr('hasChildren') === '1'){
                    if(item.parent().get(0) !== $correctParent.get(0)){//嵌套的情况, 取消这次排序
                        $correctParent.sortable('cancel');
                        return;
                    }
                }
                if(autoSaveCateSort){
                    saveCateSequence([$correctParent]);
                }
            },
            onCategoryDataLoad: function(data){
                if(data.success){
                    dataIsLoaded = true;
                    drawCategory(data);
                }else{
                    alert(data.code);
                }
            },
            onBatchEditCategorySuccess: function(data){
                $saveSortLoading.hide();
                if(data.success){
                    if(data.failureIds.length === 0){
                        $saveCateSortTip.text('保存成功');
                    }else{
                        $saveCateSortTip.text('以下分类保存失败: ' +　JSON.stringify(data.failureIds));
                    }
                    $.timerShow($saveCateSortTip);
                }else{
                    alert(data.code);
                }
            }
            
        };
        
        var drawCategory = function(data){
            createCategoryList($incomeCateContainer, data.inType, 'income');
            createCategoryList($outgoCateContainer, data.outType, 'outgo');
        };
        
        var getButtonsHtml = function(buttonType){
            var buttonsHtml = '<div class="cate-item-actions">' +
                    (buttonType ? '<a href="###" class="cate-button cate-show-sub" name="showSub" title="显示子分类">显示子分类</a>' : '') +
                    '<a href="###" class="cate-button cate-edit" name="edit" title="编辑">编辑</a>' +
                    '<a href="###" class="cate-button cate-del" name="del" title="删除">删除</a></div>';
            return buttonsHtml;
        };
        
        var createCategoryList = function($cateContainer, data, flag){
            var optionHtml = '', ot;
            
            for(var o in data){
                ot = data[o];
                if(ot.children){
                    var children = ot.children;
                    optionHtml += '<li id="cate-' + ot.id +'" cid="' + ot.id +'" name="' + flag + '" hasChildren="1" class="cate-item subcate-container-item border1">' + ot.name + getButtonsHtml(true)
                            + '<ul class="subcate-container ">';
                    for(var c in children){
                        optionHtml += '<li id="cate-' + children[c].id +'" cid="' + children[c].id +'" name="' + flag + '"  class="cate-item border1">' + children[c].name + getButtonsHtml() + '</li>';
                    }
                    optionHtml += '</ul></li>';
                }else{
                    optionHtml += '<li id="cate-' + ot.id +'" cid="' + ot.id +'" name="' + flag + '" class="cate-item border1">' + ot.name + getButtonsHtml() + '</li>';
                }
            }
            $cateContainer.html(optionHtml);
            $cateContainer.sortable({
                distance: 5,
                items: 'li',
                placeholder: 'cate-item-highlight',
                revert: 'invalid',
                stop: observer.onCateSortStop
            });
        };
        
        var executeCommand = function(ele, cmd){
            var li = ele;
            while(li.tagName !== 'LI'){
                li = li.parentNode;
            }
            var id = li.getAttribute('cid');
            switch(cmd){
                case 'showSub':
                    $(ele).toggleClass('cate-hide-sub');
                    $(li).children('ul').toggle();
                    break;
                case 'edit':
                    break;
                case 'del':
                    break;
                default:
                    break;
            }
        };
        
        /**
         * 保存排序结果到后台
         */
        var saveCateSequence = function($cateContainers){
            $saveSortLoading.css('display', 'inline-block');
            $.timerHide($saveCateSortTip);
            var sequence = [];
            for(var i = 0, ilen = $cateContainers.length; i < ilen; i++){
                var children = $cateContainers[i].children();
                for(var c = 0, len = children.length; c < len; c++){
                    var $item = $(children[c]);
                    var item = {
                        id: Number($item.attr('cid')), 
                        index: len - c
                    };
                    sequence.push(item);
                    if($item.attr('hasChildren') === '1'){
                        var subChildren = $item.children('ul').children();
                        var subSequence = item.children = [];
                        for(var s = 0, slen = subChildren.length; s < slen; s++){
                            subSequence.push({
                                id: Number(subChildren[s].getAttribute('cid')), 
                                index: slen - s
                            });
                        }
                    }
                }
            }
            var param = {
                sequence: JSON.stringify(sequence)
            };
            $.post(CONST.EDIT_BATCH_CATEGORY_URL, param, observer.onBatchEditCategorySuccess)
        };
        
        this.load = function(){
            if(!dataIsLoaded){
                $.post(CONST.GET_CATEGORY_DATA_URL, observer.onCategoryDataLoad);
            }
        }
        
        $autoSaveButton.attr('checked', false);
        
        $saveSortButton.button();
        $autoSaveButton.button();
        
        $autoSaveButton.change(observer.onAutoSaveButtonChange);
        $saveSortButton.click(observer.onSaveSortButtonClick);
        $incomeCateContainer.click(observer.onCateContainerClick);
        $outgoCateContainer.click(observer.onCateContainerClick);
    });
    
    var observer = {
        onTabSelected: function(event, ui){
            var type = ui.tab.getAttribute('name');
            management[type] && management[type].load();
        }
    };
    
    $tabsContainer.tabs({
        selected: -1,
        select: observer.onTabSelected
    });
        
    $container.fadeIn('slow', function(){
        $(document.body).removeClass('bodyLoading');
        $footer.slideDown('slow', function(){
            $tabsContainer.tabs('select', 0);
        });
    });
});