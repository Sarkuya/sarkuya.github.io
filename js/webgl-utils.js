webglUtils = {};

webglUtils.initContext = function(canvasId) {
    if (!window.WebGLRenderingContext) {
        alert("Your browser doese not support WebGL!");
        return null;
    }
    
    var canvas = document.getElementById(canvasId);
    if (!canvas) {
        alert("Unable to find '" + canvasId + "' element");
        return null;
    }

    var ctx = canvas.getContext("webgl");

    if (!ctx) {
        alert("Unable to initialize WebGL!");
        return null;
    }
    
    return ctx;
};

webglUtils.prepareProgram = function(ctx, vshader, fshader) {
    var vertexShader = this.loadShader(ctx, vshader);
    var fragmentShader = this.loadShader(ctx, fshader);

    var program = ctx.createProgram();

    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);

    ctx.linkProgram(program);

    var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
    if (!linked) {
        var error = ctx.getProgramInfoLog(program);
        alert("Error in program linking: " + error);

        ctx.deleteProgram(program);
        ctx.deleteProgram(fragmentShader);
        ctx.deleteProgram(vertexShader);

        return null;
    }

    ctx.useProgram(program);

    return program;
};

webglUtils.loadShader = function(ctx, shaderId) {
    var shaderScript = document.getElementById(shaderId);

    if (!shaderScript) {
        alert("Error: shader script '" + shaderId + "' not found");
        return null;
    }

    var shaderType;

    if (shaderScript.type === "x-shader/x-vertex")
        shaderType = ctx.VERTEX_SHADER;
    else if (shaderScript.type === "x-shader/x-fragment")
        shaderType = ctx.FRAGMENT_SHADER;
    else {
        alert("Error: shader script '" + shaderId + "' of undefined type '" + shaderScript.type + "'");
        return null;
    }

    var shader = ctx.createShader(shaderType);

    ctx.shaderSource(shader, shaderScript.text);
    ctx.compileShader(shader);

    var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
    if (!compiled) {
        var error = ctx.getShaderInfoLog(shader);
        alert("Error compiling shader '" + shaderId + "':" + error);
        ctx.deleteShader(shader);
        return null;
    }

    return shader;
};

webglUtils.getActiveAttribs = function(ctx) {
    var maxVertexAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);

    for (var i = 0; i < maxVertexAttribs; i++) {
        var activeAttrib = ctx.getActiveAttrib(ctx.program, i);

        if (activeAttrib) {
            console.log(i);
            console.log(activeAttrib);
        }
    }
};

webglUtils.getVertexAttribs = function(ctx) {
    var maxVertexAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);

    for (var i = 0; i < maxVertexAttribs; i++) {
        var flag = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_ENABLED);

        if (flag) {
            var bufferBinding = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
            var isEnabled = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_ENABLED);
            var arraySize = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_SIZE);
            var arrayStride = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_STRIDE);
            var arrayType = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_TYPE);
            var isNormalized = ctx.getVertexAttrib(i, ctx.VERTEX_ATTRIB_ARRAY_NORMALIZED);
            var currentVertexAttrib = ctx.getVertexAttrib(i, ctx.CURRENT_VERTEX_ATTRIB);

            console.log(i);
            console.log(bufferBinding);
            console.log(isEnabled);
            console.log(arraySize);
            console.log(arrayStride);
            console.log(arrayType);
            console.log(isNormalized);
            console.log(currentVertexAttrib);
        }
    }
};

webglUtils.genRegularPolygonsVertices = function(verticesNum, r, angle) {
    var angleIncrease = 360 / verticesNum;
    
    var vertices = [];
    
    for (var pointAngle = 0; pointAngle < 360; pointAngle += angleIncrease) {
        var radian = this.radianFromDegree(pointAngle);
        var ptX = r * Math.cos(radian);
        var ptY = r * Math.sin(radian);
        
        var vector = new J3DIVector3(ptX, ptY, 0.0);
        this.rotateVectorAroundZ(vector, angle);
        
        vertices.push(vector[0], vector[1]);
    }
    
    return vertices;
};

webglUtils.translateVector = function(vector, x, y, z) {
    var matrix = new J3DIMatrix4();
    
    matrix.$matrix.m41 = x;
    matrix.$matrix.m42 = y;
    matrix.$matrix.m43 = z;
    
    vector.multVecMatrix(matrix);
};

// positive angle for anti-clockwise
webglUtils.rotateVectorAroundZ = function(vector, angle) {
    var matrix = new J3DIMatrix4();
    
    var radian = this.radianFromDegree(angle);
    
    matrix.$matrix.m11 =  Math.cos(radian);
    matrix.$matrix.m12 =  Math.sin(radian);
    matrix.$matrix.m21 = -Math.sin(radian);
    matrix.$matrix.m22 =  Math.cos(radian);
    
    vector.multVecMatrix(matrix);
};

webglUtils.radianFromDegree = function(angle) {
    return Math.PI / 180 * angle;
};