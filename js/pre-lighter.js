window.addEventListener("load", init);

function init() {
    var pres = document.getElementsByTagName("pre");
    
    for (var pre of pres) {
        if (pre.dataset.syntax === "css") {
            hilightCSS(pre);
        }
    }
}

function hilightCSS(pre) {
    var source = pre.textContent;
    
    var re = /(\s*)([^}]+})/g;
    var result;
    
    var finalStr = "";

    while ((result = re.exec(source)) !== null) {
        var cssRule = result[2];
        
        var cssRuleReg = /(.+)\s*\{\s*(.+)\}/gs;
        var cssRuleResult;
        
        var ruleStr = "";

        while ((cssRuleResult = cssRuleReg.exec(cssRule)) !== null) {
            var selector = cssRuleResult[1].trim();
            var rules = cssRuleResult[2];
            
            var selectorSpan = "<span class='css-rule-selector'>" + selector + "</span>";
            ruleStr += selectorSpan + " {\n";
            
            var propValuePairs = formatCSSContent(rules);
            
            for (var propValuePair of propValuePairs) {
                var propValReg = /(\s*)(.+)(\s*:\s*)(.+)(\s*;)/g;
                
                var colorfulStr = propValuePair.replace(propValReg, function(match, p1, p2, p3, p4, p5, offset, string) {
                    return p1 + "<span class='css-rule-property'>" + p2 + "</span>" + p3 + "<span class='css-rule-value'>" + p4 + "</span>" + p5;
                });
                
                ruleStr += colorfulStr + "\n";
            }
            
            ruleStr += "}";
        }
        
        ruleStr += "\n\n";
        
        finalStr += ruleStr;
    }
    
    finalStr.trim();
    finalStr = finalStr.replace(/(.+)(\n\n)$/, "$1");
    
    pre.innerHTML = finalStr;
}