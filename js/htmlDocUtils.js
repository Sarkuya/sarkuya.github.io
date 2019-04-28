
(function(){

})();

var htmlDocUtils = {};

htmlDocUtils.init = function() {
    
    htmlDocUtils.numberingChapters();
    htmlDocUtils.makeToc();
};

htmlDocUtils.makeToc = function() {
    var articleHeaderElement = document.querySelector("article>header");

    var toc = document.createElement("div");
    toc.className = "toc";
    
    var bElement = document.createElement("b");
    bElement.innerText = "目录";
    var pElement = document.createElement("p");
    pElement.appendChild(bElement);
    toc.appendChild(pElement);
    
    var dlElement = document.createElement("dl");
    dlElement.className = "toc";
    
    
    var chapterTitles = document.querySelectorAll("article>section>h1");
    
    chapterTitles.forEach(function(chapterTitleElement, index){
        chapterTitleElement.setAttribute("id", "ch"+(index+1));
        
        var link = document.createElement("a");
        link.setAttribute("href", "#ch"+(index+1));
        link.innerHTML = chapterTitleElement.innerText;
        
        var span = document.createElement("span");
        span.appendChild(link);
        
        var dt = document.createElement("dt");
        dt.appendChild(span);
        
        dlElement.appendChild(dt);
        
        
        var chapterElement = chapterTitleElement.parentElement;
        var firstSectionTitles = chapterElement.querySelectorAll("article>section>section>h1");
        
        var firstSectionDD = document.createElement("dd");
        var firstSectionDL = document.createElement("dl");
        firstSectionDD.appendChild(firstSectionDL);
        dlElement.appendChild(firstSectionDD);
        
        firstSectionTitles.forEach(function(firstSectionTitleElement, index){
            var indexPart = firstSectionTitleElement.innerText.replace(/ .+/, "");
            var array = indexPart.split(".");
            var chapterIndex = array[0];
            var firstSectionIndex = array[1];
            
            var id = "ch"+chapterIndex+"s"+firstSectionIndex;

            firstSectionTitleElement.setAttribute("id", id);
            
            var link = document.createElement("a");
            link.setAttribute("href", "#"+id);
            link.innerHTML = firstSectionTitleElement.innerText;

            var span = document.createElement("span");
            span.appendChild(link);
            
            var firstSectionDT = document.createElement("dt");
            firstSectionDT.appendChild(span);
            
            firstSectionDL.appendChild(firstSectionDT);
            
            console.log(firstSectionDL.innerHTML);
        });
        
        

    });
    
    toc.appendChild(dlElement);
    articleHeaderElement.appendChild(toc);
    
    
    
    
    
    
    
    

    //console.log(toc);
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