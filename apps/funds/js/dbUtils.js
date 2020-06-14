var dbUtils = {};

var fundsDB;


window.addEventListener("load", () => {
    if (!dbUtils.checkWebSQLSupoort()) {
        $("p#error-output").text("Opps, Your browser seems not support Web SQL!").show();
        return;
    }
});


dbUtils.checkWebSQLSupoort = function () {
    return window.openDatabase;
};

dbUtils.openDatabase = function () {
    fundsDB = openDatabase("FundsDB", "1.0", "offline funds storage", 5*1024*1024);
};

dbUtils.executeSingleStatementWithArgs = function(sqlStatement, args) {
    fundsDB.transaction(
        function(tx) {
            tx.executeSql(sqlStatement, args);
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            //console.log("Statement executed.");
        }
    );
};


dbUtils.executeStatements = function(sqlStatements, onErrorFunc, onSuccessFunc) {
    fundsDB.transaction(
        function(tx) {
            for (var i = 0; i < sqlStatements.length; i++) {
                tx.executeSql(sqlStatements[i]);
            }
        },
        function(error) {
            if (onErrorFunc) {
                onErrorFunc(error);
            }
        },
        function() {
            if (onSuccessFunc) {
                onSuccessFunc();
            }
        }
    );
};

dbUtils.executeQuery = function(sqlStatement, handleFunc, errorCallback) {
    fundsDB.readTransaction(
        function(tx) {
            tx.executeSql(
                sqlStatement,
                [],
                function(tx, resultSet) {
                    handleFunc(resultSet);
                },
                function(tx, error) {
                    errorCallback(error);
                }
            );
        },
        function(error) {
            console.log("Transaction error: ");
            $("p#error-output").text("Transaction Error: " + error.message).show();
        },
        // Transaction SuccessCallback
//        function() {
//            console.log("Transaction success: ");
//            handleFunc(result.resultSet);
//        }
    );
};

dbUtils.executeQueryWithArgs = function(sqlStatement, args, handleFunc) {
    var result = {};
    
    fundsDB.readTransaction(
        function(tx) {
            tx.executeSql(
                sqlStatement,
                args,
                function(tx, resultSet) {
                    result.resultSet = resultSet;
                },
                function(tx, error) {
                    console.log(error.message);
                }
            );
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            handleFunc(result.resultSet);
        }
    );
};

dbUtils.innerExecuteSql = function(tx, sqlStatement, args, result) {
    tx.executeSql(sqlStatement, args,
        function(tx, resultSet) {
            result.push(resultSet);
        },
        function(tx, error) {
            console.log(error.message);
        }
    );
};


dbUtils.batchQueryWithArgs = function(sqlStatements, handleFunc) {
    var result = [];
    
    fundsDB.readTransaction(
        function(tx) {
            for (var i = 0; i < sqlStatements.length; i++) {
                dbUtils.innerExecuteSql(tx, sqlStatements[i].sql, sqlStatements[i].args, result);
            }
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            handleFunc(result);
        }
    );
};



dbUtils.executeSqlFile = function(url, onErrorFunc, onSuccessFunc) {
    this.loadSqlStatements(url, (sqls) => {
        this.executeStatements(sqls, onErrorFunc, onSuccessFunc);
    });
};



dbUtils.loadSqlStatements = function(url, handleFunc) {
    $.get(url, function(sqlStatements) {
        // remove the comments first
        sqlStatements = sqlStatements.replace(/--.*\n/g, '');
        
        sqlStatements = sqlStatements.split(";");

        // the last line contains only white chars
        if (sqlStatements[sqlStatements.length-1].search(/\S/) === -1) {
            sqlStatements = sqlStatements.slice(0, -1);
        }
        
        handleFunc(sqlStatements);
    });
};















function createTable() {
    fundsDB.transaction(
        function(tx) {
            tx.executeSql("Drop TABLE IF EXISTS 基金");
            tx.executeSql("Drop TABLE IF EXISTS 历史净值");
            tx.executeSql("CREATE TABLE 基金(id INTEGER NOT NULL UNIQUE, 名称 VARCHAR(30) NOT NULL UNIQUE, 代码 VARCHAR(6) NOT NULL UNIQUE, PRIMARY KEY(id))");
            tx.executeSql("CREATE TABLE 历史净值(基金Id INTEGER NOT NULL REFERENCES 基金(id) ON DELETE RESTRICT ON UPDATE CASCADE, 日期 Date NOT NULL, 单位净值 DOUBLE NOT NULL, PRIMARY KEY(基金Id, 日期))");
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            console.log("table 基金, 历史净值 created.");
        }
    );
}

function dropTable() {
    fundsDB.transaction(
        function(tx) {
            tx.executeSql("Drop TABLE IF EXISTS 基金");
            tx.executeSql("Drop TABLE IF EXISTS 历史净值");
            tx.executeSql("Drop TABLE IF EXISTS 买入费率");
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            console.log("table 基金, 历史净值 droped.");
        }
    );
}

function insertData() {
    fundsDB.transaction(
        function(tx) {
            tx.executeSql("INSERT INTO 基金 VALUES(1, '招商中证白酒指数分级', '161725')");
            tx.executeSql("INSERT INTO 历史净值 VALUES(1, '2019-03-01', 1.1245)");
            tx.executeSql("INSERT INTO 历史净值 VALUES(1, '2019-02-28', 1.0811)");
            tx.executeSql("INSERT INTO 历史净值 VALUES(1, '2019-02-27', 1.0711)");
            
            tx.executeSql("INSERT INTO 基金 VALUES(2, '易方达消费行业股票', '110022')");
            tx.executeSql("INSERT INTO 历史净值 VALUES(2, '2019-03-01', 2.2570)");
            tx.executeSql("INSERT INTO 历史净值 VALUES(2, '2019-02-28', 2.1930)");
            tx.executeSql("INSERT INTO 历史净值 VALUES(2, '2019-02-27', 2.1850)");
            
            tx.executeSql("INSERT INTO 基金 VALUES(3, '嘉实中证500ETF联接C', '070039')");
            tx.executeSql("INSERT INTO 历史净值 VALUES(3, '2019-03-01', 1.0737)");
            tx.executeSql("INSERT INTO 历史净值 VALUES(3, '2019-02-28', 1.0650)");
            tx.executeSql("INSERT INTO 历史净值 VALUES(3, '2019-02-27', 1.0636)");
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            console.log("data inserted.");
        }
    );
}

function selectData() {
    fundsDB.readTransaction(
        function(tx) {
            tx.executeSql("SELECT * FROM 历史净值 WHERE 基金Id = ? AND 日期 = ?",
                [3, '2019-02-28'],
                function(tx, resultSet) {
                    console.log(resultSet.rows.item(0).单位净值);
                },
                function(tx, error) {
                    console.log(error.message);
                }
            );
        },
        function(error) {
            console.log(error.message);
        },
        function() {
            console.log("data selected.");
        }
    );
}



//window.addEventListener("load", init);


