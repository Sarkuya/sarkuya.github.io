window.addEventListener("DOMContentLoaded", init);

function init() {
    const CANVAS_HORZ_MARGIN = 20;
    
    var canvas = document.getElementById("webgl-canvas");
    canvas.width = document.body.clientWidth - CANVAS_HORZ_MARGIN;
    canvas.height = canvas.width;
}