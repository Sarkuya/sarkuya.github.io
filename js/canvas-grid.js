function radianToDegree(radian) {
    return 180 / Math.PI * radian;
}

function degreeToRadian(degree) {
    return Math.PI / 180 * degree;
}

function Point(x, y) {
    return {x:x, y:y};
}

function Rect(x, y, width, height) {
    return {x: x, y: y, width: width, height: height};
}

var GRID_PADDING = 28;

var LONG_MARK_LENGTH = 5;
var SHORT_MARK_LENGTH = LONG_MARK_LENGTH / 2;
var LONG_MARK_GAP = 50;

var GRID_LENGTH = LONG_MARK_GAP / 2;

var GRID_STROKE_STYLE = "#999";

var ARROW_ANGLE = 30;
var ARROW_LENGTH = 10;

function init() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight - 105;

    ctx.translate(GRID_PADDING, GRID_PADDING);

    drawXAxis(ctx);
    drawYAxis(ctx);
    drawGrids(ctx);

    //doDrawing(ctx);
}

function doDrawing(ctx) {
    ctx.beginPath();

    ctx.rect(50, 50, 100, 100);

    ctx.fillStyle = "hsla(160, 80%, 20%, 0.8)";
    ctx.font = "40px serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillText("Hello World", 400, 250);

    ctx.moveTo(500, 250);
    ctx.arc(400, 250, 100, Math.PI / 180 * 0, Math.PI / 180 * 360, false);

    ctx.stroke();
    ctx.closePath();
}

function drawXAxis(ctx) {
    ctx.save();

    ctx.strokeStyle = GRID_STROKE_STYLE;

    var canvas = ctx.canvas;

    ctx.beginPath();

    // x-axis line
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width - GRID_PADDING * 2, 0);

    // x-axis arrow
    var xAxisArrowX = canvas.width - GRID_PADDING * 2;
    var xAxisArrowY = 0;
    var radian = Math.PI / 180 * ARROW_ANGLE;

    var xOffset = Math.cos(radian) * ARROW_LENGTH;
    var yOffset = Math.sin(radian) * ARROW_LENGTH;

    ctx.moveTo(xAxisArrowX - xOffset, xAxisArrowY - yOffset);
    ctx.lineTo(xAxisArrowX, xAxisArrowY);
    ctx.lineTo(xAxisArrowX - xOffset, xAxisArrowY + yOffset);

    // long marks
    var x = 0;
    var y1 = -LONG_MARK_LENGTH;
    var y2 = LONG_MARK_LENGTH;

    while (x < xAxisArrowX - xOffset) {
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);

        x += LONG_MARK_GAP;
    }

    // short marks
    x = LONG_MARK_GAP / 2;
    y1 = -SHORT_MARK_LENGTH;
    y2 = SHORT_MARK_LENGTH;

    while (x < xAxisArrowX - xOffset) {
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);

        x += LONG_MARK_GAP;
    }

    // mark labels
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    x = 0;
    var y = -LONG_MARK_LENGTH;

    while (x < xAxisArrowX - xOffset) {
        ctx.fillText(x + "", x, y);

        x += LONG_MARK_GAP;
    }

    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function drawYAxis(ctx) {
    ctx.save();

    ctx.strokeStyle = GRID_STROKE_STYLE;

    var canvas = ctx.canvas;

    ctx.beginPath();

    // y-axis line
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height - GRID_PADDING * 2);

    // y-axis arrow
    var yAxisArrowX = 0;
    var yAxisArrowY = canvas.height - GRID_PADDING * 2;
    var radian = Math.PI / 180 * ARROW_ANGLE;

    var xOffset = Math.sin(radian) * ARROW_LENGTH;
    var yOffset = Math.cos(radian) * ARROW_LENGTH;

    ctx.moveTo(yAxisArrowX - xOffset, yAxisArrowY - yOffset);
    ctx.lineTo(yAxisArrowX, yAxisArrowY);
    ctx.lineTo(yAxisArrowX + xOffset, yAxisArrowY - yOffset);

    // long marks
    var x1 = -LONG_MARK_LENGTH;
    var x2 = LONG_MARK_LENGTH;
    var y = 0;

    while (y < yAxisArrowY - yOffset) {
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);

        y += LONG_MARK_GAP;
    }

    // short marks
    x1 = -SHORT_MARK_LENGTH;
    x2 = SHORT_MARK_LENGTH;
    y = LONG_MARK_GAP / 2;

    while (y < yAxisArrowY - yOffset) {
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);

        y += LONG_MARK_GAP;
    }

    // mark labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    var x = -LONG_MARK_LENGTH - 4;
    var y = 0;

    while (y < yAxisArrowY - yOffset) {
        ctx.fillText(y + "", x, y);

        y += LONG_MARK_GAP;
    }

    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function drawGrids(ctx) {
    ctx.save();

    ctx.strokeStyle = "#eee";

    ctx.beginPath();

    //horizontal grids
    var x1 = 0;
    var x2 = ctx.canvas.width - GRID_PADDING * 2;
    var y = GRID_LENGTH;

    while (y <= canvas.height - GRID_PADDING * 2) {
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);

        y += GRID_LENGTH;
    }

    //vertical grids
    var x = GRID_LENGTH;
    var y1 = 0;
    var y2 = ctx.canvas.height - GRID_PADDING * 2;

    while (x <= ctx.canvas.width - GRID_PADDING * 2) {
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);

        x += GRID_LENGTH;
    }

    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

window.addEventListener("DOMContentLoaded", init);

