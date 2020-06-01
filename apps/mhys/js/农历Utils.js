
function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function 公历(date) {
    this.date = date;
    
    this.年 = date.getFullYear();
    this.月 = date.getMonth() + 1;
    this.日 = date.getDate();
    this.时 = date.getHours();
    this.分 = date.getMinutes();
    
    this.toString = function() {
        var hour = this.时;
        var min = this.分;
        
        if (this.时 < 10) {
            hour = "0" + this.时;
        }
        
        if (this.分 < 10) {
            min = "0" + this.时;
        }
        
        return `${this.年}年${this.月}月${this.日}日 ${hour}:${min}`;
    };
}

function 四柱() {
    this.年柱 = "";
    this.月柱 = "";
    this.日柱 = "";
    this.时柱 = "";
    
    this.toString = function() {
        return `${this.年柱} ${this.月柱} ${this.日柱} ${this.时柱}`;
    };
}

function 农历() {
    this.公历 = null;
    
    this.年 = 0;
    this.月 = 0;
    this.日 = 0;
    this.时 = 0;
    
    this.is闰月 = false;
    
    this.四柱 = new 四柱();
    
    this.toString = function() {
        //var yearStr = 农历Utils.转换年为大写数字(this.年) + "年";
        
        var yearStr = 六十甲子纳音表Utils.get纳音干支(this.年).substring(1) + "年";
        
        var monthStr = 农历Utils.转换月为大写数字(this.月);
        if (this.is闰月) {
            monthStr = "闰" + monthStr;
        }
        
        var dateStr = 农历Utils.转换日为大写数字(this.日);
        
        var hourStr = 农历Utils.转换时为大写数字(this.时) + "时";
        
        return `${yearStr}${monthStr}${dateStr}${hourStr}`;
    };
}



var 农历Utils = {};

农历Utils.四柱起算info = {
    农历年份: 1900,
    干支: "庚子"
};


农历Utils.数字大写map = {
    0: "〇",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九"
};

农历Utils.月份大写map = {
    1: "正月",
    2: "二月",
    3: "三月",
    4: "四月",
    5: "五月",
    6: "六月",
    7: "七月",
    8: "八月",
    9: "九月",
    10: "十月",
    11: "十一月",
    12: "十二月"
};

农历Utils.日期大写map = {
    1: "初一",
    2: "初二",
    3: "初三",
    4: "初四",
    5: "初五",
    6: "初六",
    7: "初七",
    8: "初八",
    9: "初九",
    10: "初十",
    11: "十一",
    12: "十二",
    13: "十三",
    14: "十四",
    15: "十五",
    16: "十六",
    17: "十七",
    18: "十八",
    19: "十九",
    20: "二十",
    21: "廿一",
    22: "廿二",
    23: "廿三",
    24: "廿四",
    25: "廿五",
    26: "廿六",
    27: "廿七",
    28: "廿八",
    29: "廿九",
    30: "三十"
};

农历Utils.数字时辰map = {
    23: "子", 0: "子",
    1: "丑", 2: "丑",
    3: "寅", 4: "寅",
    5: "卯", 6: "卯",
    7: "辰", 8: "辰",
    9: "巳", 10: "巳",
    11: "午", 12: "午",
    13: "未", 14: "未",
    15: "申", 16: "申",
    17: "酉", 18: "酉",
    19: "戌", 20: "戌",
    21: "亥", 22: "亥"
};

var ajax = {};

ajax.getHttpRequest = function () {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
};

ajax.load = function (url, handleFunc) {
    this.httpRequest = this.getHttpRequest();

    this.httpRequest.onreadystatechange = function () { // this refers to ajax
        if (this.readyState === XMLHttpRequest.DONE) { // this refers to httpRequest
            if (this.status === 200) {
                handleFunc(this.responseXML);
            } else {
                alert("The request unsucceeded.");
            }
        }
    };
    this.httpRequest.open("GET", url, true);
    this.httpRequest.send();
};




农历Utils.开始预测 = function (date) {
    ajax.load("../data/xml/农历.xml", this.接收到信息, date);
};

农历Utils.接收到信息 = function (xmlDoc, date) {
    var 农历info = 农历Utils.get农历Info(xmlDoc, date);

    var 农历年Str = 农历Utils.算出农历年(农历info, date);
    var 农历月日Str = 农历Utils.算出农历月日(农历info, date);
    
    console.log(农历年Str + "年" + 农历月日Str);
};

