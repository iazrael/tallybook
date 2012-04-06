/**
 * 对 jq 的 datepicker 进行扩展和修改, 以适应tallybook的需求
 * @author azrael , 2010-11-21
 */
(function($){
    $.extend($.datepicker, {
        //修改 currentDay link 执行的操作
        _gotoToday: function(id){
            var target = $(id);
            var inst = this._getInst(target[0]);
            if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
                inst.selectedDay = inst.currentDay;
                inst.drawMonth = inst.selectedMonth = inst.currentMonth;
                inst.drawYear = inst.selectedYear = inst.currentYear;
            }
            else {
                var date = new Date();
                inst.selectedDay = date.getDate();
                inst.drawMonth = inst.selectedMonth = date.getMonth();
                inst.drawYear = inst.selectedYear = date.getFullYear();
            }
            //不触发 YearMonthChange 事件,改为触发DateSelect事件
            //this._notifyChange(inst);
            this._selectDate(target);
            this._adjustDate(target);
        }
    });
})(jQuery);

