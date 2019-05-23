var svgBkGrid = {
    LONG_TICK_MARKS_STEPS: 0,
    SHORT_TICK_MARKS_STEPS: 0,
    LONG_TICK_MARKS_WIDTH: 0,
    SHORT_TICK_MARKS_WIDTH: 0,
    LONG_TICK_MARKS_HEIGHT: 0,
    SHORT_TICK_MARKS_HEIGHT: 0
};

svgBkGrid.setupGrid = function (longMarksSteps) {
    
    initInnerState(longMarksSteps);
    
    var gridContainer = document.getElementsByTagName("svg")[0];

    var gridContainerWidth = gridContainer.width.baseVal.value;
    var gridContainerHeight = gridContainer.height.baseVal.value;

    var svgns = gridContainer.namespaceURI;
    var doc = document;

    genDefs();
    
    setupTranslate();
    
    function initInnerState(longMarksSteps) {
        svgBkGrid.LONG_TICK_MARKS_STEPS = longMarksSteps;
        svgBkGrid.SHORT_TICK_MARKS_STEPS = svgBkGrid.LONG_TICK_MARKS_STEPS / 2;
        
        svgBkGrid.LONG_TICK_MARKS_WIDTH = 10;
        svgBkGrid.SHORT_TICK_MARKS_WIDTH = svgBkGrid.LONG_TICK_MARKS_WIDTH / 2;
        svgBkGrid.LONG_TICK_MARKS_HEIGHT = svgBkGrid.LONG_TICK_MARKS_WIDTH;
        svgBkGrid.SHORT_TICK_MARKS_HEIGHT = svgBkGrid.LONG_TICK_MARKS_HEIGHT / 2;
    }
    
    function setupTranslate() {
        var groups = doc.querySelectorAll("svg>g");
        
        groups.forEach(g => {
            g.setAttribute("transform", "translate(35, 35)");
        });
    }
    
    function genDefs() {
        var defs = doc.getElementsByTagName("defs");
        
        if (defs.length === 0) {
            defs = doc.createElementNS(svgns, "defs");
        } else {
            defs = defs[0];
        }
        
        var gWholeGrid = doc.createElementNS(svgns, "g");
        gWholeGrid.id = "whole-grid";
        
        var gTickMarks = genTickMarksGroup();
        gWholeGrid.appendChild(gTickMarks);
        
        var gAxes = genAxesGroup();
        gWholeGrid.appendChild(gAxes);
        
        var gMarksLabels = genMarksLabelsGroup();
        gWholeGrid.appendChild(gMarksLabels);
        
        var gGrid = genGridGroup();
        gWholeGrid.appendChild(gGrid);
        
        defs.appendChild(gWholeGrid);
        
        gridContainer.appendChild(defs);
    }
    
    function genWholeGridGroup() {
        var gWholeGrid = doc.createElementNS(svgns, "g");
        gWholeGrid.id = "whole-grid";
        
        var useElement = doc.createElementNS(svgns, "use");
        useElement.setAttribute("xlink:href", "#axes");
        gWholeGrid.appendChild(useElement);
        
        useElement = doc.createElementNS(svgns, "use");
        useElement.setAttribute("xlink:href", "#tickMarks");
        gWholeGrid.appendChild(useElement);
        
        useElement = doc.createElementNS(svgns, "use");
        useElement.setAttribute("xlink:href", "#markLabels");
        gWholeGrid.appendChild(useElement);
        
        useElement = doc.createElementNS(svgns, "use");
        useElement.setAttribute("xlink:href", "#grid");
        gWholeGrid.appendChild(useElement);
        
        return gWholeGrid;
    }
    
    function genGridGroup() {
        var gGrid = doc.createElementNS(svgns, "g");
        gGrid.id = "grid";
        gGrid.style.cssText = "stroke: #eee";
        
        var pathData = "";
        
        var horzPath = doc.createElementNS(svgns, "path");
        for (var i = svgBkGrid.SHORT_TICK_MARKS_STEPS; i <= gridContainerHeight; i += svgBkGrid.SHORT_TICK_MARKS_STEPS) {
            pathData += `M 0 ${i} h ${gridContainerWidth}` + " ";
        }
        horzPath.setAttribute("d", pathData);
        gGrid.appendChild(horzPath);
        
        pathData = "";
        
        var vertPath = doc.createElementNS(svgns, "path");
        for (var i = svgBkGrid.SHORT_TICK_MARKS_STEPS; i <= gridContainerWidth; i += svgBkGrid.SHORT_TICK_MARKS_STEPS) {
            pathData += `M ${i} 0 v ${gridContainerHeight}` + " ";
        }
        vertPath.setAttribute("d", pathData);
        gGrid.appendChild(vertPath);
        
        return gGrid;
    }
    
    function genMarksLabelsGroup() {
        var gMarksLabels = doc.createElementNS(svgns, "g");
        gMarksLabels.id = "markLabels";
        gMarksLabels.style.cssText = "fill: #aaa";
        
        var gHorzChild = genMarksLabelsTextGroup("horizontal");
        gMarksLabels.appendChild(gHorzChild);
        
        var gVertChild = genMarksLabelsTextGroup("vertical");
        gMarksLabels.appendChild(gVertChild);
        
        return gMarksLabels;
    }
    
    function genMarksLabelsTextGroup(whichAxis) {
        var g = doc.createElementNS(svgns, "g");
        
        if (whichAxis === "horizontal") {
            g.style.cssText = "font-family: sans-serif; font-size: 8pt; text-anchor: middle;";
        } else {
            g.style.cssText = "font-family: sans-serif; font-size: 8pt; text-anchor: end;";
        }
        
        var iterEndValue = 0;
        
        if (whichAxis === "horizontal") {
            iterEndValue = gridContainerWidth;
        } else {
            iterEndValue = gridContainerHeight;
        }
        
        for (var i = 0; i <= iterEndValue; i += svgBkGrid.LONG_TICK_MARKS_STEPS) {
            var text = doc.createElementNS(svgns, "text");
            
            if (whichAxis === "horizontal") {
                text.setAttribute("x", i);
                text.setAttribute("y", -15);
            } else {
                text.setAttribute("x", -15);
                text.setAttribute("y", i + 3);
            }
            
            text.textContent = "" + i;
            
            g.appendChild(text);
        }
        
        return g;
    }
    
    function genAxesGroup() {
        var gAxes = doc.createElementNS(svgns, "g");
        gAxes.id = "axes";
        gAxes.style.cssText = "stroke: #aaa";
        
        var path = doc.createElementNS(svgns, "path");
        var pathData = `M 0 0 h ${gridContainerWidth} M 0 0 v ${gridContainerHeight}`;
        path.setAttribute("d", pathData);
        
        gAxes.appendChild(path);
        
        return gAxes;
    }

    function genTickMarksGroup() {
        var gTickMarks = doc.createElementNS(svgns, "g");
        gTickMarks.id = "tickMarks";
        gTickMarks.style.cssText = "stroke: #aaa";
        //gTickMarks.setAttribute("transform", "translate(35, 35)");

        var tickMarksPath = genTickMarksPath("horizontal");
        gTickMarks.appendChild(tickMarksPath);

        tickMarksPath = genTickMarksPath("vertical");
        gTickMarks.appendChild(tickMarksPath);
        
        return gTickMarks;
    }

    function genTickMarksPath(whichAxis) {
        var tickMarksPath = doc.createElementNS(svgns, "path");

        var iterEndValue = 0;
        var isLongMark = true;
        var curMarkHeight = 0;
        var pathData = "";

        if (whichAxis === "horizontal") {
            iterEndValue = gridContainerWidth;
        } else {
            iterEndValue = gridContainerHeight;
        }

        for (var i = 0; i <= iterEndValue; i += svgBkGrid.SHORT_TICK_MARKS_STEPS) {
            if (isLongMark) {
                curMarkHeight = svgBkGrid.LONG_TICK_MARKS_HEIGHT;
            } else {
                curMarkHeight = svgBkGrid.SHORT_TICK_MARKS_HEIGHT;
            }

            isLongMark = !isLongMark;

            if (whichAxis === "horizontal") {
                pathData += `M ${i} 0 v -${curMarkHeight}` + " ";
            } else {
                pathData += `M 0 ${i} h -${curMarkHeight}` + " ";
            }
        }

        tickMarksPath.setAttribute("d", pathData);

        return tickMarksPath;
    }
};

//window.addEventListener("load", init);