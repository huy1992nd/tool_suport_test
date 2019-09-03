var MyEmitter = require('../lib/events');
var define_a = require('../define');
var Excel = require('exceljs');
var path = require('path');
var appDir = path.dirname(require.main.filename).replace(new RegExp("\\\\", 'g'), '/');
class exportExcel {
    constructor() {
     
    }

    createCheckPriceEngine(data_input, clientId) {
        var workbook = new Excel.Workbook();
        workbook.creator = 'Huy';
        workbook.lastModifiedBy = 'Huy';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        workbook.properties.date1904 = true;
        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ];

        Object.keys(data_input).map((symbol) => {
            var worksheet = workbook.addWorksheet(symbol, { properties: { tabColor: { argb: 'FFC0000' } } });

            worksheet.columns = [
                { header: '', key: 'exchange', width: 15 },
                { header: '', key: 'percen', width: 25 },
                { header: '', key: 'type', width: 15 },
                { header: '', key: 'price', width: 15 },
                { header: '', key: 'org', width: 15 }
            ];

            worksheet.addRow(
                {
                    exchange: "",
                    percen: "Symbol:",
                    type: symbol,
                });
            worksheet.addRow(
                {
                    exchange: "",
                    percen: "Time:",
                    type: new Date().toLocaleTimeString(),
                });

            worksheet.addRow(
                {
                    exchange: "",
                    percen: "Total percent",
                    type: data_input[symbol].total_percen_all,
                });

            worksheet.addRow(
                {
                    exchange: "",
                    percen: "Fairvalue (Preview):",
                    type: parseFloat(data_input[symbol].fair_value.replace(/,/g, ""))
                });

            worksheet.addRow(
                {
                    exchange: "",
                    percen: "Fairvalue (Calculation):",
                    type: parseFloat(data_input[symbol].fair_value_cal)
                });

            worksheet.addRow(
                {
                    exchange: "",
                    percen: "Status:",
                    type: data_input[symbol].status ? "FALSE" : 'PASS'
                });

            worksheet.addRow(
                {
                    exchange: "",
                    percen: "",
                    type: ""
                });

            worksheet.addRow(
                {
                    exchange: "Exchange",
                    percen: "Percent",
                    type: "Type",
                    price: "Price",
                    org: "Origin Price"
                });

            Object.keys(data_input[symbol].list_data_detail).map(exchange => {
                worksheet.addRow(
                    {
                        exchange: exchange,
                        percen: data_input[symbol].list_data_detail[exchange].percen == '---' ? '---' : parseFloat(data_input[symbol].list_data_detail[exchange].percen),
                        type: data_input[symbol].list_data_detail[exchange].type,
                        price: data_input[symbol].list_data_detail[exchange].percen == '---' ? '---' : parseFloat(data_input[symbol].list_data_detail[exchange].price),
                        org: data_input[symbol].list_data_detail[exchange].percen == '---' ? '---' : parseFloat(data_input[symbol].list_data_detail[exchange].org)
                    }
                );

            });


            let path_to_img = `${appDir}/log/tmp/task_report_price_engine/${symbol}.png`;
            let imageId1 = workbook.addImage({
                filename: path_to_img,
                extension: 'png',
            });

            worksheet.getCell(`C2`).border = {
                name: 'Arial Black',
                family: 2,
                size: 10,
                bold: true
            };

            worksheet.getCell(`C7`).border = {
                name: 'Arial Black',
                family: 2,
                size: 10,
                bold: true
            };

            let number_exchange = Object.keys(data_input[symbol].list_data_detail).length;

            worksheet.addImage(imageId1, 'G2:U39');
            //style 
            ["A", "B", "C", "D", "E"].map(s => {
                worksheet.getCell(`${s}9`).fill = {
                    type: 'pattern',
                    pattern: 'darkTrellis',
                    fgColor: { argb: 'ffff00' },
                    bgColor: { argb: 'ffff00' }
                };
                worksheet.getCell(`${s}9`).font = {
                    name: 'Arial Black',
                    family: 2,
                    size: 10,
                    bold: true
                };
                worksheet.getCell(`${s}9`).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };

                for (let j = 0; j < number_exchange; j++) {
                    let c = 10 + j;
                    worksheet.getCell(`${s}${c}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            });

        });
        let path = `${appDir}/log/tmp/task_report_price_engine/report_file_price_engine.xlsx`;
        workbook.xlsx.writeFile(path)
            .then(() => {
                MyEmitter.emit(define_a.MESSAGE_EMITER.PARSE_SCREEN_PRICE_ENGINE_OK, {
                    link: `/download/task_report_price_engine/report_file_price_engine.xlsx`,
                    data: "",
                    clientId: clientId
                });
            });
    }

    createCheckNOP(data_input, clientId) {
        var workbook = new Excel.Workbook();
        workbook.creator = 'Huy';
        workbook.lastModifiedBy = 'Huy';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        workbook.properties.date1904 = true;
        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ];

        var worksheet = workbook.addWorksheet('result', { 
            properties: { 
                tabColor: { argb: 'FFC0000' },
                outlineLevelCol:2,
                showGridLines: false
            }
        });

        worksheet.columns = [
            { header: 'Symbol', key: 'symbol', width: 10 },
            { header: 'Customer buy', key: 'customer_buy', width: 15 },
            { header: 'Customer sell', key: 'customer_sell', width: 15 },
            { header: 'Customer nop', key: 'customer_nop', width: 15 },
            { header: 'Cover buy', key: 'cover_buy', width: 15 },
            { header: 'Cover sell', key: 'cover_sell', width: 15 },
            { header: 'Cover nop', key: 'cover_nop', width: 15 },
            { header: 'NOP', key: 'nop', width: 15 },
            { header: 'Realized', key: 'realized', width: 15 },
            { header: 'Unrealized', key: 'unrealized', width: 15 },
            { header: 'Balance', key: 'balance', width: 15 }
        ];

        Object.keys(data_input).map((symbol)=>{
            let row_add_1 = {};
            let row_add_2 = {};
            [
                "cover_buy",
                "cover_sell",
                "cover_nop",
                "customer_buy",
                "customer_sell",
                "customer_nop",
                "nop",
                "realized",
                "unrealized",
                "balance"
            ].map(key=>{
                row_add_1[key] = data_input[symbol][key]?  'Sai ---> ' + data_input[symbol][key] :'Đúng'; 
            });
            row_add_1.symbol = symbol;
            [
                "cover_buy",
                "cover_sell",
                "cover_nop",
                "customer_buy",
                "customer_sell",
                "customer_nop",
                "nop",
                "realized",
                "unrealized"
            ].map(key=>{
                let k = key+'_avg';
                row_add_2[key] = data_input[symbol][k]?  'Sai ---> ' + data_input[symbol][k]: 'Đúng'; 
            });

            worksheet.addRow(row_add_1);
            worksheet.addRow(row_add_2);
        });

        //style 
        let number_symbol = Object.keys(data_input).length;
        ["A", "B", "C", "D", "E","F","G","H","I","J","K"].map( (s) => {

            worksheet.getCell(`${s}1`).font = {
                name: 'Arial Black',
                family: 2,
                size: 10,
                bold: true
            };

            for (let j = 1; j < number_symbol*2+2; j++){
                if(j%2 == 0){
                    worksheet.getCell(`${s}${j}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'dashDotDot' },
                        right: { style: 'thin' }
                    };
                }else{
                    worksheet.getCell(`${s}${j}`).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
           
                if(Math.round((j+1)/2)%2==0){
                    worksheet.getCell(`${s}${j}`).fill = {
                        type: 'pattern',
                        pattern: 'darkTrellis',
                        fgColor: { argb: 'ffe6e6' },
                        bgColor: { argb: 'ffe6e6' }
                    };
                }
            }

        });

        let path_to_img = `${appDir}/log/tmp/task_report_price_engine/nop_screen.png`;

        let imageId1 = workbook.addImage({
            filename: path_to_img,
            extension: 'png',
        });

        worksheet.addImage(imageId1, 'M2:Z79');

        let path = `${appDir}/log/tmp/task_report_nop/report_nop_screen.xlsx`;

        workbook.xlsx.writeFile(path)
            .then(() => {
                console.log('create excel ok', 'report_nop_screen.xlsx');
                MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_NOP_RESULT, {
                    link: `/download/task_report_nop/report_nop_screen.xlsx`,
                    data: "",
                    clientId: clientId
                });
            });
    }

}

module.exports = new exportExcel();

