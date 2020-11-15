/* 
 * Canvas Geometry Gragphics API
 * 
 *   Sarkuya, 2019-2-2
 */

var GOLDEN_RATE = (Math.sqrt(5) - 1) / 2;

function radianToDegree(radian) {
    return 180 / Math.PI * radian;
}
function degreeFromRadian(radian) {
    return radianToDegree(radian);
}

function degreeToRadian(degree) {
    return Math.PI / 180 * degree;
}
function radianFromDegree(degree) {
    return degreeToRadian(degree);
}

function Point(x, y) {
    return {x:x, y:y};
}

function Rect(x, y, width, height) {
    return {x: x, y: y, width: width, height: height};
}

var geoGrp = {
    canvas: null,
    ctx: null,
    
    Y_AXIS_POSIVE: 'down',
    
    X_POSITIVE_MARKS_MAX_VALUE: 0,
    X_POSITIVE_MARKS_NUM: 0,
    X_UNIT_MARK_LENGTH: 0, /* computed property */
    X_UNIT_LENGTH: 0,
    
    Y_POSITIVE_MARKS_MAX_VALUE: 0,
    Y_POSITIVE_MARKS_NUM: 0,
    Y_UNIT_MARK_LENGTH: 0, /* computed property */
    Y_UNIT_LENGTH: 0,
    
    ORIGIN_POINT_USER: Point(0, 0),
    ORIGIN_POINT_CANVAS: Point(0, 0), /* computed property */
    
    MARK_HEIGHT: 10,
    MARK_LABEL_FONT: "14px serif",
    MARK_LABEL_LENGTH: 0, /* computed property */
    GAP_BETWEEN_MARK_AND_LABEL: 2,
    
    PADDING: 0, /* computed property */
    
    AXIS_ARROW_LENGTH: 12,
    AXIS_ARROW_INTER_ANGLE: radianToDegree(Math.atan(GOLDEN_RATE)),
    
    AXIS_COLOR: "lightgray",
    MARK_LABLEL_COLOR: "rgba(189, 223, 234, 0.5)",
    
    X_MARK_LABEL_POS: "up",
    Y_MARK_LABEL_POS: "left"
    
};

geoGrp.setupCanvas = function(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    
    // calc padding and actual org point in canvas
    var ctx = this.ctx;
    ctx.font = this.MARK_LABEL_FONT;
    var textWidth = ctx.measureText('-99').width;
    this.MARK_LABEL_LENGTH = textWidth;
    this.PADDING = this.MARK_HEIGHT / 2 + this.GAP_BETWEEN_MARK_AND_LABEL + this.MARK_LABEL_LENGTH;
    
    //console.log("in geo, ctx = " + this.ctx);
};

geoGrp.setupCoordinate = function(yAxisPositive, orgPoint, xPositiveMarksMaxValue, xPositiveMarksNum, yPositiveMarksMaxValue, yPositiveMarksNum, isDrawAxis, isDrawMarks) {
    this.Y_AXIS_POSIVE = yAxisPositive;
    
    this.ORIGIN_POINT_USER = orgPoint;
    //this.ORIGIN_POINT_CANVAS = Point(orgPoint.x + this.PADDING, orgPoint.y + this.PADDING);
    this.ORIGIN_POINT_CANVAS = Point(orgPoint.x, orgPoint.y);
    
    this.X_POSITIVE_MARKS_MAX_VALUE = xPositiveMarksMaxValue;
    this.X_POSITIVE_MARKS_NUM = xPositiveMarksNum;
    this.X_UNIT_MARK_LENGTH = (this.canvas.width - this.PADDING - this.ORIGIN_POINT_CANVAS.x) / this.X_POSITIVE_MARKS_NUM;
    this.X_UNIT_LENGTH = this.X_UNIT_MARK_LENGTH / (this.X_POSITIVE_MARKS_MAX_VALUE / this.X_POSITIVE_MARKS_NUM);
    
    this.Y_POSITIVE_MARKS_MAX_VALUE = yPositiveMarksMaxValue;
    this.Y_POSITIVE_MARKS_NUM = yPositiveMarksNum;
    if (this.Y_AXIS_POSIVE === 'up') {
        if (this.ORIGIN_POINT_CANVAS.y - this.PADDING === 0) {
            console.log("Warning: ORIGIN_POINT_CANVAS.y === PADDING! This would cause Y_UNIT_MARK_LENGTH = 0!");
            this.Y_UNIT_MARK_LENGTH = (this.canvas.height - this.PADDING * 2) / this.Y_POSITIVE_MARKS_NUM;
        } else {
            this.Y_UNIT_MARK_LENGTH = (this.ORIGIN_POINT_CANVAS.y - this.PADDING) / this.Y_POSITIVE_MARKS_NUM;
        }
    } else if (this.Y_AXIS_POSIVE === 'down') {
        this.Y_UNIT_MARK_LENGTH = (this.canvas.height - this.PADDING - this.ORIGIN_POINT_CANVAS.y) / this.Y_POSITIVE_MARKS_NUM;
    }
    this.Y_UNIT_LENGTH = this.Y_UNIT_MARK_LENGTH / (this.Y_POSITIVE_MARKS_MAX_VALUE / this.Y_POSITIVE_MARKS_NUM);
    
    if (isDrawAxis) {
        this.drawXAxis(isDrawMarks);
        this.drawYAxis(isDrawMarks);
    }
};

geoGrp.getLeftTopCorner = function() {
    return Point(this.PADDING, this.PADDING);
};

geoGrp.getLeftBottomCorner = function() {
    return Point(this.PADDING, this.canvas.height - this.PADDING);
};

geoGrp.getCenterPoint = function() {
    return Point(this.canvas.width / 2, this.canvas.height / 2);
};

geoGrp.getBoundingRect = function () {
    return Rect(this.PADDING, this.PADDING, this.canvas.width - this.PADDING * 2, this.canvas.height - this.PADDING * 2);
};

