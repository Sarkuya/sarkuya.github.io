
var 六十四卦Utils = {};

var 六十四卦上下卦map = {
    乾乾: {
        卦数: 1,
        名称: '乾为天',
        含义: '小往大来，吉，亨。',
        彖: '大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明终始，六位时成。时乘六龙以御天。乾道变化，各正性命。保合大和，乃利贞。首出庶物，万国咸宁。',
        象: '天行健，君子以自强不息。“潜龙勿用”，阳在下也。“见龙在田”，德施普也。“终日乾乾”，反复道也。“或跃在渊”，进无咎也。“飞龙在天”，大人造也。“亢龙有悔”，盈不可久也。“用九”，天德不可为首也。',
        变爻: {
            1: {
                释义: '初九，磐桓，利居贞。利建侯。',
                象: '虽磐桓，志行正也。以贵下贱，大得民也。'
            },
            2: {
                释义: '六二，屯如邅如，乘马班如。匪寇，婚媾。女子贞不字，十年乃字。',
                象: '六二之难，乘刚也。十年乃字，反常也。'
            },
            3: {
                释义: '六三，即鹿无虞，惟入于林中，君子几不如舍，往吝。',
                象: '“即鹿无虞”，以从禽也。君子舍之，往吝穷也。'
            },
            4: {
                释义: '六四，乘马班如，求婚媾。往吉，无不利。',
                象: '求而往，明也。'
            },
            5: {
                释义: '九五，屯其膏，小，贞吉；大，贞凶。',
                象: '“屯其膏”，施未光也。'
            },
            6: {
                释义: '上六，乘马班如，泣血涟如。',
                象: '﻿“泣血涟如”，何可长也。'
            }
        }
    }
};

六十四卦Utils.get六十四卦 = function(上卦, 下卦) {
    switch (上卦.名称) {
        case "乾":
            break;
    }
};


function 六十四卦(上卦, 下卦) {
    this.上卦 = 上卦;
    this.下卦 = 下卦;
    
    var obj = 六十四卦上下卦map[上卦.名称+下卦.名称];

    for (var prop in obj) {
        this[prop] = obj[prop];
    }
}

var aa = new 六十四卦(new 乾(), new 乾());
//console.log(aa);