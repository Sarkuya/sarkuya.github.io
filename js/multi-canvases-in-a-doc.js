function sortRenderingNames(changableScriptId) {
    var script = document.getElementById(changableScriptId);

    var index = 0;

    script.textContent = script.textContent.replace(/(function\s+)(doInCanvas)(\(\))/g, function (match, p1, p2, p3, offset, string) {
        index++;
        var str = p1 + p2 + index + p3;
        return str;
    });

    index = 0;

    script.textContent = script.textContent.replace(/(\")(canvas0)(\")/g, function (match, p1, p2, p3, offset, string) {
        index++;
        var str = p1 + "canvas" + index + p3;
        return str;
    });

    var newScript = document.createElement("script");
    newScript.textContent = script.textContent;

    document.head.removeChild(script);
    document.head.appendChild(newScript);

    return index;
}

function sortCanvasId() {
    var canvases = document.querySelectorAll("canvas");

    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        canvas.id = "canvas" + (i + 1);
    }
}