geoGrp.getLineLength = function(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

geoGrp.pointFromUserToCanvas = function(pt) {
    var point = Point(0, 0);
        
    point.x = this.ORIGIN_POINT_CANVAS.x + pt.x * this.X_UNIT_LENGTH;
    
    if (this.Y_AXIS_POSIVE === "up") {
        point.y = this.ORIGIN_POINT_CANVAS.y - pt.y * this.Y_UNIT_LENGTH;
    } else if (this.Y_AXIS_POSIVE === "down") {
        point.y = this.ORIGIN_POINT_CANVAS.y + pt.y * this.Y_UNIT_LENGTH;
    }
    
    return point;
};

geoGrp.pointFromCanvasToUser = function(pt) {
    var point = Point(0, 0);
        
    point.x = (pt.x - this.ORIGIN_POINT_CANVAS.x) / this.X_UNIT_LENGTH;
    
    if (this.Y_AXIS_POSIVE === "up") {
        point.y = (this.ORIGIN_POINT_CANVAS.y - pt.y) / this.Y_UNIT_LENGTH;
    } else if (this.Y_AXIS_POSIVE === "down") {
        point.y = (pt.y - this.ORIGIN_POINT_CANVAS.y) / this.Y_UNIT_LENGTH;
    }
    
    return point;
};

geoGrp.rectFromUserToCanvas = function(rect) {
    var localRect = Rect(0, 0, 0, 0);
    
    var point = this.pointFromUserToCanvas(Point(rect.x, rect.y));
    
    localRect.x = point.x;
    localRect.y = point.y;
    localRect.width = rect.width * this.X_UNIT_LENGTH;
    localRect.height = rect.height * this.Y_UNIT_LENGTH;
    
    return localRect;
};

geoGrp.drawBoundary = function() {
    var ctx = this.ctx;

    ctx.strokeRect(this.PADDING, this.PADDING, this.canvas.width - this.PADDING * 2, this.canvas.height - this.PADDING * 2);
};

geoGrp.getImageBoundingRect = function() {
    var ctx = this.ctx;
    var canvas = this.canvas;
    
    var minX = 9999;
    var minY = 9999;
    var maxX = 0;
    var maxY = 0;
    
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    for (var row = 0; row < canvasHeight; row++) {
        for (var col = 0; col < canvasWidth; col++) {
            var pixel = ctx.getImageData(col, row, 1, 1);

            if (pixel.data[0] !== 0 || pixel.data[1] !== 0 || pixel.data[2] !== 0 || pixel.data[3] !== 0) {
                minX = Math.min(minX, col);
                minY = Math.min(minY, row);
                maxX = Math.max(maxX, col);
                maxY = Math.max(maxY, row);
            }
        }
    }

    var x = minX;
    var y = minY;
    var width = maxX - minX + 1;
    var height = maxY - minY + 1;
    
    return Rect(x, y, width, height);
};

geoGrp.centerImage = function() {
    var ctx = this.ctx;
    var canvas = this.canvas;

    var rect = this.getImageBoundingRect();
    var imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //this.drawXAxis(true);
    //this.drawYAxis(true);

    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    var centerImageX = centerX - rect.width / 2;
    var centerImageY = centerY - rect.height / 2;

    ctx.putImageData(imageData, centerImageX, centerImageY);
};

geoGrp.canvasFitImage = function(padding) {
    var ctx = this.ctx;
    var canvas = this.canvas;

    var rect = this.getImageBoundingRect();
    var imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.width = rect.width + padding * 2;
    canvas.height = rect.height + padding * 2;
    
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var centerImageX = centerX - rect.width / 2;
    var centerImageY = centerY - rect.height / 2;

    ctx.putImageData(imageData, centerImageX, centerImageY);
};

geoGrp.drawXAxisLines = function(isDrawMarks) {
    var ctx = this.ctx;
    
    ctx.beginPath();
    
    var org = this.ORIGIN_POINT_CANVAS;
    
    ctx.strokeStyle = this.AXIS_COLOR;
    
    //x positive axis
    ctx.moveTo(org.x, org.y);
    ctx.lineTo(this.canvas.width - this.PADDING, org.y);
    
    // x axis arrow
    ctx.moveTo(this.canvas.width - this.PADDING - this.AXIS_ARROW_LENGTH * Math.cos(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE), org.y - this.AXIS_ARROW_LENGTH * Math.sin(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE));
    ctx.lineTo(this.canvas.width - this.PADDING, org.y);
    ctx.lineTo(this.canvas.width - this.PADDING - this.AXIS_ARROW_LENGTH * Math.cos(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE), org.y + this.AXIS_ARROW_LENGTH * Math.sin(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE));

    if (isDrawMarks) {
        // x positive axis marks
        var startX = 0, startY = 0;
        var endX = 0, endY = 0;

        startX = org.x;

        for (var i = 1; i <= this.X_POSITIVE_MARKS_NUM; i++) {
            startX += this.X_UNIT_MARK_LENGTH;
            startY = org.y - this.MARK_HEIGHT / 2;

            endX = startX;
            endY = startY + this.MARK_HEIGHT;

            if (i !== this.X_POSITIVE_MARKS_NUM) {
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
            }
        }
    }

    // x negative axis
    ctx.moveTo(org.x, org.y);
    ctx.lineTo(this.PADDING, org.y);

    if (isDrawMarks) {
        // x negative axis marks
        startX = org.x;

        var index = 1;

        while (startX - this.X_UNIT_MARK_LENGTH >= this.PADDING) {
            startX -= this.X_UNIT_MARK_LENGTH;
            startY = org.y - this.MARK_HEIGHT / 2;

            endX = startX;
            endY = startY + this.MARK_HEIGHT;

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);

            index++;
        }
    }
    
    ctx.stroke();
    
    ctx.closePath();
};

geoGrp.drawXAxisMarkLabels = function() {
    var ctx = this.ctx;
    
    ctx.strokeStyle = this.MARK_LABLEL_COLOR;
    
    ctx.font = this.MARK_LABEL_FONT;
    ctx.textAlign = "center";
    
    var org = this.ORIGIN_POINT_CANVAS;
    
    // x positive axis mark labels
    var x = 0, y = 0;

    if (this.X_MARK_LABEL_POS === 'up') {
        ctx.textBaseline = "bottom";
        y = org.y - this.MARK_HEIGHT / 2 - this.GAP_BETWEEN_MARK_AND_LABEL;
    } else if (this.X_MARK_LABEL_POS === 'down') {
        ctx.textBaseline = "top";
        y = org.y + this.MARK_HEIGHT / 2 + this.GAP_BETWEEN_MARK_AND_LABEL;
    }
    
    x = org.x;
    
    for (var i = 1; i <= this.X_POSITIVE_MARKS_NUM; i++) {
        x += this.X_UNIT_MARK_LENGTH;
        ctx.strokeText("" + i * (this.X_POSITIVE_MARKS_MAX_VALUE / this.X_POSITIVE_MARKS_NUM), x, y);
    }
    
    // x negative axis mark labels
    x = org.x;

    var index = 1;

    while (x - this.X_UNIT_MARK_LENGTH >= this.PADDING) {
        x -= this.X_UNIT_MARK_LENGTH;
        ctx.strokeText("-" + index * (this.X_POSITIVE_MARKS_MAX_VALUE / this.X_POSITIVE_MARKS_NUM), x, y);
        index++;
    }
};

