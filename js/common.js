/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
	/*
	 * eg:format="yyyy-MM-dd hh:mm:ss";
	 */
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
			// millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
				- RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1
					? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/**
 * 格式化数字
 */
Number.prototype.format = function(pattern){
	var strarr = this.toString().split('.');
	var fmtarr = pattern ? pattern.split('.') : [''];
	var retstr='';

	// 整数部分
	var str = strarr[0];
	var fmt = fmtarr[0];
	var i = str.length-1;  
	var comma = false;
	for(var f=fmt.length-1;f>=0;f--){
		switch(fmt.substr(f,1)){
			case '#':
				if(i>=0 ) retstr = str.substr(i--,1) + retstr;
				break;
			case '0':
				if(i>=0){
					retstr = str.substr(i--,1) + retstr;
				}
				else {
					retstr = '0' + retstr;
				}
				break;
			case ',':
				comma = true;
				retstr=','+retstr;
				break;
		}
	}
	if(i>=0){
		if(comma){
			var l = str.length;
			for(;i>=0;i--){
				retstr = str.substr(i,1) + retstr;
				if(i>0 && ((l-i)%3)==0){
					retstr = ',' + retstr;
				}
			}
		}
		else{
			retstr = str.substr(0,i+1) + retstr;
		}
	}
	retstr = retstr+'.';
	// 处理小数部分
	str=strarr.length>1?strarr[1]:'';
	fmt=fmtarr.length>1?fmtarr[1]:'';
	i=0;
	for(var f=0;f<fmt.length;f++){
		switch(fmt.substr(f,1)){
		case '#':
			if(i<str.length){
				retstr+=str.substr(i++,1);
			}
			break;
		case '0':
			if(i<str.length){
				retstr+= str.substr(i++,1);
			}
			else retstr+='0';
			break;
		}
	}
	return retstr.replace(/^,+/,'').replace(/\.$/,'');
}
Number.format = function(num, pattern){
	num = Number(num);
	return num.format(pattern);
}

/**
 * 由一个数字计算出小于它且大于等于0的整形数组
 * @return {Array} 返回结果数组
 */
Number.prototype.toLessArray = function(){
    var arr = [], i = 0;
    do{
        arr.push(i);
    }while(++i < this);
    return arr;
}
/**
 * 由一个数字计算出小于它且大于等于0的整形数组
 * @param {Integer} num
 * @return {Array}
 */
Number.toLessArray = function(num){
    return Number(num).toLessArray();
}
/**
 * 
 * 由给定数组,计算出最大值和最小值返回
 * @param {Array} array
 * @return {Object} 返回最大最小值组成的对象,{max,min}
 */
Number.getMaxMin = function(array){
    var max = 0, min = 0, len = array.length;
    if(len > 0){
        min = array[0];
        for(var i = 0; i < len; i++){
            if(array[i] > max){
                max = array[i];
            }else if(array[i] < min){
                min = array[i];
            }
        }
    }
    return {max: max,min: min};
}
/**
 * 字符串格式函数
 * 
 * @Example var a = "I Love {0}, and You Love {1},Where are {0}! {4}";
 *          alert(String.format(a, "You","Me")); alert(a.format("You","Me"));
 */
// V1 method
String.prototype.format = function()
{
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,               
        function(m,i){
            return args[i];
        });
}
// V2 static
String.format = function() {
    if( arguments.length == 0 )
        return null;
    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}


/**
 * 矩形类
 */
function Rect(x, y, w, h, data){
    this.getX1 = function(){
        return x;
    };
    this.getY1 = function(){
        return y;
    };
    this.setX1 = function(newX){
        x = newX;
    };
    this.setY1 = function(newY){
        y = newY;
    };
    this.getWidth = function(){
        return w;
    };
    this.getHeight = function(){
        return h;  
    };
    this.getX2 = function(){
        return this.getX1() + this.getWidth();  
    };
    this.getY2 = function(){
        return this.getY1() + this.getHeight();  
    };
    this.getData = function(){
        return data;  
    };
};
/**
 * 判断举行是否相交
 * @param {Rect} other
 */
