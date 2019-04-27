
(function(){

})();

var htmlDocUtils = {};

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

window.addEventListener("DOMContentLoaded", htmlDocUtils.numberingChapters);