geoGrp.drawYAxisMarkLabels = function() {
    var ctx = this.ctx;
    
    ctx.strokeStyle = this.MARK_LABLEL_COLOR;
    
    ctx.font = this.MARK_LABEL_FONT;
    ctx.textBaseline = "middle";
    
    var org = this.ORIGIN_POINT_CANVAS;
    
    // y positive axis mark labels
    var x = 0, y = 0;

    if (this.Y_MARK_LABEL_POS === 'left') {
        ctx.textAlign = "right";
        x = org.x - this.MARK_HEIGHT / 2 - this.GAP_BETWEEN_MARK_AND_LABEL;
    } else if (this.Y_MARK_LABEL_POS === 'right') {
        ctx.textAlign = "left";
        x = org.x + this.MARK_HEIGHT / 2 + this.GAP_BETWEEN_MARK_AND_LABEL;
    }
    
    y = org.y;
    
    for (var i = 1; i <= this.Y_POSITIVE_MARKS_NUM; i++) {
        if (this.Y_AXIS_POSIVE === 'up') {
            y -= this.Y_UNIT_MARK_LENGTH;
        } else if (this.Y_AXIS_POSIVE === 'down') {
            y += this.Y_UNIT_MARK_LENGTH;
        }
        ctx.strokeText("" + i * (this.Y_POSITIVE_MARKS_MAX_VALUE / this.Y_POSITIVE_MARKS_NUM), x, y);
    }
    
    // y negative axis mark labels
    y = org.y;

    var index = 1;
    
    if (this.Y_AXIS_POSIVE === 'up') {
        while (y + this.Y_UNIT_MARK_LENGTH <= this.canvas.height - this.PADDING) {
            y += this.Y_UNIT_MARK_LENGTH;
            ctx.strokeText("-" + index * (this.Y_POSITIVE_MARKS_MAX_VALUE / this.Y_POSITIVE_MARKS_NUM), x, y);
            index++;
        }
    } else if (this.Y_AXIS_POSIVE === 'down') {
        while (y - this.Y_UNIT_MARK_LENGTH >= this.PADDING) {
            y -= this.Y_UNIT_MARK_LENGTH;
            ctx.strokeText("-" + index * (this.Y_POSITIVE_MARKS_MAX_VALUE / this.Y_POSITIVE_MARKS_NUM), x, y);
            index++;
        }
    }
};

geoGrp.drawYAxisLines = function(isDrawMarks) {
    var ctx = this.ctx;
    
    ctx.beginPath();
    
    var org = this.ORIGIN_POINT_CANVAS;
    
    ctx.strokeStyle = this.AXIS_COLOR;
    
    //y positive axis
    ctx.moveTo(org.x, org.y);
    if (this.Y_AXIS_POSIVE === 'up') {
        ctx.lineTo(org.x, this.PADDING);
    } else if (this.Y_AXIS_POSIVE === 'down') {
        ctx.lineTo(org.x, this.canvas.height - this.PADDING);
    }
    
    // y axis arrow
    if (this.Y_AXIS_POSIVE === 'up') {
        ctx.moveTo(org.x - this.AXIS_ARROW_LENGTH * Math.sin(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE), this.PADDING + this.AXIS_ARROW_LENGTH * Math.cos(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE));
        ctx.lineTo(org.x, this.PADDING);
        ctx.lineTo(org.x + this.AXIS_ARROW_LENGTH * Math.sin(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE), this.PADDING + this.AXIS_ARROW_LENGTH * Math.cos(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE));
    } else if (this.Y_AXIS_POSIVE === 'down') {
        ctx.moveTo(org.x - this.AXIS_ARROW_LENGTH * Math.sin(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE), this.canvas.height - this.PADDING - this.AXIS_ARROW_LENGTH * Math.cos(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE));
        ctx.lineTo(org.x, this.canvas.height - this.PADDING);
        ctx.lineTo(org.x + this.AXIS_ARROW_LENGTH * Math.sin(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE), this.canvas.height - this.PADDING - this.AXIS_ARROW_LENGTH * Math.cos(Math.PI / 180 * this.AXIS_ARROW_INTER_ANGLE));
    }
    
    if (isDrawMarks) {
        // y positive axis marks
        var startX = 0, startY = 0;
        var endX = 0, endY = 0;

        startX = org.x - this.MARK_HEIGHT / 2;
        endX = startX + this.MARK_HEIGHT;

        startY = org.y;

        for (var i = 1; i <= this.Y_POSITIVE_MARKS_NUM; i++) {
            if (this.Y_AXIS_POSIVE === 'up') {
                startY -= this.Y_UNIT_MARK_LENGTH;
            } else if (this.Y_AXIS_POSIVE === 'down') {
                startY += this.Y_UNIT_MARK_LENGTH;
            }

            endY = startY;

            if (i !== this.Y_POSITIVE_MARKS_NUM) {
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
            }
        }
    }

    // y negative axis
    ctx.moveTo(org.x, org.y);
    
    if (this.Y_AXIS_POSIVE === 'up') {
        ctx.lineTo(org.x, this.canvas.height - this.PADDING);
    } else if (this.Y_AXIS_POSIVE === 'down') {
        ctx.lineTo(org.x, this.PADDING);
    }

    if (isDrawMarks) {
        // y negative axis marks
        startX = org.x - this.MARK_HEIGHT / 2;
        endX = startX + this.MARK_HEIGHT;

        startY = org.y;

        var index = 1;

        if (this.Y_AXIS_POSIVE === 'up') {
            while (startY + this.Y_UNIT_MARK_LENGTH <= this.canvas.height - this.PADDING) {
                startY += this.Y_UNIT_MARK_LENGTH;
                endY = startY;

                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);

                index++;
            }
        } else if (this.Y_AXIS_POSIVE === 'down') {
            while (startY - this.Y_UNIT_MARK_LENGTH >= this.PADDING) {
                startY -= this.Y_UNIT_MARK_LENGTH;
                endY = startY;

                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);

                index++;
            }
        }
    }

    ctx.stroke();
    
    ctx.closePath();
};