Rect.prototype.isCross = function(other){
    var maxMinX = Number.getMaxMin([this.getX1(), this.getX2(), other.getX1(), other.getX2()]);
    var maxMinY = Number.getMaxMin([this.getY1(), this.getY2(), other.getY1(), other.getY2()]);
    
    var widthX = Math.abs(maxMinX.max - maxMinX.min);
    var width = this.getWidth() + other.getWidth();
    
    var heightY = Math.abs(maxMinY.max - maxMinY.min);
    var height = this.getHeight() + other.getHeight();
    if(width < widthX || height < heightY){
        return false;
    }
    return true;
};
/**
 * @return {String}
 */
Rect.prototype.toString = function(){
    var string = 'x: '+this.getX1()+', y: '+this.getY1()+', w: '+this.getWidth()+', h: '+this.getHeight();
    return string;
};
/**
 * 把N个矩形在一个固定大小的画布中随机定位且不重叠<br/>
 * 也可能得不到结果
 * @class RandomPosition
 * @name RandomPosition
 * @param {Array} rectArr 矩形的数组, 每个数组对象包含矩形宽高(w,h)
 * @param {Array} canvasSize 画布的大小,[0,1]
 * @param {Integer} tryCount 计算每个矩形尝试次数,默认1000次
 * @example TODO
 */
function RandomPosition(rectArr, canvasSize, tryCount){
    this._rectArr = rectArr;
    this._canvasSize = canvasSize;
    this._tryCount = tryCount || 1000;
    this._result = [];
    this._continue = true;
}
RandomPosition.prototype.randomPosition = function(){
    return [Math.ceil(Math.random() * this._canvasSize[0]) % this._canvasSize[0], Math.ceil(Math.random() * this._canvasSize[0]) % this._canvasSize[1]];
};
/**
 * 
 * @param {Rect} rect
 */
RandomPosition.prototype.isAnyCross = function(rect){
    for(var i in this._rectArr){
        if(this._result[i].isCross(rect)){
            return true;
        }
    }
    return false;
};
/**
 * 执行位置运算, 该方法使用setTimeout(func, 0)的方式异步执行,因此没有返回值<br/>
 * 要取得结果,请使用getResult方法
 */
RandomPosition.prototype.calculate = function(){
    var result = this._result = [];
    var source = this._rectArr;
    var size = this._canvasSize;
    //预处理数据
    var rect, oldRect, x, y, w, h, maxY = 0;
    for(var i = 0, len = source.length; i < len; i++){
        w = source[i][0];
        h = source[i][1];
        if(oldRect){
            x = oldRect.getX1() + oldRect.getWidth();
            y = 0;
            if(maxY < oldRect.getY2()){
                maxY = oldRect.getY2();
            }
        }else{
            x = y = 0;
        }
        if(x + w > size[0]){
            x = 0;
            y = maxY;
        }
        rect = new Rect(x, y, w, h, source[i][2]);
        oldRect = rect;
        result.push(rect);
    }
    var total = result.length, count = total - 1, pos, currRect, newRect, tryCount = 0, isTimeout = false;
    while(this._continue && count >= 0){
        currRect = result[count];
        isTimeout = false;
        do{
            pos = this.randomPosition();
            if(tryCount++ > this._tryCount){
                this.out('RandomPosition timeout - currentPos: ' + pos);
                count--;
                isTimeout = true;
                break;
            }
        }while(this._continue && (pos[0] + currRect.getWidth() >= size[0] || pos[1] + currRect.getHeight() >= size[1]));
        if(isTimeout){
            continue;
        }
        newRect = new Rect(pos[0], pos[1], currRect.getWidth(), currRect.getHeight());
        if(this.isAnyCross(newRect)){
            continue;
        }else{
            currRect.setX1(pos[0]);
            currRect.setY1(pos[1]);
            count--;
        }
    }
//    if(this._timer){
//        this.out('RandomPosition timer clear');
//        clearTimeout(this._timer);
//    }
    if(this._callback){
        this.out('RandomPosition get the result');
        this._callback.call(this, this.getResult());
    }
};

/**
 * 开始计算
 * @param {Function} callback
 */
