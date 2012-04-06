/**
 * az framework core
 * @author azrael
 */

(function(){
    
    var frameworkName = 'az',
        frameworkContext;
    
    /**
     * 创建一个名字空间, 如果存在则不作任何操作
     * @param {String} name 名字空间必须以字母或下划线开头, 每个名字空间之间只能有一个点号
     * @return {Object}
     */
    var namespace = function(name){
        var spacePattern = /^([a-zA-Z_]+\w*)+(\.([a-zA-Z_]+\w*))*$/;
        if(!spacePattern.test(name)){
            throw new Error('the namespace\'s value is not correct!');
        }
        var names = name.split('.');
        var space = window, n;
        for(var i = 0, len = names.length; i < len; i++){
            n = names[i];
            (!space[n]) && (space[n] = {});
            space = space[n];
        }
        return space;
    }
    
    /**
     * 创建一个模块
     * @param {String} name 模块名称
     * @param {Function} func 模块的构造函数, 为空则创建一个空模块
     */
    var module = function(name, func){
        //如果模块名字中没有点号'.', 则直接实例化func
        //如果有点号, 说明改模块是属于名字空间的, 先创建名字空间(如果不存在的话)
        var n, m, index = name.lastIndexOf('.');
        func = func || function(){};
        if(index === -1){
            n = window;
            m = name;
        }else{
            n = name.slice(0, index);
            m = name.slice(index + 1);
            n = namespace(n);
        }
        var context = (this === window) ? namespace(frameworkName) : this;
        n[m] = new func(this);
    }
    
    //创建库的顶级名字空间
    frameworkContext = namespace(frameworkName);
    
    frameworkContext.namespace = namespace;
    frameworkContext.module = module;
    
})();