geoGrp.drawXAxis = function (isDrawMarks) {
    this.drawXAxisLines(isDrawMarks);
    
    if (isDrawMarks) {
        this.drawXAxisMarkLabels();
    }
};

geoGrp.drawYAxis = function (isDrawMarks) {
    this.drawYAxisLines(isDrawMarks);
    
    if (isDrawMarks) {
        this.drawYAxisMarkLabels();
    }
};

geoGrp.moveTo = function(pt) {
    var point = this.pointFromUserToCanvas(pt);
    
    this.ctx.moveTo(point.x, point.y);
};

/*
 * Because ctx.moveTo() is not used here, we can't use ctx.beginPath() in the method.
 * It's the responsibility of the user to provide beginPath and closePath when using this method.
 * 
 * @param {Point} pt
 * @param {string} color
 * @returns {void}
 */
geoGrp.lineTo = function(pt, color) {
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.strokeStyle = color;
    
    var point = this.pointFromUserToCanvas(pt);
    
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    
    ctx.restore();
};


geoGrp.drawLine = function(pt1, pt2, color) {
    var point1 = this.pointFromUserToCanvas(pt1);
    var point2 = this.pointFromUserToCanvas(pt2);
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.strokeStyle = color;
    
    ctx.beginPath();
    
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    
    ctx.stroke();
    ctx.closePath();
    
    ctx.restore();
};

//geoGrp.drawBrace = function() {
//    var pt1 = Point(0, 0);
//    var pt2 = Point(10, 0);
//    
//    var cp = Point(5, -3);
//    
//    pt1 = this.pointFromUserToCanvas(pt1);
//    pt2 = this.pointFromUserToCanvas(pt2);
//    cp = this.pointFromUserToCanvas(cp);
//    
//    console.log(pt1, pt2, cp);
//    
//    var ctx = this.ctx;
//    
//    ctx.save();
//    
//    ctx.strokeStyle = "magenta";
//    
//    var x = 200, y = 400;
//    
//    var extendLen = 70;
//    var arrowWidth = 15;
//    var arrowHeight = 12;
//    var bodyOffset = 35;
//    var startEndOffset = bodyOffset / 4;
//    var curveHeight = 12;
//    
//    ctx.beginPath();
//    ctx.moveTo(x, y);
//    
//    var cpx = x + startEndOffset;
//    
//    x += bodyOffset, y += curveHeight;
//    ctx.quadraticCurveTo(cpx, y, x, y);
//    
//    x += extendLen;
//    ctx.lineTo(x, y);
//    
//    x += arrowWidth / 2, y+= arrowHeight;
//    ctx.lineTo(x, y);
//    
//    x += arrowWidth / 2, y-= arrowHeight;
//    ctx.lineTo(x, y);
//    
//    x += extendLen;
//    ctx.lineTo(x, y);
//    
//    x += bodyOffset, y -= curveHeight;
//    cpx = x - startEndOffset;
//    ctx.quadraticCurveTo(cpx, y + curveHeight, x, y);
//
//    ctx.stroke();
//    ctx.closePath();
//    
//    ctx.restore();
//};

/*
 * 
 * @param {type} point
 * @param {type} length
 * @param {type} color
 * @param {string} oriantation, "up", "down", "left", "right", inspite of kinds of coordinates
 * @returns {geoGrp.drawLengthBrace.pointFromCanvasToUser.x}
 */
geoGrp.drawLengthBrace = function(point, length, color, oriantation) {
    var localPoint = this.pointFromUserToCanvas(point);
    var _length = length * this.X_UNIT_LENGTH;

    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.strokeStyle = color;
    
    var x = localPoint.x, y = localPoint.y;
    
    // bodyOffset + extendLen + arrowWidth/2 = _length / 2
    // startEndOffset is used to set the control point
    
    // bodyOffset:extendLen:arrowWidth/2 = 4:5:1
    var bodyOffset = _length / 2 * 0.4;
    var extendLen = _length / 2 * 0.5;
    var arrowWidth = _length / 2 * 2 * 0.1;
    
    // control point offset
    var startEndOffset = bodyOffset * 0.3;
    
    //var arrowHeight = arrowWidth * GOLDEN_RATE;
    //var curveHeight = arrowWidth * GOLDEN_RATE;
    
    var arrowHeight = 9;
    var curveHeight = 9;
    
    var arrowPoint = Point(0, 0);
    
    if (oriantation === "down") {
        ctx.beginPath();
        ctx.moveTo(x, y);
    
        var cpx = x + startEndOffset;

        x += bodyOffset, y += curveHeight;
        ctx.quadraticCurveTo(cpx, y, x, y);

        x += extendLen;
        ctx.lineTo(x, y);

        x += arrowWidth / 2, y += arrowHeight;
        ctx.lineTo(x, y);

        arrowPoint = Point(x, y);

        x += arrowWidth / 2, y -= arrowHeight;
        ctx.lineTo(x, y);

        x += extendLen;
        ctx.lineTo(x, y);

        x += bodyOffset, y -= curveHeight;
        cpx = x - startEndOffset;
        ctx.quadraticCurveTo(cpx, y + curveHeight, x, y);
        
        ctx.stroke();
        ctx.closePath();
    } else if (oriantation === "up") {
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        var cpx = x + startEndOffset;

        x += bodyOffset, y -= curveHeight;
        ctx.quadraticCurveTo(cpx, y, x, y);

        x += extendLen;
        ctx.lineTo(x, y);

        x += arrowWidth / 2, y -= arrowHeight;
        ctx.lineTo(x, y);

        arrowPoint = Point(x, y);

        x += arrowWidth / 2, y += arrowHeight;
        ctx.lineTo(x, y);

        x += extendLen;
        ctx.lineTo(x, y);

        x += bodyOffset, y += curveHeight;
        cpx = x - startEndOffset;
        ctx.quadraticCurveTo(cpx, y - curveHeight, x, y);
        
        ctx.stroke();
        ctx.closePath();
    }

    ctx.restore();
    
    return this.pointFromCanvasToUser(arrowPoint);
};

