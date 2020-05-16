
function testAdd() {
    var date1 = new Date("1970/1/1 00:00:00");
    
    var date2 = DateUtils.add(date1, 599, DateUnit.MILLION_SECOND);
    console.assert(date2.getMilliseconds() === 599, "Fail. Result is: " + date2.getMilliseconds());
    
    var date2 = DateUtils.add(date1, 3000, DateUnit.MILLION_SECOND);
    console.assert(date2.getSeconds() === 3, "Fail. Result is: " + date2.getSeconds());
    
    var date2 = DateUtils.add(date1, -3000, DateUnit.MILLION_SECOND);
    console.assert(date2.getSeconds() === 57, "Fail. Result is: " + date2.getSeconds());
    
    var date2 = DateUtils.add(date1, 60, DateUnit.SECOND);
    console.assert(date2.getMinutes() === 1, "Fail. Result is: " + date2.getMinutes());
    
    var date2 = DateUtils.add(date1, 60, DateUnit.MINUTE);
    console.assert(date2.getHours() === 1, "Fail. Result is: " + date2.getHours());
    
    var date2 = DateUtils.add(date1, 24, DateUnit.HOUR);
    console.assert(date2.getDate() === 2, "Fail. Result is: " + date2.getDate());
    
    var date2 = DateUtils.add(date1, 2, DateUnit.DAY);
    console.assert(date2.getDate() === 3, "Fail. Result is: " + date2.getDate());
    
    var date2 = DateUtils.add(date1, 31, DateUnit.DAY);
    console.assert(date2.getDate() === 1, "Fail. Result is: " + date2.getDate());
    
    var date1 = new Date("1973/11/30");
    var date2 = DateUtils.add(date1, 3, DateUnit.MONTH);
    console.assert(date2.getFullYear() === 1974, "Fail. Result is: " + date2.getFullYear());
    console.assert(date2.getMonth() === 1, "Fail. Result is: " + date2.getMonth());
    console.assert(date2.getDate() === 28, "Fail. Result is: " + date2.getDate());
    
    var date1 = new Date("1976/2/29");
    var date2 = DateUtils.add(date1, 1, DateUnit.YEAR);
    console.assert(date2.getFullYear() === 1977, "Fail. Result is: " + date2.getFullYear());
    console.assert(date2.getMonth() === 1, "Fail. Result is: " + date2.getMonth());
    console.assert(date2.getDate() === 28, "Fail. Result is: " + date2.getDate());
}

function testDateDiff() {
    var date1 = new Date("1976/5/3 00:00:00");
    var date2 = new Date("1976/5/3 00:00:01");
    
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.MILLION_SECOND);
    console.assert(diff === 1000, "Fail. Result is: " + diff);
    
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.SECOND);
    console.assert(diff === 1, "Fail. Result is: " + diff);
    
    var date2 = new Date("1976/5/3 00:09:00");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.MINUTE);
    console.assert(diff === 9, "Fail. Result is: " + diff);
    
    var date2 = new Date("1976/5/3 22:09:00");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.HOUR);
    console.assert(diff === 22, "Fail. Result is: " + diff);
    
    var date2 = new Date("1976/5/29");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.DAY);
    console.assert(diff === 26, "Fail. Result is: " + diff);
    
    var date1 = new Date("1976/5/3 09:00:00");
    
    var date2 = new Date("1976/6/3 08:00:00");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.MONTH);
    console.assert(diff === 0, "Fail. Result is: " + diff);
    
    var date2 = new Date("1976/6/3 09:00:00");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.MONTH);
    console.assert(diff === 1, "Fail. Result is: " + diff);
    
    var date2 = new Date("1979/6/2 10:00:00");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.MONTH);
    console.assert(diff === 36, "Fail. Result is: " + diff);
    
    var date1 = new Date("1970/1/1 05:00:00");
    var date2 = new Date("1977/1/1 04:00:00");
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.YEAR);
    console.assert(diff === 6, "Fail. Result is: " + diff);
}

function testShowCalendar() {
    var date = new Date("1970/01/01 00:00:00");
    DateUtils.showCalendar(date);
}

function testGetWeekDayOfFirstDayInMonth() {
    var weekday = DateUtils.getWeekDayOfFirstDayInMonth(new Date("2002/01/13 09:59:00"));
    console.assert(weekday === 2, "Fail. Result is: " + weekday);
    
    var weekday = DateUtils.getWeekDayOfFirstDayInMonth(new Date("2010/01/04 00:00:00"));
    console.assert(weekday === 5, "Fail. Result is: " + weekday);
}

function testGetLastDateInMonth() {
    var lastDate = DateUtils.getLastDateInMonth(new Date("2020/2/012"));
    console.assert(lastDate.getDate() === 29, "Fail. Result is: " + lastDate.getDate());
    
    var lastDate = DateUtils.getLastDateInMonth(new Date("2020/12/012"));
    console.assert(lastDate.getDate() === 31, "Fail. Result is: " + lastDate.getDate());
}




testAdd();
testDateDiff();
testGetWeekDayOfFirstDayInMonth();
testGetLastDateInMonth();
//testShowCalendar();

console.log("All tests are passed!");