var 六十甲子纳音表Utils = {
    十天干: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    十二地支: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    
    纳音表: [],
    
    年干支: {
        年份: '1900-1-31',
        干支: '庚子'
    }
};


六十甲子纳音表Utils.init = function() {
    // var 地支Index = 0;
    
    for (var eleCount = 0; eleCount < 60; eleCount++) {
        var 天干Index = eleCount % this.十天干.length;
        var 地支Index = eleCount % this.十二地支.length;
        
        var 天干 = this.十天干[天干Index];
        var 地支 = this.十二地支[地支Index];
        
        var 天干地支 = 天干 + 地支;
        
        this.纳音表.push(天干地支);
    }
};

六十甲子纳音表Utils.get纳音序号 = function(干支) {
    var result = -999;
    
    this.纳音表.forEach((element, index) => {
        if (element === 干支) {
            result = index + 1;
            return;
        }
    });
    
    return result;
};

六十甲子纳音表Utils.get纳音干支 = function(序号) {
    return this.纳音表[序号 - 1];
};

六十甲子纳音表Utils.get干支From流逝时辰 = function(干支, 时辰数) {
    var 纳音序号 = this.get纳音序号(干支);
    
    var 新序号 = 纳音序号 + 时辰数;
    
    if (新序号 >= 0) {
    
        新序号 = 新序号 % this.纳音表.length;
        if (新序号 === 0) {
            新序号 = 60;
        }

        return this.纳音表[新序号-1];
    } else {
        新序号 = 新序号 % 60;
        新序号 = 60 + 新序号;
        
        return this.纳音表[新序号-1];
    }
};


六十甲子纳音表Utils.init();


//var aa = 六十甲子纳音表Utils.get纳音序号("丁酉");
//console.log(aa);