geoGrp.drawRect = function(rect) {
    var localRect = this.rectFromUserToCanvas(rect);
    
    this.ctx.strokeRect(localRect.x, localRect.y, localRect.width, localRect.height);
};

geoGrp.drawRoundedRect = function(rect, r) {
    var localRect = this.rectFromUserToCanvas(rect);
    var localR = r * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ptA = Point(localRect.x + localR, localRect.y);
    var ptB = Point(localRect.x + localRect.width, localRect.y);
    var ptC = Point(localRect.x + localRect.width, localRect.y + localRect.height);
    var ptD = Point(localRect.x, localRect.y + localRect.height);
    var ptE = Point(localRect.x, localRect.y);
    
    var ctx = this.ctx;
    
    ctx.beginPath();
    
    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, localR);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, localR);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, localR);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, localR);
    
    ctx.stroke();
    ctx.closePath();
};

geoGrp.fillRect = function(rect, bgColor) {
    this.ctx.save();
    
    this.ctx.fillStyle = bgColor;
    
    var localRect = this.rectFromUserToCanvas(rect);
    this.ctx.fillRect(localRect.x, localRect.y, localRect.width, localRect.height);
    
    this.ctx.restore();
};

geoGrp.fillRoundedRect = function(rect, r) {
    var localRect = this.rectFromUserToCanvas(rect);
    var localR = r * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ptA = Point(localRect.x + localR, localRect.y);
    var ptB = Point(localRect.x + localRect.width, localRect.y);
    var ptC = Point(localRect.x + localRect.width, localRect.y + localRect.height);
    var ptD = Point(localRect.x, localRect.y + localRect.height);
    var ptE = Point(localRect.x, localRect.y);
    
    var ctx = this.ctx;
    
    ctx.beginPath();
    
    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, localR);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, localR);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, localR);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, localR);
    
    ctx.fill();
    ctx.closePath();
};

