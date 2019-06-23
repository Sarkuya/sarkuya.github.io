function matchInClosestBrace() {
    var srcContent = `
function aa() {ccc} function bb(a, b) {ddd}
`;
    // 1. {
    // 2. char, which is not '}', 0 or more
    // 3. }
    var reg = /\{[^\}]*\}/g;

    var result;

    while((result = reg.exec(srcContent)) !== null) {
        console.log(result[0]);
    }
}

function matchFunctionsInMultiLines(contentStr) {
    // 1. funciton
    // 2. space
    // 3. function name
    // 4. space
    // 5. (
    // 6. params
    // 7. )
    // 8. {
    // 9. char, which is not '}', 0 or more
    // 10. }
    var reg = /function\s+\w+\s*\(\s*((\w+)*(\s*,\s*\w+)*)*\s*\)\s+\{[^\}]*\}/g;

    var result;

    while((result = reg.exec(contentStr)) !== null) {
        console.log(result);
    }
}