农历Utils.get农历Info = function(xmlDoc, date) {
    var year = date.getFullYear();
    var xpath = `/dataroot/农历[年份=${year}]/*`;
    var evaluator = new XPathEvaluator();
    var expression = evaluator.createExpression(xpath);
    var result = expression.evaluate(xmlDoc, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

    if (result.snapshotLength === 0) {
        alert(`Can't find record for year ${year}!`);
        throw `Can't find record for year ${year}!`;
    }
    
    var dateStr = result.snapshotItem(1).textContent;
    dateStr = dateStr.replace(/-/g, "/");
    
    var 首日 = new Date(dateStr);
    
    if (date < 首日) {
        var newDate = new Date(year-1, 10, 10);
        var obj = this.get农历Info(xmlDoc, newDate);
        
        return obj;
    }

    var obj = {};

    for (var i = 0, len = result.snapshotLength; i < len; i++) {
        var node = result.snapshotItem(i);

        if (["年份", "闰月"].includes(node.tagName)) {
            obj[node.tagName] = parseInt(node.textContent);
        } else if (node.tagName === "首日") {
            var dateStr = node.textContent;
            dateStr = dateStr.replace(/-/g, "/");
            obj[node.tagName] = new Date(dateStr);
        } else if (node.tagName === "大月") {
            var arr = (node.textContent).split(",");
            arr.forEach((e, index, array) => {
                array[index] = parseInt(e);
            });
            obj[node.tagName] = arr;
        } else {
            obj[node.tagName] = node.textContent;
        }
    }

    return obj;
};

农历Utils.算出农历 = function(date, handleFunc) {
    var 公历Obj = new 公历(date);
    
    var 农历Obj = new 农历();
    农历Obj.公历 = 公历Obj;
    
    ajax.load("data/xml/农历.xml", function(xmlDoc) {
        var 农历info = 农历Utils.get农历Info(xmlDoc, date);
        
        农历Utils.算出农历年(农历info, 农历Obj);
        农历Utils.算出农历月日(农历info, 农历Obj);
        农历Utils.算出农历时辰(农历Obj);
        
        农历Utils.算出四柱(农历Obj, 农历info);
        
        handleFunc(农历Obj);
    });
};

农历Utils.算出农历On公历 = function(date) {
    var 公历Obj = new 公历(date);
    
    var 农历Obj = new 农历();
    农历Obj.公历 = 公历Obj;
    
    var options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false
    };
    
    var dateStr = new Intl.DateTimeFormat("zh-Hans-CN-u-ca-chinese", options).format(date);
    
    var firstDelimiter = dateStr.indexOf("/");
    var secondDelimiter = dateStr.lastIndexOf("/");
    var thirdDelimiter = dateStr.indexOf(" ");
    var fourthDelimiter = dateStr.indexOf(":");
    
    var 年Str = dateStr.substring(0, firstDelimiter);
    var 月Str = dateStr.substring(firstDelimiter + 1, secondDelimiter);
    var 日Str = dateStr.substring(secondDelimiter + 1, thirdDelimiter);
    var 时Str = dateStr.substring(thirdDelimiter + 1, fourthDelimiter);
    
    农历Obj.年 = parseInt(年Str);
    if (月Str.indexOf("闰") > -1) {
        农历Obj.月 = parseInt(月Str.substring(1));
        农历Obj.is闰月 = true;
    } else {
        农历Obj.月 = parseInt(月Str);
    }
    农历Obj.日 = parseInt(日Str);
    农历Obj.时 = parseInt(时Str);

    this.算出四柱On农历(农历Obj);
    
    return 农历Obj;
};

农历Utils.算出四柱On农历 = function (农历Obj) {
    农历Obj.四柱.年柱 = 六十甲子纳音表Utils.get纳音干支(农历Obj.年);
    this.年上起月法(农历Obj);
    
    // 算出日柱
    var date2 = 农历Obj.公历.date;
    
    var 日期起始干支 = {
        日期: new Date("1900/01/31"),
        日干支: "甲辰"
    };
    
    var date1 = 日期起始干支.日期;
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.DAY);
    var 日柱干支 = 六十甲子纳音表Utils.get干支From流逝时辰(日期起始干支.日干支, diff);
    农历Obj.四柱.日柱 = 日柱干支;
    
    this.日上起时法(农历Obj);
};

农历Utils.算出四柱 = function (农历Obj, 农历info) {
    var curYear = 农历Obj.年;
    var diff = curYear - this.四柱起算info.农历年份;
    
    农历Obj.四柱.年柱 = 六十甲子纳音表Utils.get干支From流逝时辰(this.四柱起算info.干支, diff);
    
    this.年上起月法(农历Obj);
    
    // 算出日柱
    var date2 = 农历Obj.公历.date;
    var date1 = 农历info.首日;
    var diff = DateUtils.dateDiff(date2, date1, DateUnit.DAY);
    var 日柱干支 = 六十甲子纳音表Utils.get干支From流逝时辰(农历info.干支, diff);
    农历Obj.四柱.日柱 = 日柱干支;
    
    this.日上起时法(农历Obj);
};

农历Utils.年上起月map = {
    甲己: 3,
    乙庚: 15,
    丙辛: 27,
    丁壬: 39,
    戊癸: 51
};

