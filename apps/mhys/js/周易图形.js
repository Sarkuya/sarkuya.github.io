
const GOLDEN_RATE = (Math.sqrt(5) - 1) / 2;

var zygrc = {
    梅花易数卦像: {
        字体: {
            复卦: {
                size: "24px Helvetica",
                color: "rgb(34, 77, 91)"
            },
            上下卦: {
                size: "12px Helvetica",
                color: "rgb(153, 175, 172)"
            },
            体卦: {
                size: "22px Helvetica",
                color: "magenta"
            },
            用卦: {
                size: "22px Helvetica",
                color: "rgb(92, 25, 36)"
            },
            六十四卦: {
                size: "18px Helvetica",
                color: "#999"
            }
            
        }
    }
};

zygrc.init = function() {
//    this.阴爻宽度 = 30;
//    
//    this.阴爻间距 = this.阴爻宽度 / 3;
//    this.阳爻宽度 = this.阴爻宽度 * 2 + this.阴爻间距;
//    this.爻高度 = this.阴爻间距;
//    this.爻垂直间距 = this.阴爻间距;

    // 只需指定阳爻宽度
    this.阳爻宽度 = 50;
    
    this.爻高度 = this.阳爻宽度 / GOLDEN_RATE / 11 * 0.95;
    this.爻垂直间距 = (this.阳爻宽度 / GOLDEN_RATE - this.爻高度 * 6) / 5;
    this.阴爻间距 = this.阳爻宽度 / 5;
    this.阴爻宽度 = (this.阳爻宽度 - this.阴爻间距) / 2;
};


zygrc.draw爻 = function (ctx, x, y, is阳爻) {
    if (!is阳爻) {
        ctx.fillRect(x, y, this.阴爻宽度, this.爻高度);
        ctx.fillRect(x + this.阴爻宽度 + this.阴爻间距, y, this.阴爻宽度, this.爻高度);
    } else {
        ctx.fillRect(x, y, this.阳爻宽度, this.爻高度);
    }
};

zygrc.draw八卦 = function (ctx, x, y, 八卦) {
    this.draw爻(ctx, x, y, 八卦.卦象[2]);
    y += this.爻高度 + this.爻垂直间距;
    this.draw爻(ctx, x, y, 八卦.卦象[1]);
    y += this.爻高度 + this.爻垂直间距;
    this.draw爻(ctx, x, y, 八卦.卦象[0]);
};

zygrc.draw重卦 = function (ctx, x, y, 上卦, 下卦) {
    this.draw八卦(ctx, x, y, 上卦);
    y += this.爻高度 * 3 + this.爻垂直间距 * 3;
    this.draw八卦(ctx, x, y, 下卦);
};

zygrc.draw梅花卦象 = function (ctx, 梅花易数Obj) {
//    ctx.textAlign = "center";
//    ctx.textBaseline = "bottom";
//    
//    ctx.font = '16px Arial';
//    ctx.fillText("本卦", 50, 30);
    

    
    
    var x = 10;
    var y = 10;
    
    this.draw本卦(ctx, 梅花易数Obj);
    
    //x += 100;
    this.draw互卦(ctx, 梅花易数Obj);
    
    // x += 100;
    this.draw变卦(ctx, 梅花易数Obj);
};

