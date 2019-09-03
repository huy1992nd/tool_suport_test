let mysqlController = require('./../controllers/mysql_controller');
var config = require('config');
let { testcaseGenerateData } = require('../testcase/testcase-export_trade');
class TestExportTrade {
    constructor() {
        this.isOk = true;
    }

    Init() {
        this.TestGenerateData();
    }

    TestGenerateData() {
        testcaseGenerateData.forEach(item => {
            let check = this.generateDataFunctionTest(item.data);
            if (check.status) {
                console.log(item.name, "   PASS");
            } else {
                this.isOk = false;
                console.log(item.name, "   FAIL");
                console.log("ERROR", check.message);
            }
        })
    }

    generateDataFunctionTest(Data) {
        
    }

}

module.exports = new TestMySqlController();
