var config = require('config');
let TEST_CASE = {
	exportTrade: true
}
var bpex_define = require('./../define.js');
function initGlobal() {
}
initGlobal();
let TestExportTrade = require('../testrun/test-export_trade');

function Init() {
	TestExportTrade.Init();
	if (TestExportTrade.isOk) {
		console.log("UNIT TEST PASS");
	} else {
		console.log("UNIT TEST FAIL");
	}
}

Init();



