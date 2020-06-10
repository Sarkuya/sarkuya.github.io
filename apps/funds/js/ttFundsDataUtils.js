var ttFundsDataUtils = {
    // max records per page are 49
    Max_Records_Per_Page: 49,

    url: "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz"
};

ttFundsDataUtils.getBasicInfo = function (code, handleFunc, isShowLoding) {
    var aScript = document.createElement("script");

    aScript.type = "text/javascript";
    aScript.src = this.url + "&code=" + code + "&page=" + 1 + "&per=" + this.Max_Records_Per_Page;

    aScript.onload = function () {
        document.head.removeChild(aScript);
        if (isShowLoding) {
            $.mobile.loading("hide");
        }
        handleFunc(apidata.pages, apidata.records);
    };

    if (isShowLoding) {
        $.mobile.loading("show", {
            text: 'loading',
            textVisible: true
        });
    }
    document.head.appendChild(aScript);
};

ttFundsDataUtils.getAllRecords = function (code, handleFunc, isShowLoding) {
    if (isShowLoding) {
        $.mobile.loading("show", {
            text: 'loading',
            textVisible: true
        });
    }

    this.getBasicInfo(code, (pages, records) => {

        var allRecords = [];

        for (var page = 1; page <= pages; page++) {
            this.fetchOnePage(code, page, (recordsInPage) => {
                allRecords = allRecords.concat(recordsInPage);
            });
        }

        var id = setInterval(checkState, 1000);

        function checkState() {
            if (allRecords.length >= records) {
                clearInterval(id);

                if (isShowLoding) {
                    $.mobile.loading("hide");
                }

                handleFunc(allRecords);
            }
        }
    });
};

ttFundsDataUtils.fetchOnePage = function (code, page, handleFunc) {
    var records = [];

    var aScript = document.createElement("script");

    aScript.type = "text/javascript";
    aScript.src = this.url + "&code=" + code + "&page=" + page + "&per=" + this.Max_Records_Per_Page;

    aScript.onload = function () {
        document.head.removeChild(aScript);

        var div = $(apidata.content);
        var rows = div.find("tbody tr");

        rows.each((index, tr) => {
            var record = {
                date: tr.cells[0].textContent,
                netValue: tr.cells[1].textContent,
                dailyRate: tr.cells[3].textContent
            };

            records.push(record);
        });

        handleFunc(records);
    };

    aScript.onerror = function (error) {
        console.log("Hoo: " + error.message);
    };

    document.head.appendChild(aScript);
};

ttFundsDataUtils.updateNetValues = function (code) {
    this.getAllRecords(code, (allRecords) => {
        dbUtils.openDatabase();

        dbUtils.executeQueryWithArgs("SELECT id FROM 基金 WHERE 代码 = ?", [code], (resultSet) => {
            var 基金Id = resultSet.rows.item(0).id;

            dbUtils.executeStatements([`DELETE FROM 历史净值 WHERE 基金Id = ${基金Id}`]);

            for (var i = 0; i < allRecords.length; i++) {
                dbUtils.executeSingleStatementWithArgs("INSERT INTO 历史净值 VALUES(?, ?, ?, ?)", [基金Id, allRecords[i].date, allRecords[i].netValue, allRecords[i].dailyRate]);
            }
        });
    }, true);
};