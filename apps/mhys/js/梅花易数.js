
var mhysUtils = {};

// 辰年十二月十七日申时
mhysUtils.get梅花易数From简易农历Str = function(dateStr) {
    var 年, 月, 日, 时;
    
    var regexp = /(.+)年(.+)月(.+)日(.+)时/gi;
    var result;
    
    while ((result = regexp.exec(dateStr)) !== null) {
        年 = result[1];
        月 = result[2];
        日 = result[3];
        时 = result[4];
    }
    
    年 = 六十甲子纳音表Utils.十二地支.findIndex(element => element === 年) + 1;
    
    for (var propName in 农历Utils.月份大写map) {
        if (农历Utils.月份大写map[propName] === 月 + "月") {
            月 = parseInt(propName);
            break;
        }
    }
    
    for (var propName in 农历Utils.日期大写map) {
        if (农历Utils.日期大写map[propName] === 日) {
            日 = parseInt(propName);
            break;
        }
    }
    
    时 = 六十甲子纳音表Utils.十二地支.findIndex(element => element === 时) + 1;
    
    var 梅花易数Obj = new 梅花易数();
    梅花易数Obj.年数 = 年;
    梅花易数Obj.月数 = 月;
    梅花易数Obj.日数 = 日;
    梅花易数Obj.时数 = 时;
    梅花易数Obj.算出梅花卦象();
    
    return 梅花易数Obj;
};


mhysUtils.get梅花易数From农历Obj = function(农历Obj) {
    var 梅花易数Obj = new 梅花易数();
    
    梅花易数Obj.农历Obj = 农历Obj;
    梅花易数Obj.年数 = 六十甲子纳音表Utils.十二地支.indexOf(农历Obj.四柱.年柱.substring(1)) + 1;
    梅花易数Obj.月数 = 农历Obj.月;
    梅花易数Obj.日数 = 农历Obj.日;
    梅花易数Obj.时数 = 六十甲子纳音表Utils.十二地支.indexOf(农历Obj.四柱.时柱.substring(1)) + 1;
    梅花易数Obj.算出梅花卦象();
    
    return 梅花易数Obj;
};

function 梅花易数() {
    //this.农历Obj = 农历Obj;
    
//    this.年数 = 六十甲子纳音表Utils.十二地支.indexOf(this.农历Obj.四柱.年柱.substring(1)) + 1;
//    this.月数 = this.农历Obj.月;
//    this.日数 = this.农历Obj.日;
//    this.时数 = 六十甲子纳音表Utils.十二地支.indexOf(this.农历Obj.四柱.时柱.substring(1)) + 1;
    
    this.年数 = -1;
    this.月数 = -1;
    this.日数 = -1;
    this.时数 = -1;
    
    this.动爻 = -1;
    
    this.本卦 = {
        上卦: null,
        下卦: null
    };
    
    this.体卦 = null;
    this.用卦 = null;
    
    this.互卦 = {
        上卦: null,
        下卦: null
    };
    
    this.变卦 = {
        上卦: null,
        下卦: null
    };
    
    //this.算出梅花卦象();
}

