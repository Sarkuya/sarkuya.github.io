function init() {
    createTable(0x0000, 0x007F);
}

function createTable(start, end) {
    var tableElement = document.createElement("table");
    
    var caption = document.createElement("caption");
    caption.textContent = "HTML Unicode Table";
    
    // thead
    var theadElement = document.createElement("thead");
    
    var trElement = document.createElement("tr");
    
    var thElement = document.createElement("th");
    thElement.textContent = "U+";
    trElement.appendChild(thElement);

    for (var i = 0; i <= 0x0F; i++) {
        var title = i.toString(16).toUpperCase();
        var thElement = document.createElement("th");
        thElement.textContent = title;
        trElement.appendChild(thElement);
    }
    theadElement.appendChild(trElement);
    
    // tbody
    var tbodyElement = document.createElement("tbody");
    
    // each row
    for (var i = start; i <= end; i+=0x0F+1) {
        var trElement = document.createElement("tr");
        
        // th in each row
        var hexString = i.toString(16);
        var prefixZeroCount = 4 - hexString.length;
        var headColumnTitle = "0".repeat(prefixZeroCount) + hexString.toUpperCase();
        
        var thElement = document.createElement("th");
        thElement.textContent = headColumnTitle;
        trElement.appendChild(thElement);
        
        // tds in each row
        for (var j = 0x0; j <= 0xF; j++) {
            var hexValue = parseInt(thElement.textContent, 16);
            hexValue += j;
            
            var tdElement = document.createElement("td");
            tdElement.innerHTML = "&#x" + hexValue.toString(16) + ";";
            trElement.appendChild(tdElement);
        }
        
        tbodyElement.appendChild(trElement);
    }
    
    // assemble into a table
    tableElement.appendChild(caption);
    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);
    
    document.getElementById("output_table").appendChild(tableElement);
}

function onSelectUnicodeField(event) {
    document.getElementById("output_table").innerHTML = "";
    
    var selectElement = event.target;
    
    var selectedText = selectElement.options[selectElement.selectedIndex].text;
    
    var rangeString = selectedText.split(":");
    var rangeArray = rangeString[0].split("-");
    var start = rangeArray[0];
    var end = rangeArray[1];
    
    createTable(parseInt(start, 16), parseInt(end, 16));
}