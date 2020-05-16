
/*
 * Date Utilities
 * Author: Sarkuya
 * Date: 2020/04/30
 * 
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;


var DateUnit = {
    MILLION_SECOND: 1,
    SECOND: 2,
    MINUTE: 3,
    HOUR: 4,
    DAY: 5,
    MONTH: 6,
    YEAR: 7
};

var DateUtils = {};

DateUtils.add = function (date, amount, dateUnit) {
    var timeValue = date.valueOf();
    
    switch (dateUnit) {
        case DateUnit.MILLION_SECOND:
            return new Date(timeValue + amount);
            break;
        case DateUnit.SECOND:
            return new Date(timeValue + amount * 1000);
            break;
        case DateUnit.MINUTE:
            return new Date(timeValue + amount * 1000 * 60);
            break;
        case DateUnit.HOUR:
            return new Date(timeValue + amount * 1000 * 60 * 60);
            break;
        case DateUnit.DAY:
            return new Date(timeValue + amount * 1000 * 60 * 60 * 24);
            break;
        case DateUnit.MONTH:
            var yearsToAdd = parseInt(amount/12);
            var monthsToAdd = amount % 12;
            
            var totalMonths = date.getMonth() + monthsToAdd;
            yearsToAdd += parseInt(totalMonths/12);
            
            var year = date.getFullYear() + yearsToAdd;
            var month = totalMonths % 12;
            
            var newDate = new Date(year, month, 1);
            
            var lastDateDay = this.getLastDateInMonth(newDate).getDate();
            
            if (date.getDate() > lastDateDay) {
                newDate.setDate(lastDateDay);
            } else {
                newDate.setDate(date.getDate());
            }
            
            return newDate;
            break;
        case DateUnit.YEAR:
            var newDate = new Date(date.getFullYear()+amount, date.getMonth(), 1);
            
            var lastDateDay = this.getLastDateInMonth(newDate).getDate();
            
            if (date.getDate() > lastDateDay) {
                newDate.setDate(lastDateDay);
            } else {
                newDate.setDate(date.getDate());
            }
            
            return newDate;
            break;
    }
};

DateUtils.dateDiff = function (late, early, dateUnit) {
    var diff = late - early;

    switch (dateUnit) {
        case DateUnit.MILLION_SECOND:
            return parseInt(diff);
            break;
        case DateUnit.SECOND:
            return parseInt(diff / 1000);
            break;
        case DateUnit.MINUTE:
            return parseInt(diff / 1000 / 60);
            break;
        case DateUnit.HOUR:
            return parseInt(diff / 1000 / 60 / 60);
            break;
        case DateUnit.DAY:
            return parseInt(diff / 1000 / 60 / 60 / 24);
            break;
        case DateUnit.MONTH:
            var lateYear = late.getFullYear();
            var earlyYear = early.getFullYear();
            
            var lateMonth = late.getMonth() + 1;
            var earlyMonth = early.getMonth() + 1;
            
            var lateDate = late.getDate();
            var earlyDate = early.getDate();
            
            var lateHour = late.getHours();
            var earlyHour = early.getHours();
            
            var lateMin = late.getMinutes();
            var earlyMin = early.getMinutes();
            
            var lateSec = late.getSeconds();
            var earlySec = early.getSeconds();
            
            var lateMs = late.getMilliseconds();
            var earlyMs = early.getMilliseconds();
            
            var diffYear = lateYear - earlyYear;
            var diffMonth = lateMonth - earlyMonth;
            var diffDate = lateDate - earlyDate;
            var diffHour = lateHour - earlyHour;
            var diffMin = lateMin - earlyMin;
            var diffSec = lateSec - earlySec;
            var diffMs = lateMs - earlyMs;
            
            if (diffMs < 0) {
                diffSec -= 1;
            }
            if (diffSec < 0) {
                diffMin -= 1;
            }
            if (diffMin < 0) {
                diffHour -= 1;
            }
            if (diffHour < 0) {
                diffDate -= 1;
            }
            if (diffDate < 0) {
                diffMonth -= 1;
            }
            if (diffMonth < 0) {
                diffMonth += 12;
                diffYear -= 1;
            }
            
            return diffYear * 12 + diffMonth;
            break;
        case DateUnit.YEAR:
            var monthDiff = this.dateDiff(late, early, DateUnit.MONTH);
            return parseInt(monthDiff / 12);
            break;
        default:
            alert("Argument Error!");
            throw "Argument Error!";
            break;
    }
};

DateUtils.showCalendar = function(date) {
    var weekDayOfFirstDayInMonth = DateUtils.getWeekDayOfFirstDayInMonth(date);
    var lastDateInMonth = DateUtils.getLastDateInMonth(date);
    
    var obj = {};
    
    var weekDay = weekDayOfFirstDayInMonth;
    
    for (var dateDay = 1; dateDay <= lastDateInMonth.getDate(); dateDay++) {
        obj[dateDay] = weekDay;
        
        weekDay++;
        weekDay = weekDay % 7;
    }
    
    var row = 1;
    
    var rows_data = [];
    var row_data = [];
    
    for (var day in obj) {
        var weekDay = obj[day];
        
        if (weekDay === 0) {
            weekDay = 7;
        }
        
        row_data.push(day);
        
        if (weekDay === 7) {
            rows_data.push(row_data);
            row_data = [];
            
            row++;
        }
    }
    
    if (row_data.length > 0) {
        rows_data.push(row_data);
    }
    
    var first_row_data = rows_data[0];
    var diff = 7 - first_row_data.length;
    
    var pre_arr = [];
    
    for (var i = 1; i <= diff; i++) {
        pre_arr.push(null);
    }
    
    first_row_data = pre_arr.concat(first_row_data);
    
    rows_data[0] = first_row_data;
    
    console.log(date.getFullYear() + "年" + (date.getMonth()+1) + "月日历：");
    
    console.log("一   二   三   四   五   六   日");
    console.log("--------------------------");
    
    rows_data.forEach(row => {
        var str = "";
        
        row.forEach((day, col)=> {
            col = col + 1;
            
            if (day === null) {
                str += "00  ".repeat(1);
            } else {
                if (day < 10) {
                    str = str + "0" + day + "  ";
                } else if (day < 20) {
                    str = str + "P" + day%10 + "  ";
                } else {
                    str = str + day + "  ";
                }
            }
        });
        console.log(str);
    });
};

DateUtils.getWeekDayOfFirstDayInMonth = function(date) {
    var curDay = date.getDate();
    var curWeekDay = date.getDay();
    
    while (curDay > 1) {
        curDay--;
        curWeekDay--;
        
        if (curWeekDay === -1) {
            curWeekDay = 6;
        }
    }
    
    return curWeekDay;
};

DateUtils.getLastDateInMonth = function(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    
    var nextMonth = month + 1;
    if (nextMonth === 12) {
        nextMonth = 0;
        year++;
    }
    
    var lastDate = this.add(new Date(year, nextMonth, 1), -1, DateUnit.DAY);
    
    return lastDate;
};