梅花易数.prototype.算出梅花卦象 = function() {
    var 总数 = this.年数 + this.月数 + this.日数 + this.时数;
    
    var 上卦数 = (this.年数 + this.月数 + this.日数) % 8;
    if (上卦数 === 0) {
        上卦数 = 8;
    }
    
    var 下卦数 = 总数 % 8;
    if (下卦数 === 0) {
        下卦数 = 8;
    }
    
    this.本卦.上卦 = this.get八卦(上卦数);
    this.本卦.下卦 = this.get八卦(下卦数);
    
    // 互卦
    // TODO: 乾坤无互，互其变卦
    
    var 互卦下卦初爻 = this.本卦.下卦.get二爻();
    var 互卦下卦二爻 = this.本卦.下卦.get三爻();
    var 互卦下卦三爻 = this.本卦.上卦.get初爻();
    this.互卦.下卦 = this.get八卦On三爻(互卦下卦初爻, 互卦下卦二爻, 互卦下卦三爻);
    
    var 互卦上卦初爻 = this.本卦.下卦.get三爻();
    var 互卦上卦二爻 = this.本卦.上卦.get初爻();
    var 互卦上卦三爻 = this.本卦.上卦.get二爻();
    this.互卦.上卦 = this.get八卦On三爻(互卦上卦初爻, 互卦上卦二爻, 互卦上卦三爻);
    
    
    var 动爻数 = 总数 % 6;
    if (动爻数 === 0) {
        动爻数 = 6;
    }
    
    this.动爻 = 动爻数;
    
    // 体用
    if (this.动爻 >= 1 && this.动爻 <= 3) {
        this.体卦 = this.本卦.上卦;
        this.用卦 = this.本卦.下卦;
    } else if (this.动爻 >= 4 && this.动爻 <= 6) {
        this.体卦 = this.本卦.下卦;
        this.用卦 = this.本卦.上卦;
    }
    
    // 变卦
    if (this.动爻 >= 1 && this.动爻 <= 3) {
        var 动爻Index = this.动爻 - 1;
        
        var 新卦象 = [].concat(this.本卦.下卦.卦象);
        新卦象[动爻Index] = Math.abs(新卦象[动爻Index] - 1);
        this.变卦.下卦 = this.get八卦On三爻(新卦象[0], 新卦象[1], 新卦象[2]);
        
        新卦象 = [].concat(this.本卦.上卦.卦象);
        this.变卦.上卦 = this.get八卦On三爻(新卦象[0], 新卦象[1], 新卦象[2]);
    } else if (this.动爻 >= 4 && this.动爻 <= 6) {
        var 动爻Index = this.动爻 - 4;
        
        var 新卦象 = [].concat(this.本卦.上卦.卦象);
        新卦象[动爻Index] = Math.abs(新卦象[动爻Index] - 1);
        this.变卦.上卦 = this.get八卦On三爻(新卦象[0], 新卦象[1], 新卦象[2]);
        
        新卦象 = [].concat(this.本卦.下卦.卦象);
        this.变卦.下卦 = this.get八卦On三爻(新卦象[0], 新卦象[1], 新卦象[2]);
    }
};

梅花易数.prototype.get八卦 = function(八卦序号) {
    var map = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];
    
    var name = map[八卦序号-1]; 
    
    switch(name) {
        case "乾":
            return new 乾();
            break;
        case "兑":
            return new 兑();
            break;
        case "离":
            return new 离();
            break;
        case "震":
            return new 震();
            break;
        case "巽":
            return new 巽();
            break;
        case "坎":
            return new 坎();
            break;
        case "艮":
            return new 艮();
            break;
        case "坤":
            return new 坤();
            break;
        default:
            console.log("Error!");
            break;
    }
};

梅花易数.prototype.get八卦On三爻 = function(初爻, 二爻, 三爻) {
    if (初爻 === 1 && 二爻 === 1 && 三爻 === 1) {
        return new 乾();
    } else if (初爻 === 1 && 二爻 === 1 && 三爻 === 0) {
        return new 兑();
    } else if (初爻 === 1 && 二爻 === 0 && 三爻 === 1) {
        return new 离();
    } else if (初爻 === 1 && 二爻 === 0 && 三爻 === 0) {
        return new 震();
    } else if (初爻 === 0 && 二爻 === 1 && 三爻 === 1) {
        return new 巽();
    } else if (初爻 === 0 && 二爻 === 1 && 三爻 === 0) {
        return new 坎();
    } else if (初爻 === 0 && 二爻 === 0 && 三爻 === 1) {
        return new 艮();
    } else if (初爻 === 0 && 二爻 === 0 && 三爻 === 0) {
        return new 坤();
    }
};