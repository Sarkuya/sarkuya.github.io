
var 八卦Utils = {};

八卦Utils.get八卦 = function(八卦序号) {
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



function 八卦() {
}

八卦.prototype.get初爻 = function() {
    return this.卦象[0];
};

八卦.prototype.get二爻 = function() {
    return this.卦象[1];
};

八卦.prototype.get三爻 = function() {
    return this.卦象[2];
};



function 乾() {
    this.名称 = "乾";
    this.卦数 = 1;
    this.卦象 = [1, 1, 1];
    this.五行 = "金";
    this.万物属性 = ["天", "父", "老人", "官贵", "头", "骨", "马", "金", "宝珠", "玉", "水果", "圆物", "冠", "镜", "刚物", "大赤色", "水", "寒"];
}

function 兑() {
    this.名称 = "兑";
    this.卦数 = 2;
    this.卦象 = [1, 1, 0];
    this.五行 = "金";
    this.万物属性 = ["泽", "少女", "巫", "舌", "妾", "肺", "羊", "毁折之物", "带口之器", "属金者", "废缺之物", "奴", "仆", "婢"];
}

function 离() {
    this.名称 = "离";
    this.卦数 = 3;
    this.卦象 = [1, 0, 1];
    this.五行 = "火";
    this.万物属性 = ["火", "雉", "日", "目", "电", "霓", "霞", "中女", "甲胄", "戈兵", "文书", "槁木", "炉", "灶", "龟", "蟹", "蚌", "凡有壳之物", "红赤紫色", "花", "文人", "干燥物"];
}

function 震() {
    this.名称 = "震";
    this.卦数 = 4;
    this.卦象 = [1, 0, 0];
    this.五行 = "木";
    this.万物属性 = ["雷", "长男", "足", "发", "龙", "百虫", "蹄", "竹", "萑苇", "马鸣", "母足", "颡", "稼", "乐器之类", "草木", "青碧绿色", "树", "木核", "柴", "蛇"];
}

function 巽() {
    this.名称 = "巽";
    this.卦数 = 5;
    this.卦象 = [0, 1, 1];
    this.五行 = "木";
    this.万物属性 = ["风", "长女", "僧尼", "鸡", "股", "百禽", "百草", "臼", "香气", "臭", "绳", "眼", "羽毛", "帆", "扇", "枝叶之类", "仙道", "工匠", "直物", "工巧之器"];
}

function 坎() {
    this.名称 = "坎";
    this.卦数 = 6;
    this.卦象 = [0, 1, 0];
    this.五行 = "水";
    this.万物属性 = ["水", "雨雪", "工", "豕", "中男", "沟渎", "弓轮", "耳", "血", "月", "盗", "宫律", "栋", "丛棘", "狐", "蒺藜", "桎梏", "水族", "鱼", "盐", "酒醢", "有核之物", "黑色"];
}

function 艮() {
    this.名称 = "艮";
    this.卦数 = 7;
    this.卦象 = [0, 0, 1];
    this.五行 = "土";
    this.万物属性 = ["山", "土", "少男", "童子", "狗", "手", "指", "径路", "门阙", "果蓏", "阍寺", "鼠", "虎", "狐", "黔喙之物", "木生之物", "藤生之爪", "鼻"];
}

function 坤() {
    this.名称 = "坤";
    this.卦数 = 8;
    this.卦象 = [0, 0, 0];
    this.五行 = "土";
    this.万物属性 = ["地", "母", "老妇", "土", "牛", "釜", "布帛", "文章", "舆", "辇", "方物", "柄", "黄色", "瓦器", "腹", "裳", "黑色", "黍稷", "书", "米", "谷"];
}

乾.prototype = 八卦.prototype;
兑.prototype = 八卦.prototype;
离.prototype = 八卦.prototype;
震.prototype = 八卦.prototype;
巽.prototype = 八卦.prototype;
坎.prototype = 八卦.prototype;
艮.prototype = 八卦.prototype;
坤.prototype = 八卦.prototype;

//
//乾卦.constructor = 乾卦.prototype.constructor;