zygrc.draw互卦 = function (ctx, 梅花易数Obj) {
    ctx.save();
    
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    
    var centerX = width / 2;
    var centerY = height / 2;
    
    var 卦象StartX = centerX - this.阳爻宽度 / 2;
    var 卦象StartY = centerY - (this.爻高度 * 6 + this.爻垂直间距 * 5) / 2;
    
    this.draw重卦(ctx, 卦象StartX, 卦象StartY, 梅花易数Obj.互卦.上卦, 梅花易数Obj.互卦.下卦);
    
    // 卦象名称
    ctx.font = this.梅花易数卦像.字体.复卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.复卦.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    
    var title = "互卦";

    var 卦象名称StartX = centerX;
    var 卦象名称StartY = 卦象StartY - this.爻高度;
    
    ctx.fillText(title, 卦象名称StartX, 卦象名称StartY);
    
    // 上下卦属性
    var 上卦属性 = `(${梅花易数Obj.互卦.上卦.名称}${梅花易数Obj.互卦.上卦.五行})`;
    var 下卦属性 = `(${梅花易数Obj.互卦.下卦.名称}${梅花易数Obj.互卦.下卦.五行})`;
    
    ctx.font = this.梅花易数卦像.字体.上下卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.上下卦.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    
    var 上卦属性StartX = centerX + this.阳爻宽度 / 2 + this.阴爻间距 * GOLDEN_RATE;
    var 上卦属性StartY = 卦象StartY + this.爻高度 * 1.5 + this.爻垂直间距;
    
    ctx.fillText(上卦属性, 上卦属性StartX, 上卦属性StartY);
    
    var 下卦属性StartX = 上卦属性StartX;
    var 下卦属性StartY = 卦象StartY + this.爻高度 * 4.5 + this.爻垂直间距 * 4;
    
    ctx.fillText(下卦属性, 下卦属性StartX, 下卦属性StartY);
    
    // 六十四卦
    ctx.font = this.梅花易数卦像.字体.六十四卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.六十四卦.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    var 六十四卦title = "泽天夬";
    ctx.fillText(六十四卦title, centerX, 卦象StartY + this.爻高度 * 6 + this.爻垂直间距 * 6);
    
    ctx.restore();
};

zygrc.draw本卦 = function (ctx, 梅花易数Obj) {
    ctx.save();
    
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    
    var centerY = height / 2;
    
    var offset = 10;
    
    var 卦象StartX = width / 4 - this.阳爻宽度 / 2 - offset;
    var 卦象StartY = centerY - (this.爻高度 * 6 + this.爻垂直间距 * 5) / 2;
    
    draw卦象(卦象StartX, 卦象StartY);

    // 卦象名称
    ctx.font = this.梅花易数卦像.字体.复卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.复卦.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    
    var title = "本卦";

    var 卦象名称StartX = 卦象StartX + this.阳爻宽度 / 2;
    var 卦象名称StartY = 卦象StartY - this.爻高度;
    
    ctx.fillText(title, 卦象名称StartX, 卦象名称StartY);
    
    
    // 上下卦属性
    var 上卦属性 = `(${梅花易数Obj.本卦.上卦.名称}${梅花易数Obj.本卦.上卦.五行})`;
    var 下卦属性 = `(${梅花易数Obj.本卦.下卦.名称}${梅花易数Obj.本卦.下卦.五行})`;
    
    ctx.font = this.梅花易数卦像.字体.上下卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.上下卦.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    
    var 上卦属性StartX = 卦象StartX + this.阳爻宽度 + this.阴爻间距 * GOLDEN_RATE;
    var 上卦属性StartY = 卦象StartY + this.爻高度 * 1.5 + this.爻垂直间距;
    
    ctx.fillText(上卦属性, 上卦属性StartX, 上卦属性StartY);
    
    var 下卦属性StartX = 上卦属性StartX;
    var 下卦属性StartY = 卦象StartY + this.爻高度 * 4.5 + this.爻垂直间距 * 4;
    
    ctx.fillText(下卦属性, 下卦属性StartX, 下卦属性StartY);
    
    // 六十四卦
    ctx.font = this.梅花易数卦像.字体.六十四卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.六十四卦.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    var 六十四卦title = "雷天恒";
    ctx.fillText(六十四卦title, 卦象StartX + this.阳爻宽度 / 2, 卦象StartY + this.爻高度 * 6 + this.爻垂直间距 * 6);
    
    
    // 体用
    ctx.font = this.梅花易数卦像.字体.体卦.size;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    
    上卦属性StartX = 卦象StartX - this.阴爻间距 * GOLDEN_RATE * 2;
    下卦属性StartX = 上卦属性StartX;
    
    if (梅花易数Obj.体卦 === 梅花易数Obj.本卦.上卦) {
        ctx.fillStyle = this.梅花易数卦像.字体.体卦.color;
        ctx.fillText("体", 上卦属性StartX, 上卦属性StartY);
        ctx.fillStyle = this.梅花易数卦像.字体.用卦.color;
        ctx.fillText("用", 下卦属性StartX, 下卦属性StartY);
    } else {
        ctx.fillStyle = this.梅花易数卦像.字体.用卦.color;
        ctx.fillText("用", 上卦属性StartX, 上卦属性StartY);
        ctx.fillStyle = this.梅花易数卦像.字体.体卦.color;
        ctx.fillText("体", 下卦属性StartX, 下卦属性StartY);
    }
    
    
    function draw卦象(x, y) {
        var 下三爻 = 梅花易数Obj.本卦.下卦.卦象;
        var 上三爻 = 梅花易数Obj.本卦.上卦.卦象;

        var 六爻 = 下三爻.concat(上三爻);

        var 动爻数 = 梅花易数Obj.动爻;
        var index = 动爻数 - 1;

        六爻.reverse();

        var 动爻index = 六爻.length - 1 - index;

        六爻.forEach((爻, index) => {
            if (index === 动爻index) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "black";
            }

            zygrc.draw爻(ctx, x, y, 爻);

            y += zygrc.爻高度 + zygrc.爻垂直间距;
        });
    }
    
    ctx.restore();
};