geoGrp.drawColorWheel = function(orgPoint, outterRadius, innerRadius, blocksNum) {
    
    var org = this.pointFromUserToCanvas(orgPoint);
    var outR = outterRadius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    var inR = innerRadius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ctx = this.ctx;
    
    ctx.save();
    
    // define a drawing area
    ctx.beginPath();
    ctx.arc(org.x, org.y, outR, 0, Math.PI * 2, true);
    ctx.arc(org.x, org.y, inR, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.closePath();
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.0)';
    
    var angleStep = 360 / blocksNum;
    
    for (var angle = 0; angle < 360; angle += angleStep) {
        ctx.fillStyle = "hsl(" + angle + ", 50%, 50%)";
        
        ctx.beginPath();

        ctx.moveTo(this.ORIGIN_POINT_CANVAS.x, this.ORIGIN_POINT_CANVAS.y);
        ctx.arc(org.x, org.y, outR, Math.PI / 180 * angle , Math.PI / 180 * (angle + angleStep), false);

        //ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    
    ctx.restore();
};

geoGrp.drawGoldenRect = function(point, width, arcNums, isDrawGrid) {
    var localPoint = this.pointFromUserToCanvas(point);
    var localWidth = width * this.X_UNIT_LENGTH;
    var localHeight = localWidth * GOLDEN_RATE;
    
    var ctx = this.ctx;
    
    ctx.save();
    
    var oldStrokeStyle = ctx.strokeStyle;
    
    ctx.strokeStyle = '#ccc';
    
    ctx.beginPath();
    
    ctx.rect(localPoint.x, localPoint.y, localWidth, localHeight);
    
    function getArcStartEndAngles(num) {
        var index = num % 4 - 1;
        if (index === -1) {
            index = 3;
        }
        
        var startAngle = index * 90 + 180;
        startAngle %= 360;
        
        var angleIncrease = 90;
        var endAngle = startAngle + angleIncrease;
        
        return {startAngle: startAngle, endAngle: endAngle};
    }
    
    function ArcArgument(org, r, startAngle, endAngle) {
        this.org = org;
        this.r = r;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    };
    
    var arcArguments = [];
    
    var startX, startY, endX, endY;
    
    startX = localPoint.x;
    startY = localPoint.y + localHeight;

    var longerSegLen, shorterSegLen;
    shorterSegLen = localWidth * GOLDEN_RATE;
    
    for (var i = 1; i <= arcNums; i++) {
        var arcStartEndAngles = getArcStartEndAngles(i);
        
        longerSegLen = shorterSegLen;
        shorterSegLen = longerSegLen * GOLDEN_RATE;
        
        //    var angle1 = [180, 270];  // from up to down
        //    var angle2 = [270, 360];  // from right to left
        //    var angle3 = [0, 90];     // from down to up
        //    var angle4 = [90, 180];   // from left to right
        
        switch(arcStartEndAngles.startAngle) {
            case 180:
                startX = startX + longerSegLen;
                startY = startY - longerSegLen;
                endX = startX;
                endY = startY + longerSegLen;
                break;
            case 270:
                startX = startX + longerSegLen;
                startY = startY + longerSegLen;
                endX = startX - longerSegLen;
                endY = startY;
                break;
            case 0:
                startX = startX - longerSegLen;
                startY = startY + longerSegLen;
                endX = startX;
                endY = startY - longerSegLen;
                break;
            case 90:
                startX = startX - longerSegLen;
                startY = startY - longerSegLen;
                endX = startX + longerSegLen;
                endY = startY;
                break;
        }

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        arcArguments.push(new ArcArgument(Point(endX, endY), longerSegLen, arcStartEndAngles.startAngle, arcStartEndAngles.endAngle));
    }
    
    if (isDrawGrid) {
        ctx.stroke();
    }
    
    ctx.closePath();
    
    // draw arcs
    ctx.strokeStyle = oldStrokeStyle;
    ctx.beginPath();
    
    var factor = Math.PI / 180;
    
    for (var index in arcArguments) {
        var arg = arcArguments[index];
        
        ctx.arc(arg.org.x, arg.org.y, arg.r, factor * arg.startAngle, factor * arg.endAngle, false);
    }
    
    ctx.stroke();
    ctx.closePath();
    
    ctx.restore();
};

geoGrp.drawRegularPolygon = function(orgPoint, radius, verticesNum, isDrawAroundedCircle, isDrawPolygon, isDrawConnectedVertices, isDrawCenterPoint) {
    if (verticesNum <= 2) {
        console.log("Warning! Polygons nees 3 edges at least.");
        return;
    }
    
    var localOrgPoint = this.pointFromUserToCanvas(orgPoint);
    var localRadius = radius * this.X_UNIT_LENGTH;
    
    var ctx = this.ctx;
    
    ctx.translate(localOrgPoint.x, localOrgPoint.y);
    
    switch(verticesNum) {
        case 3:
        case 5:
        case 7:
            ctx.rotate(Math.PI / 180 * -90);
            break;
        case 4:
            ctx.rotate(Math.PI / 180 * -45);
            break;
    }

    //ctx.strokeStyle = 'black';
    
    ctx.beginPath();
    
    // draw arounded circle
    if (isDrawAroundedCircle) {
        ctx.arc(0, 0, localRadius, Math.PI * 2, false);
    }
    
    var angleIncrease = 360 / verticesNum;
    
    var vertices = [];
    
    for (var angle = 0; angle < 360; angle += angleIncrease) {
        var ptX = localRadius * Math.cos(Math.PI / 180 * angle);
        var ptY = localRadius * Math.sin(Math.PI / 180 * angle);
        
        vertices.push(Point(ptX, ptY));
    }
    
    // draw the polygon
    if (isDrawPolygon) {
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (var i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
    }
    
    // draw the connected line
    if (isDrawConnectedVertices) {
        if (verticesNum >= 4) {
            for (var i = 0; i < vertices.length; i++) {
                for (var j = i + 2; j < vertices.length; j++) {
                    if (i === 0 && j === vertices.length - 1) {
                        continue;
                    }

                    ctx.moveTo(vertices[i].x, vertices[i].y);
                    ctx.lineTo(vertices[j].x, vertices[j].y);
                }
            }
        }
    }
    
    ctx.stroke();
    ctx.closePath();
    
    // draw center piont
    if (isDrawCenterPoint) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(0, 0, 2, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
    
};

geoGrp.drawText = function(text, point) {
    var ctx = this.ctx;
    
    var localPoint = this.pointFromUserToCanvas(point);
    
    ctx.strokeText(text, localPoint.x, localPoint.y);
};

geoGrp.drawCenteredTextInRect = function(text, rect) {
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    var localRect = this.rectFromUserToCanvas(rect);
    
    ctx.strokeText(text, localRect.x + localRect.width / 2, localRect.y + localRect.height / 2);
    
    ctx.restore();
};

geoGrp.numArrayToStrArray = function(numArray) {
    return Array.from(numArray, x => x.toFixed(1));
};

geoGrp.drawTextsInBoxes = function(texts, centerPoint, options) {
    var defaultOptions = {
        horzPadding: 10,
        font: "18px Arial",
        cellColor: "black",
        cellBgColor: "hsl(250, 50%, 50%, 0.2)",
        selectedCellsIndex: [0, 1],
        selectedCellsBgColor: "hsl(250, 90%, 70%, 0.2)"
    };
    
    var actualOptions = defaultOptions;
    
    for (var propName in options) {
        actualOptions[propName] = options[propName];
    }
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.beginPath();
    
    ctx.font = actualOptions.font;
    
    var cellWidth = 0;
    var cellHeight = 0;
    
    for (var i = 0; i < texts.length; i++) {
        var textWidth = ctx.measureText(texts[i]).width;
        cellWidth = Math.max(cellWidth, textWidth);
    }
    
    cellWidth = cellWidth + actualOptions.horzPadding * 2;
    
    cellHeight = cellWidth;
    
    var boxesWidth = cellWidth * texts.length;

    var localPoint = this.pointFromUserToCanvas(centerPoint);
    
    localPoint = Point(localPoint.x - boxesWidth / 2, localPoint.y - cellHeight / 2);
    
    // fill whole boxes
    ctx.fillStyle = actualOptions.cellBgColor;
    ctx.fillRect(localPoint.x, localPoint.y, boxesWidth, cellHeight);
    
    // fill selected boxes
    ctx.fillStyle = actualOptions.selectedCellsBgColor;
    for (var index of actualOptions.selectedCellsIndex) {
        ctx.fillRect(localPoint.x + index * cellWidth, localPoint.y, cellWidth, cellHeight);
    }
    
    ctx.strokeStyle = "#666";
    ctx.strokeRect(localPoint.x, localPoint.y, boxesWidth, cellHeight);
    
    var cellXPositions = [];
    cellXPositions.push(localPoint.x);
    
    for (var i = 1; i <= texts.length - 1; i++) {
        var x = localPoint.x + i * cellWidth;
        ctx.moveTo(x, localPoint.y);
        ctx.lineTo(x, localPoint.y + cellHeight);
        cellXPositions.push(x);
    }
    
    ctx.stroke();
    ctx.closePath();
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = actualOptions.cellColor;
    for (var i = 0; i < texts.length; i++) {
        var x = localPoint.x + (i + 0) * (cellWidth) + cellWidth / 2;
        ctx.fillText(texts[i], x, localPoint.y + cellHeight / 2);
    }
    
    ctx.restore();
    
    var userPoint = this.pointFromCanvasToUser(localPoint);
    var rect = Rect(userPoint.x, userPoint.y , boxesWidth / this.X_UNIT_LENGTH, cellHeight / this.Y_UNIT_LENGTH);
    
    var userXPos = Array.from(cellXPositions, x => (x - this.ORIGIN_POINT_CANVAS.x) / this.X_UNIT_LENGTH);
    
    return {
        rect: rect,
        cellWidth: cellWidth / this.X_UNIT_LENGTH,
        cellHeight: cellHeight / this.Y_UNIT_LENGTH,
        cellXPositions: userXPos
    };
};

geoGrp.fillTextAlignLineSegment = function(text, point1, point2, atLinePos, atLineSide, padding, isDrawLineSegment) {
    var _point1 = this.pointFromUserToCanvas(point1);
    var _point2 = this.pointFromUserToCanvas(point2);
    var _padding = padding * this.Y_UNIT_LENGTH;
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.beginPath();
    
    var interAngle = Math.atan2(_point2.y - _point1.y, _point2.x - _point1.x);
    
    ctx.translate(_point1.x, _point1.y);
    ctx.rotate(interAngle);
    
    var lineLength = this.getLineLength(_point1, _point2);
    
    //ctx.arc(0, 0, lineLength, 0, Math.PI * 2, false);
    
    if (isDrawLineSegment) {
        ctx.moveTo(0, 0);
        ctx.lineTo(lineLength, 0);
        ctx.stroke();
    }
    
    var x = 0, y = 0;
    
    ctx.textAlign = atLinePos;
    switch(atLinePos) {
        case 'left':
            x = 0;
            break;
        case 'center':
            x = lineLength / 2;
            break;
        case 'right':
            x = lineLength;
            break;
    }
    
    switch(atLineSide) {
        case 'up':
            ctx.textBaseline = 'bottom';
            y -= _padding;
            break;
        case 'down':
            ctx.textBaseline = 'top';
            y += _padding;
            break;
    }
    
    ctx.fillText(text, x, y);
    
    ctx.closePath();
    ctx.restore();
};

geoGrp.fillText = function(text, point, textColor, font) {
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.fillStyle = textColor;
    ctx.font = font;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    var localPoint = this.pointFromUserToCanvas(point);
    
    ctx.fillText(text, localPoint.x, localPoint.y);
    
    ctx.restore();
};

geoGrp.fillCenteredTextInRect = function(text, rect, textColor, font, bgColor, borderColor) {
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    var localRect = this.rectFromUserToCanvas(rect);
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(localRect.x, localRect.y, localRect.width, localRect.height);
    
    ctx.fillStyle = textColor;
    ctx.font = font;
    ctx.fillText(text, localRect.x + localRect.width / 2, localRect.y + localRect.height / 2);
    
    ctx.strokeStyle = borderColor;
    ctx.strokeRect(localRect.x, localRect.y, localRect.width, localRect.height);
    
    ctx.restore();
};

geoGrp.drawTriangle = function(pt1, pt2, pt3, color) {
    var point1 = this.pointFromUserToCanvas(pt1);
    var point2 = this.pointFromUserToCanvas(pt2);
    var point3 = this.pointFromUserToCanvas(pt3);
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.strokeStyle = color;
    
    ctx.beginPath();
    
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
    
    ctx.stroke();
    ctx.closePath();
    
    ctx.restore();
};

geoGrp.fillTriangle = function(pt1, pt2, pt3, bgColor) {
    var point1 = this.pointFromUserToCanvas(pt1);
    var point2 = this.pointFromUserToCanvas(pt2);
    var point3 = this.pointFromUserToCanvas(pt3);
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.fillStyle = bgColor;
    
    ctx.beginPath();
    
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
    
    ctx.fill();
    ctx.closePath();
    
    ctx.restore();
};

geoGrp.drawArcInIntersectAngle = function(radialSrcPoint, radialDstPoint1, radialDstPoint2, radius) {
    var point1 = this.pointFromUserToCanvas(radialSrcPoint);
    var point2 = this.pointFromUserToCanvas(radialDstPoint1);
    var point3 = this.pointFromUserToCanvas(radialDstPoint2);
    
    var localRadius = radius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ctx = this.ctx;
    ctx.save();
    
    var oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
    
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
    ctx.stroke();
    ctx.clip();
    ctx.closePath();
    
    ctx.strokeStyle = oldStrokeStyle;
    ctx.beginPath();
    ctx.arc(point1.x, point1.y, localRadius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
    
    // undo the clip
    ctx.restore();
};


/*
 * TODO: Bug: if radialDstPoint2's value is not big enough, rotated angle error occurs
 */
geoGrp.fillTextInIntersectAngle = function(text, radialSrcPoint, radialDstPoint1, radialDstPoint2, radius) {
    
    
    var _srcPoint = this.pointFromUserToCanvas(radialSrcPoint);
    var _dstPoint1 = this.pointFromUserToCanvas(radialDstPoint1);
    var _dstPoint2 = this.pointFromUserToCanvas(radialDstPoint2);
    var _radius = radius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    //console.log(_srcPoint, _dstPoint1, _dstPoint2);

    var angle = Math.acos(this.getLineLength(_srcPoint, _dstPoint1) / this.getLineLength(_srcPoint, _dstPoint2)) / 2;
    angle = this.Y_AXIS_POSIVE === 'up' ? angle : -angle;
    
    //console.log(this.getLineLength(_srcPoint, _dstPoint1));
    //console.log(this.getLineLength(_srcPoint, _dstPoint2));
    
    
    var ctx = this.ctx;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    ctx.save();
    
    ctx.translate(_srcPoint.x, _srcPoint.y);
    ctx.rotate(-angle);
    
    ctx.fillText(text, _radius, 0);

    ctx.restore();
};

geoGrp.drawCircle = function(orgPoint, radius) {
    var _orgPoint = this.pointFromUserToCanvas(orgPoint);
    var _radius = radius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ctx = this.ctx;
    
    ctx.beginPath();
    
    ctx.arc(_orgPoint.x, _orgPoint.y, _radius, 0, Math.PI * 2, false);
    
    ctx.stroke();
    ctx.closePath();
};

geoGrp.fillCircle = function(orgPoint, radius, bgColor) {
    var _orgPoint = this.pointFromUserToCanvas(orgPoint);
    var _radius = radius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.beginPath();
    
    ctx.arc(_orgPoint.x, _orgPoint.y, _radius, 0, Math.PI * 2, false);
    
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.closePath();
    
    ctx.restore();
};

geoGrp.drawLineWithArrow = function(startPoint, endPoint, arrowAngle, arrowLength, color) {
    var _startPoint = this.pointFromUserToCanvas(startPoint);
    var _endPoint = this.pointFromUserToCanvas(endPoint);
    var _arrowAngle = Math.PI / 180 * arrowAngle;
    var _arrowLength = arrowLength * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ctx = this.ctx;
    
    ctx.save();
    
    ctx.strokeStyle = color;
    
    ctx.beginPath();
    
    ctx.moveTo(_startPoint.x, _startPoint.y);
    ctx.lineTo(_endPoint.x, _endPoint.y);

    //ctx.arc(_endPoint.x, _endPoint.y, _arrowLength, 0, Math.PI * 2, false);
     
    var angle = Math.atan2(_startPoint.y - _endPoint.y, _endPoint.x - _startPoint.x);
    angle = Math.PI - angle;
    
//    console.log("angle in radian= " + angle);
//    console.log("angle in degree= " + radianToDegree(angle));

    var x = _arrowLength * Math.cos(_arrowAngle + angle);
    var y = _arrowLength * Math.sin(_arrowAngle + angle);
    var arrowEndPoint1 = Point(_endPoint.x + x, _endPoint.y + y);
    
    x = _arrowLength * Math.cos(angle - _arrowAngle);
    y = _arrowLength * Math.sin(angle - _arrowAngle);
    var arrowEndPoint2 = Point(_endPoint.x + x, _endPoint.y + y);
    
    ctx.moveTo(arrowEndPoint1.x, arrowEndPoint1.y);
    ctx.lineTo(_endPoint.x, _endPoint.y);
    ctx.lineTo(arrowEndPoint2.x, arrowEndPoint2.y);
    
    ctx.stroke();
    ctx.closePath();
    
    ctx.restore();
};

geoGrp.drawPathArrow = function(pathData, arrowAngle, arrowLength, pathColor) {
    var ctx = this.ctx;
    
    ctx.save();
    
    var canvasElements = pathData.split(" ");
    var userElements = Array.from(canvasElements);
    
    var startPoint = Point(canvasElements[1], canvasElements[2]);
    startPoint = this.pointFromUserToCanvas(startPoint);
    canvasElements[1] = startPoint.x + "";
    canvasElements[2] = startPoint.y + "";
    
    for (var index = 3; index < canvasElements.length; index++) {
        var element = canvasElements[index];
        
        if (!isNaN(element)) {
            var num = Number(element);
            var value = num * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
            
            if (canvasElements[index - 1] === 'v' && this.Y_AXIS_POSIVE === 'up') {
                value = -value;
            }
            canvasElements[index] = value + "";
        }
    }
    
    // do not draw last line
    canvasElements = canvasElements.slice(0, -2);
    
    var canvasPathData = canvasElements.join(" ");
    
    ctx.strokeStyle = pathColor;
    
    var p = new Path2D(canvasPathData);
    ctx.stroke(p);
    
    // get last two points in user coordinate
    
    // the current point
    var x = Number(userElements[1]);
    var y = Number(userElements[2]);
    
    // save the first point
    var firstPoint = Point(x, y);
    
    var lastSecondPoint = Point(0, 0);
    var lastPoint = Point(0, 0);
    
    for (var index = 3; index < userElements.length; index++) {
        var element = userElements[index];
        
        if (!isNaN(element)) {
            var num = Number(element);
            
            if (userElements[index - 1] === 'h') {
                x += num;
            }
            
            if (userElements[index - 1] === 'v' ) {
                y += num;
            }
        }
        
        if (index === userElements.length - 3) {
            lastSecondPoint.x = x;
            lastSecondPoint.y = y;
        }
        
        if (index === userElements.length - 1) {
            lastPoint.x = x;
            lastPoint.y = y;
        }
    }
    
    // only two points
    if (userElements.length === 5) {
        lastSecondPoint.x = firstPoint.x;
        lastSecondPoint.y = firstPoint.y;
    }
    
    this.drawLineWithArrow(lastSecondPoint, lastPoint, arrowAngle, arrowLength, pathColor);
    
    ctx.restore();
};

geoGrp.drawArcWithArrow = function(orgPoint, radius, startAngle, endAngle, isCounterClockwise, arrowAngle, arrowLength) {
    var _orgPoint = this.pointFromUserToCanvas(orgPoint);
    var _radius = radius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    var _startAngle = degreeToRadian(startAngle);
    var _endAngle = degreeToRadian(endAngle);
    var _arrowAngle = Math.PI / 180 * arrowAngle;
    var _arrowLength = arrowLength * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    
    var ctx = this.ctx;
    
    ctx.beginPath();
    
    ctx.arc(_orgPoint.x, _orgPoint.y, _radius, _startAngle,_endAngle, isCounterClockwise);
    
    var arcEndPointX = _radius * Math.cos(_endAngle) + _orgPoint.x;
    var arcEndPointY = _radius * Math.sin(_endAngle) + _orgPoint.y;
    
    var arcEndPoint = Point(arcEndPointX, arcEndPointY);
    
//    ctx.moveTo(_orgPoint.x, _orgPoint.y);
//    ctx.lineTo(arcEndPointX, arcEndPointY);
//    ctx.arc(arcEndPointX, arcEndPointY, _arrowLength, 0, Math.PI * 2, false);
    
    var angle = Math.atan2(_orgPoint.y - arcEndPoint.y, arcEndPoint.x - _orgPoint.x);
    angle = Math.PI - angle;
    
    var x;
    var y;
    
    if (isCounterClockwise === false) {
        x = _arrowLength * Math.cos(angle + Math.PI / 2 - _arrowAngle);
        y = _arrowLength * Math.sin(angle + Math.PI / 2 - _arrowAngle);
    } else {
        x = _arrowLength * Math.cos(angle - Math.PI / 2 + _arrowAngle);
        y = _arrowLength * Math.sin(angle - Math.PI / 2 + _arrowAngle);
    }
    var resultPoint1 = Point(arcEndPoint.x + x, arcEndPoint.y + y);
    
    if (isCounterClockwise === false) {
        x = _arrowLength * Math.cos(angle + Math.PI / 2 + _arrowAngle);
        y = _arrowLength * Math.sin(angle + Math.PI / 2 + _arrowAngle);
    } else {
        x = _arrowLength * Math.cos(angle - Math.PI / 2 - _arrowAngle);
        y = _arrowLength * Math.sin(angle - Math.PI / 2 - _arrowAngle);
    }
    
    var resultPoint2 = Point(arcEndPoint.x + x, arcEndPoint.y + y);
    
    ctx.moveTo(resultPoint1.x, resultPoint1.y);
    ctx.lineTo(arcEndPoint.x, arcEndPoint.y);
    ctx.lineTo(resultPoint2.x, resultPoint2.y);
    
    ctx.stroke();
    ctx.closePath();
};

geoGrp.fillRotatedTextAroundPoint = function(text, orgPoint, radius, angle) {
    var _orgPoint = this.pointFromUserToCanvas(orgPoint);
    var _radius = radius * Math.min(this.X_UNIT_LENGTH, this.Y_UNIT_LENGTH);
    var _angle = degreeToRadian(angle);
    
    var ctx = this.ctx;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    ctx.save();
    
    ctx.translate(_orgPoint.x, _orgPoint.y);
    ctx.rotate(_angle);
    
    ctx.fillText(text, _radius, 0);
    
    ctx.restore();
};

// geoGrp.drawPerpendicularLine

