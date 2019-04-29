
(function(){

})();

var htmlDocUtils = {};

htmlDocUtils.init = function() {
    htmlDocUtils.numberingChapters();
    htmlDocUtils.makeToc();
    htmlDocUtils.highLightPre();
};

htmlDocUtils.highLightPre = function() {
    var preElements = document.querySelectorAll("article pre");
    
    preElements.forEach(function(preElement, index){
        var content = preElement.innerHTML;
        

    });
};

htmlDocUtils.makeLinkSpan = function(href, textContent) {
    var link = document.createElement("a");
    link.setAttribute("href", href);
    link.innerHTML = textContent;

    var span = document.createElement("span");
    span.appendChild(link);
    
    return span;
};

htmlDocUtils.makeTocDL = function() {
    var toc = document.createElement("div");
    toc.className = "toc";
    
    var bElement = document.createElement("b");
    bElement.innerText = "目录";
    var pElement = document.createElement("p");
    pElement.appendChild(bElement);
    toc.appendChild(pElement);
    
    var dlElement = document.createElement("dl");
    dlElement.className = "toc";
    toc.appendChild(dlElement);
    
    document.querySelector("article>header").appendChild(toc);
    
    return dlElement;
};

htmlDocUtils.makeToc = function() {
    var dlElement = this.makeTocDL();
    
    var chapterTitles = document.querySelectorAll("article>section>h1");
    
    chapterTitles.forEach(function(chapterTitleElement, index){
        chapterTitleElement.setAttribute("id", "ch"+(index+1));
        
        var span = htmlDocUtils.makeLinkSpan("#ch"+(index+1), chapterTitleElement.innerText);
        var dt = document.createElement("dt");
        dt.appendChild(span);
        
        dlElement.appendChild(dt);
        
        var chapterElement = chapterTitleElement.parentElement;
        var firstSectionTitles = chapterElement.querySelectorAll("article>section>section>h1");
        
        var firstSectionDD;
        var firstSectionDL;
        
        if (firstSectionTitles.length > 0) {
            firstSectionDD = document.createElement("dd");
            firstSectionDL = document.createElement("dl");
            firstSectionDD.appendChild(firstSectionDL);
            dlElement.appendChild(firstSectionDD);
        }
        
        firstSectionTitles.forEach(function(firstSectionTitleElement, index){
            var indexPart = firstSectionTitleElement.innerText.replace(/ .+/, "");
            var array = indexPart.split(".");
            var chapterIndex = array[0];
            var firstSectionIndex = array[1];
            
            var id = "ch"+chapterIndex+"s"+firstSectionIndex;
            firstSectionTitleElement.setAttribute("id", id);
            
            var span = htmlDocUtils.makeLinkSpan("#"+id, firstSectionTitleElement.innerText);
            
            var firstSectionDT = document.createElement("dt");
            firstSectionDT.appendChild(span);
            
            firstSectionDL.appendChild(firstSectionDT);
            
            var firstSectionElement = firstSectionTitleElement.parentElement;
            var secondSectionTitles = firstSectionElement.querySelectorAll("article>section>section>section>h1");
            
            var secondSectionDD;
            var secondSectionDL;

            if (secondSectionTitles.length > 0) {
                secondSectionDD = document.createElement("dd");
                secondSectionDL = document.createElement("dl");
                secondSectionDD.appendChild(secondSectionDL);
                firstSectionDL.appendChild(secondSectionDD);
            }
            
            secondSectionTitles.forEach(function(secondSectionTitleElement, index){
                var indexPart = secondSectionTitleElement.innerText.replace(/ .+/, "");
                var array = indexPart.split(".");
                var chapterIndex = array[0];
                var firstSectionIndex = array[1];
                var secondSectionIndex = array[2];

                var id = "ch"+chapterIndex+"s"+firstSectionIndex +"s"+secondSectionIndex;
                secondSectionTitleElement.setAttribute("id", id);
                
                var span = htmlDocUtils.makeLinkSpan("#"+id, secondSectionTitleElement.innerText);
            
                var secondSectionDT = document.createElement("dt");
                secondSectionDT.appendChild(span);
                
                secondSectionDL.appendChild(secondSectionDT);
            });
        });
    });
};

htmlDocUtils.numberingChapters = function() {
    // chapters -> 1. Chatper_Title
    var chapterTitles = document.querySelectorAll("article>section.chapter>h1");
    
    chapterTitles.forEach(function(chapterTitleElement, index){
        var chapterIndex = index + 1;
        chapterTitleElement.innerHTML = "<span class='indexNum'>" + chapterIndex + " </span>" + chapterTitleElement.innerText;
        
        // first level sections -> 1.1 Section_Title
        var chapterElement = chapterTitleElement.parentElement;
        var firstSectionTitles = chapterElement.querySelectorAll("article>section.chapter>section>h1");
        
        firstSectionTitles.forEach(function(firstSectionTitleElement, index){
            var firstSectionIndex = index + 1;
            firstSectionTitleElement.innerText = chapterIndex + "." + firstSectionIndex + " " + firstSectionTitleElement.innerText;
            
            // second level sections -> 1.1.1 Section_Title
            var firstSectionElement = firstSectionTitleElement.parentElement;
            var secondSectionTitles = firstSectionElement.querySelectorAll("article>section.chapter>section>section>h1");
            
            secondSectionTitles.forEach(function(secondSectionTitleElement, index){
                var secondSectionIndex = index + 1;
                secondSectionTitleElement.innerText = chapterIndex + "." + firstSectionIndex + "." + secondSectionIndex + " " + secondSectionTitleElement.innerText;
            });
        });
    });
};

window.addEventListener("DOMContentLoaded", htmlDocUtils.init);