
//var url = "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=" + fundCode + "&page=1&per=" + recordNum + "&sdate=" + sdate + "&edate=" + edate + "&rt=";

var ttFundsUtils = {
    Max_Records_Per_Page: 20,
    url: "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz"
    
};

ttFundsUtils.retrieveAllNetValuesForAFund = function(fundId, code, progress) {
    this.getWholeInfomation(code, function(pages, records) {
        ttFundsUtils.retrievePageRecords(code, pages, records, progress, function(allRecords) {
            allRecords.sort(function(a, b) {
                if (a.date < b.date) {
                    return 1;
                }
                if (a.date > b.date) {
                    return -1;
                }
                return 0;
            });
            
            progress.value = 0;
            progress.max = allRecords.length;
            
            dbUtils.executeStatements(["DELETE FROM 历史净值 WHERE 基金Id = " + fundId]);
            
            for (var i = 0; i < allRecords.length; i++) {
                //console.log(allRecords[i].date, allRecords[i].netValue, allRecords[i].dailyRate);
                
                dbUtils.executeSingleStatementWithArgs("INSERT INTO 历史净值 VALUES(?, ?, ?, ?)", [fundId, allRecords[i].date, allRecords[i].netValue, allRecords[i].dailyRate]);
                
                progress.value = progress.value + 1;
                progress.nextElementSibling.textContent = (progress.value/progress.max*100).toFixed(0) + "%";
            }
        });
    });
    
    
};

ttFundsUtils.retrieveLatestNetValueForAFund = function(fundId, code, progress) {
    this.retrieveTopPage(code, function(apidata) {
        var table = apidata.content;
        
        var div = document.createElement("div");
        div.innerHTML = table;
        
        var row = div.querySelector("div table tbody tr");
        
        var 日期 = row.cells[0].textContent;
        var 单位净值 = row.cells[1].textContent;
        var 日涨幅 = row.cells[3].textContent;
        
        dbUtils.executeSingleStatementWithArgs("INSERT INTO 历史净值 VALUES(?, ?, ?, ?)", [fundId, 日期, 单位净值, 日涨幅]);
        
        document.body.appendChild(div);
    });
};


ttFundsUtils.retrievePageRecords = function(code, pages, records, progress, handleFunc) {
    var allRecords = [];
    
    progress.value = 0;
    progress.max = records;
    
    for (var page = 1; page <= pages; page++) {
        var url = this.url + "&code=" + code + "&page=" + page + "&per=" + this.Max_Records_Per_Page;

        this.fetchOnePage(url, progress, function(recordsInAPage) {
            allRecords = allRecords.concat(recordsInAPage);
        });
    }
    
    var id = setInterval(checkState, 1000);

    function checkState() {
        if (allRecords.length >= records) {
            clearInterval(id);
            handleFunc(allRecords);
        }
    }
};


ttFundsUtils.getWholeInfomation = function(code, handleFunc) {
    var aScript = document.createElement("script");
    
    aScript.type = "text/javascript";
    aScript.src = this.url + "&code=" + code + "&page=" + 1 + "&per=" + this.Max_Records_Per_Page;
    
    aScript.onload = function() {
        document.head.removeChild(aScript);
        handleFunc(apidata.pages, apidata.records);
    };

    document.head.appendChild(aScript);
};

ttFundsUtils.retrieveTopPage = function(code, handleFunc) {
    var aScript = document.createElement("script");
    
    aScript.type = "text/javascript";
    aScript.src = this.url + "&code=" + code + "&page=" + 1 + "&per=" + 1;
    
    aScript.onload = function() {
        document.head.removeChild(aScript);
        handleFunc(apidata);
    };

    document.head.appendChild(aScript);
};


ttFundsUtils.fetchOnePage = function(url, progress, handleFunc) {
    var records = [];
    
    var aScript = document.createElement("script");
    aScript.type = "text/javascript";

    aScript.src = url;
    
    aScript.onload = function() {
        var div = document.createElement("div");
        div.innerHTML = apidata.content;
        
        var rows = div.querySelectorAll("div table tbody tr");
        
        for (var i = 0; i < rows.length; i++) {
            var record = {
                date: rows[i].cells[0].textContent,
                netValue: rows[i].cells[1].textContent,
                dailyRate: rows[i].cells[3].textContent
            };
            records.push(record);
            progress.value = progress.value + 1;
            progress.nextElementSibling.textContent = (progress.value/progress.max*100).toFixed(0) + "%";
            
        }

        document.head.removeChild(aScript);
        
        handleFunc(records);
    };

    document.head.appendChild(aScript);
};











//ttFundsUtils.retrieveNetValuesForAFundOnPage = function(code, page) {
//    var aScript = document.createElement("script");
//    aScript.type = "text/javascript";
//
//    var url = this.url + "&code=" + code + "&page=" + page + "&per=" + this.Max_Records_Per_Page;
//    
//    aScript.src = url;
//    aScript.onload = function() {
//        var content = apidata.content;
//        var curpage = apidata.curpage;
//        var pages = apidata.pages;
//        var records = apidata.records;
//        
//        console.log(curpage, pages, records);
//
//        document.getElementById("outputDiv").innerHTML = content;
//        
//        document.head.removeChild(aScript);
//    };
//
//    document.head.appendChild(aScript);
//};