农历Utils.日上起时map = {
    甲己: 1,
    乙庚: 13,
    丙辛: 25,
    丁壬: 37,
    戊癸: 49
};

农历Utils.年上起月法 = function(农历Obj) {
    var 年干 = 农历Obj.四柱.年柱.substring(0, 1);
    var 农历月数 = 农历Obj.月;
    
    var 属性名称 = "";
    var 双干name = ["甲己", "乙庚", "丙辛", "丁壬", "戊癸"];
    
    for (var name of 双干name) {
        if (name.indexOf(年干) >= 0) {
            属性名称 = name;
            break;
        }
    }
    
    var 起始纳音序号 = this.年上起月map[属性名称];
    var 起始纳音干支 = 六十甲子纳音表Utils.get纳音干支(起始纳音序号);
    
    var 月干支 = 六十甲子纳音表Utils.get干支From流逝时辰(起始纳音干支, 农历月数 - 1)
    
    农历Obj.四柱.月柱 = 月干支;
};

农历Utils.日上起时法 = function(农历Obj) {
    var 日干 = 农历Obj.四柱.日柱.substring(0, 1);
    
    var 属性名称 = "";
    var 双干name = ["甲己", "乙庚", "丙辛", "丁壬", "戊癸"];
    
    for (var name of 双干name) {
        if (name.indexOf(日干) >= 0) {
            属性名称 = name;
            break;
        }
    }
    
    var 起始纳音序号 = this.日上起时map[属性名称];
    var 起始纳音干支 = 六十甲子纳音表Utils.get纳音干支(起始纳音序号);
    
    var 时支 = this.转换时为大写数字(农历Obj.时);
    var 时支数 = 六十甲子纳音表Utils.十二地支.indexOf(时支) + 1;
    var 时干支 = 六十甲子纳音表Utils.get干支From流逝时辰(起始纳音干支, 时支数 - 1)
    
    农历Obj.四柱.时柱 = 时干支;
};


农历Utils.算出农历年 = function (农历info, 农历Obj) {
//    console.log(农历info, 农历Obj);
//    var year = 农历Obj.公历.年;
//    
//    if (农历Obj.公历.date < 农历info.首日) {
//        year--;
//    }
    
    农历Obj.年 = 农历info.年份;
};

农历Utils.算出农历月日 = function (农历info, 农历Obj) {
    var date = 农历Obj.公历.date;
    
    var monthDays = [];
    
    for (var curMonth = 0; curMonth <= 13; curMonth++) {
        if (农历info.大月.includes(curMonth)) {
            monthDays[curMonth] = 30;
        } else {
            monthDays[curMonth] = 29;
        }
    }
    
    var dateDiff = DateUtils.dateDiff(date, 农历info.首日, DateUnit.DAY) + 1;
    
    var 当月开始天数 = 0;
    var 当月结束天数 = 0;
    
    var 农历月数 = 0;
    var is闰月 = false;
    
    for (var curMonth = 1; curMonth <=13; curMonth++) {
        当月开始天数 = 当月结束天数 + 1;
        当月结束天数 = 当月开始天数 + monthDays[curMonth] - 1;
        
        if (dateDiff >= 当月开始天数 && dateDiff <= 当月结束天数) {
            if (农历info.闰月 === undefined || (农历info.闰月 && curMonth <= 农历info.闰月)) {
                农历月数 = curMonth;
                break;
            } else {
                农历月数 = curMonth - 1;
                if (农历月数 === 农历info.闰月) {
                    is闰月 = true;
                }
                break;
            }
        }
    }
    
    农历Obj.月 = 农历月数;
    
    if (is闰月) {
        农历Obj.is闰月 = true;
    }
    
    var 农历日数 = dateDiff - 当月开始天数 + 1;
    农历Obj.日 = 农历日数;
};

农历Utils.算出农历时辰 = function (农历Obj) {
    var hour = 农历Obj.公历.date.getHours();
    农历Obj.时 = hour;
};

农历Utils.转换年为大写数字 = function (year) {
    var str = year + "";
    
    var result = "";
    for (var num of str) {
        result += this.数字大写map[num];
    }
    
    return result;
};

农历Utils.转换月为大写数字 = function (month) {
    return this.月份大写map[month];
};

农历Utils.转换日为大写数字 = function (day) {
    return this.日期大写map[day];
};

农历Utils.转换时为大写数字 = function (hour) {
    return this.数字时辰map[hour];
};

农历Utils.getRandomDate = function () {
    var date1 = new Date("1900/01/01");
    var date2 = new Date("2020/12/31");
    
    var lowerBound = date1.valueOf();
    var upperBound = date2.valueOf();
    
    var randNum = getRndInt(lowerBound, upperBound);
    
    var date3 = new Date(randNum);
    return date3;
};