RandomPosition.prototype.start = function(callback){
    this._continue = true;
    this._callback = callback;
    var that = this;
//    this._timer = setTimeout(function(){
//        that.out('RandomPosition timeout.');
//        that.abort();
//        if(that._callback){
//            that._callback.call(that, that.getResult());
//        }
//    }, this._timeout * 1000);
//    setTimeout(function(){
        that.calculate();    
//    }, 0);
};
/**
 * 中断计算的执行<br/>
 * 用于防止calculate耗时太长
 */
RandomPosition.prototype.abort = function(){
    this._continue = false;
    if(this._timer){
        clearTimeout(this._timer);
    }
};

/**
 * 中断calculate的执行(如果有的话)<br/>
 * 并返回当前结果
 * @return {Array} 结果坐标数组
 */
RandomPosition.prototype.getResult = function(){
    this.abort();
    return this._result;
};
/**
 *
 * @param {String} msg
 */
RandomPosition.prototype.out = function(msg){
    // if(console && console.log){
        // console.log(msg);
        // this.out = console.log;
    // }
};

/**
 * 把重复的切换操作简单化
 */
(function($){
	/**
	 * 工具类,用于在几个状态之间转换 暂时只支持两个状态
	 * 
	 * @param {}
	 *            opt { triggerEvent:'',default:click }
	 */
	var Switcher = function(opt){
        opt = opt || {};
	    this._arr = {};
        this._event = opt.triggerEvent || 'click';
	}
	/**
	 * 添加之后必须调用init方法
	 * 
	 * @param {}
	 *            opt {id:'',trigger:obj,enable:function(){},disable:function{}}
	 */
	Switcher.prototype.add = function(opt){
	    this._arr[opt.id] = opt;
	}  
    /**
	 * 初始化swticher,必须在使用前调用
	 */
    Switcher.prototype.init = function(){
        for(var i in this._arr){
            var s = this._arr[i];
            if(s.trigger){
	            s.trigger.bind(this._event,{switcher:this,id:s.id},function(e){
	                e.data.switcher.switchTo(e.data.id);
	            });
            }
        }
    }
	/**
	 * 转换到目标状态
	 * 
	 * @param {}
	 *            id,状态id
	 */
	Switcher.prototype.switchTo = function(id){
	    for(var i in this._arr){
	        var s = this._arr[i];
	        if(i == id){
	            s.enable();
	        }else{
	            s.disable();
	        }
	    }
	}
	/**
	 * enable所有状态
	 */
	Switcher.prototype.enableAll = function(){
	    for(var i in this._arr){
	        var s = this._arr[i];
	        s.enable();
	    }
	}
	
	/**
	 * disable所有状态
	 */
	Switcher.prototype.disableAll = function(){
	    for(var i in this._arr){
	        var s = this._arr[i];
	        s.disable();
	    }
	}
    /**
	 * 根据id获取一个状态对象
	 * 
	 * @param string
	 *            id
	 */
	Switcher.prototype.get = function(id){
	     return this._arr[id];
	}
    
    $.Switcher = Switcher;
})(jQuery);

/**
 * 带有指向的弹出框
 */
