/*
 * Version 0.01
 * Author: Sarkuya, 2020-10-23
 */

window.addEventListener("load", init);

function init() {
    var pres = document.getElementsByTagName("pre");
    
    for (var pre of pres) {
        if (pre.dataset.syntax === "css") {
            hilightCSS(pre);
        }
        
        if (pre.dataset.syntax === "html") {
            hilightHTML(pre);
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

function hilightHTML(pre) {
    var source = pre.textContent;

    var re = new RegExp("(</?)([^>\\s]+)(\\s?[^>]*>)", "gi");

    var newString = source.replace(re, function(match, p1, p2, p3, offset, string) {
        function processAttribs(str) {
            var reg = /(\s*)(\w+)(\s*)=(\s*)("[^"]*")/g;

            var resultStr = str.replace(reg, function(match, space1, attribName, space2, space3, attribValue, offset, string) {
                return space1 + "<span class='htmltag-attrib-name'>" + attribName + "</span>" + space2 + "=" + space3 + "<span class='htmltag-attrib-value'>" + attribValue + "</span>";
            });

            return resultStr;
        }

        p1 = p1.replace(/</g, "&lt;");
        p3 = p3.replace(/>/g, "&gt;");

        p3 = processAttribs(p3);

        return p1 + "<span class='htmltag-name'>" + p2 + "</span>" + p3;
    });

    pre.innerHTML = newString;
}