zygrc.draw变卦 = function (ctx, 梅花易数Obj) {
    ctx.save();
    
    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    
    var centerY = height / 2;
    
    var offset = 10;
    
    var 卦象StartX = width / 4 * 3 - this.阳爻宽度 / 2 + offset;
    var 卦象StartY = centerY - (this.爻高度 * 6 + this.爻垂直间距 * 5) / 2;
    
    this.draw重卦(ctx, 卦象StartX, 卦象StartY, 梅花易数Obj.变卦.上卦, 梅花易数Obj.变卦.下卦);
    
    // 卦象名称
    ctx.font = this.梅花易数卦像.字体.复卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.复卦.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    
    var title = "变卦";

    var 卦象名称StartX = 卦象StartX + this.阳爻宽度 / 2;
    var 卦象名称StartY = 卦象StartY - this.爻高度;
    
    ctx.fillText(title, 卦象名称StartX, 卦象名称StartY);
    
    
    // 上下卦属性
    var 上卦属性 = `(${梅花易数Obj.变卦.上卦.名称}${梅花易数Obj.变卦.上卦.五行})`;
    var 下卦属性 = `(${梅花易数Obj.变卦.下卦.名称}${梅花易数Obj.变卦.下卦.五行})`;
    
    ctx.font = this.梅花易数卦像.字体.上下卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.上下卦.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    
    var 上卦属性StartX = 卦象StartX + this.阳爻宽度 + this.阴爻间距 * GOLDEN_RATE;
    var 上卦属性StartY = 卦象StartY + this.爻高度 * 1.5 + this.爻垂直间距;
    
    ctx.fillText(上卦属性, 上卦属性StartX, 上卦属性StartY);
    
    var 下卦属性StartX = 上卦属性StartX;
    var 下卦属性StartY = 卦象StartY + this.爻高度 * 4.5 + this.爻垂直间距 * 4;
    
    ctx.fillText(下卦属性, 下卦属性StartX, 下卦属性StartY);
    
    // 六十四卦
    ctx.font = this.梅花易数卦像.字体.六十四卦.size;
    ctx.fillStyle = this.梅花易数卦像.字体.六十四卦.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    var 六十四卦title = "火天同人";
    ctx.fillText(六十四卦title, 卦象StartX + this.阳爻宽度 / 2, 卦象StartY + this.爻高度 * 6 + this.爻垂直间距 * 6);
    
    
    //this.draw重卦(ctx, x, y, 梅花易数Obj.变卦.上卦, 梅花易数Obj.变卦.下卦);
    
    ctx.restore();
};



zygrc.init();