(function($){
    /**
	 * 
	 * @param {}
	 *            opt,bubble 配置
	 */
    var Bubble = function(opt){
        var $container = $('<div class="bubble-container"></div>');
        var $pointer = $('<span class="bubble-arrow-pointer"></span>');
        var $body = $(opt.content);
        $container.append($pointer);
        $container.append($body);
        $body.css('dispaly', 'inline').show();
        
        var pointerPos = opt.position.split(' ');
        $pointer.css(pointerPos[0],'-10px');
        $pointer.css(pointerPos[1],'10px');
        if(opt.style){
            $container.css(opt.style);
        }
        if(opt.className){
            $container.addClass(opt.className);
        }
        $container.hide();
        $(document.body).append($container);
        
        this._container = $container;
        this._pointer = $pointer;
        this._body = $body;
        this._position = opt.position;
        this._defaultTarget = opt.defaultTarget;
    }
    /**
	 * 显示bubble
	 */
    Bubble.prototype.show = function($target){
        $target = $target || this._defaultTarget || null;
        if($target){
            var targetOffset = $target.offset(),
                $container = this._container,
                postions = this._position.split(' '),
                top = '50%',
                left = '50%';
                
            this._pointer.addClass('bubble-arrow-pointer-'+postions[0]);
            
            switch(postions[0]){
                case 'top':
                    top = targetOffset.top + $target.height() + 10;
                    break;
                case 'bottom':
                    top = targetOffset.top - $container.height() - 10;
                    break;
                case 'left':
                    left = targetOffset.left + $target.width() + 10;
                    break;
                case 'right':
                    left = targetOffset.left - $container.width() - 10;
                    break;
                default:
                    break;
            }
            
            switch(postions[1]){
                case 'top':
                    top = targetOffset.top - 10;
                    break;
                case 'bottom':
                    top = targetOffset.top - $container.height() + $target.height() / 2 + 20;
                    break;
                case 'left':
                    left = targetOffset.left + $target.width() / 2 - 20;
                    break;
                case 'right':
                    left = targetOffset.left - $container.width() + $target.width() / 2 + 20;
                    break;
                default:
                    break;
            }

            $container.css({
                top: top,
                left: left
            });
        }
        
        this._container.show();

    }
    /**
	 * 隐藏bubble
	 */
    Bubble.prototype.hide = function(){
        this._container.hide();
    }
    /**
	 * bubble是否隐藏
	 */
    Bubble.prototype.isShow = function(){
        return this._container.css('display') !== 'none';
    }
    /**
     * 设置bubble的内容
     */
    Bubble.prototype.setHtml = function(html){
    	this._body.html(html);
    }
    /**
     * 设置箭头的指示方向
     */
    Bubble.prototype.setPosition = function(_position){
    	this._position = _position;
    }
    
    /**
	 * @param ()
	 *            opt,初始化bubble的配置 { position:top left;目前只支持top/bottm
	 *            left;top/bottm right }
	 */
    $.fn.bubble = function(opt,args){
        if(typeof(opt) == 'object'){
            var $this = $(this);
            var bubble = $this.data('bubble');
            if(bubble){
                return bubble;
            }
            if(opt.position){
                var pos = opt.position.split(' ');
                if(pos.length < 2){
                    pos = pos[0];
                    if(pos == 'top' || pos == 'bottom'){
                        opt.position += ' right';
                    }else{
                         opt.position = 'top' + opt.position;
                    }
                }
            }else{
                opt.position = 'top right';
            }
            opt.content = opt.content || $this;
            bubble = new Bubble(opt);
            $this.data('bubble',bubble);
            return bubble;
        }else if(typeof(opt) == 'string'){
            var bubble = $(this).data('bubble');
            if(bubble){
                bubble[opt](args);
            }else{
                throw 'bubble: havn\'t init!';
            }
        }else{
            throw 'bubble: argument error!';
        }
    }
})(jQuery);

/**
 * loading的封装类, 依赖 jquery.center
 */
(function($){
    var Loading = function(loadingEl, defaultTarget){
        this._loadingEl = loadingEl;
        this._defaultTarget = defaultTarget;
    };
    Loading.prototype.isShow = function(){
        return this._loadingEl.css('display') != 'none';
    };
    Loading.prototype.show = function(target){
        target = target || this._defaultTarget;
        this._loadingEl.appendTo(target)
            .center().show();
    };
    Loading.prototype.hide = function(){
        this._loadingEl.hide();
    };

    $.Loading = Loading;
    
})(jQuery);

/**
 * 把一个element显示出来, 并在timeout之后隐藏
 * 如果在timeout之内再次显示, 则重新计算timeout
 */
(function($){
    /**
     * @param {JQueryObject} el
     * @param {Int} timeout 超时时间, 默认3000
     */
    var timerShow = function(el, timeout){
        timeout = timeout || 3000;
        if(el.__timer){
            clearTimeout(el.__timer);
        }
        var timerShowTimout = function(){
            el.__timer = null;
            el.hide();
        }
        el.show();
        el.__timer = setTimeout(timerShowTimout, timeout);
    };
    
    var timerHide = function(el){
        if(el.__timer){
            clearTimeout(el.__timer);
        }
        el.hide();
    };
    
    $.timerShow = timerShow;
    $.timerHide = timerHide;
    
})(jQuery);

