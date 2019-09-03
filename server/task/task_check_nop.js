var MyEmitter = require('../lib/events');
var define_a = require('../define');
var puppeteer = require('puppeteer');
let config = require("config");
var log = require('../lib/log').log;
var zipFolder = require('zip-folder');
var fs = require('fs');
var exportsExcel = require('../lib/createExcel');
var mySqlController = require('../controller/mysql');
var redisController = require('../controller/redis/redis_controller');
var path = require('path');
var appDir = path.dirname(require.main.filename).replace(new RegExp("\\\\", 'g'), '/');
var formattime= require('../lib/common/func').formatime;
var list_check = [
    "cover_buy",
    "cover_sell",
    "cover_nop",
    "customer_buy",
    "customer_sell",
    "customer_nop",
    "cover_buy_avg",
    "cover_sell_avg",
    "customer_buy_avg",
    "customer_sell_avg",
    "nop",
    "realized",
    "unrealized",
    "nop_avg",
    "realized_avg",
    "unrealized_avg",
    "balance"
];
var list_selector = {
    "BTC_KRW": { "value_1": 6, "value_2": 25, "point": 0 },
    "BTC_EUR": { "value_1": 5, "value_2": 25, "point": 2 },
    "BTC_HKD": { "value_1": 4, "value_2": 25, "point": 1 },
    "BTC_USD": { "value_1": 3, "value_2": 25, "point": 2 },
    "BTC_JPY": { "value_1": 2, "value_2": 25, "point": 0 },
    "BTC_THB": { "value_1": 10, "value_2": 25, "point": 1 },
    "BTC_MYR": { "value_1": 9, "value_2": 25, "point": 1 },
    "BTC_SGD": { "value_1": 8, "value_2": 25, "point": 2 },
    "BTC_TWD": { "value_1": 7, "value_2": 25, "point": 0 },
    "ETH_KRW": { "value_1": 16, "value_2": 21, "point": 0 },
    "ETH_EUR": { "value_1": 15, "value_2": 21, "point": 2 },
    "ETH_HKD": { "value_1": 14, "value_2": 21, "point": 1 },
    "ETH_USD": { "value_1": 13, "value_2": 21, "point": 2 },
    "ETH_JPY": { "value_1": 12, "value_2": 21, "point": 0 },
    "ETH_THB": { "value_1": 20, "value_2": 21, "point": 1 },
    "ETH_MYR": { "value_1": 19, "value_2": 21, "point": 1 },
    "ETH_SGD": { "value_1": 18, "value_2": 21, "point": 2 },
    "ETH_TWD": { "value_1": 17, "value_2": 21, "point": 0 },
    "BCC_KRW": { "value_1": 26, "value_2": 18, "point": 0 },
    "BCC_EUR": { "value_1": 25, "value_2": 18, "point": 2 },
    "BCC_HKD": { "value_1": 24, "value_2": 18, "point": 1 },
    "BCC_USD": { "value_1": 23, "value_2": 18, "point": 2 },
    "BCC_JPY": { "value_1": 22, "value_2": 18, "point": 0 },
    "BCC_THB": { "value_1": 30, "value_2": 18, "point": 1 },
    "BCC_MYR": { "value_1": 29, "value_2": 18, "point": 1 },
    "BCC_SGD": { "value_1": 28, "value_2": 18, "point": 2 },
    "BCC_TWD": { "value_1": 27, "value_2": 18, "point": 0 },
    "LTC_KRW": { "value_1": 36, "value_2": 18, "point": 0 },
    "LTC_EUR": { "value_1": 35, "value_2": 18, "point": 2 },
    "LTC_HKD": { "value_1": 34, "value_2": 18, "point": 1 },
    "LTC_USD": { "value_1": 33, "value_2": 18, "point": 2 },
    "LTC_JPY": { "value_1": 32, "value_2": 18, "point": 0 },
    "LTC_THB": { "value_1": 40, "value_2": 18, "point": 1 },
    "LTC_MYR": { "value_1": 39, "value_2": 18, "point": 1 },
    "LTC_SGD": { "value_1": 38, "value_2": 18, "point": 2 },
    "LTC_TWD": { "value_1": 37, "value_2": 18, "point": 0 },
    "XRP_KRW": { "value_1": 46, "value_2": 16, "point": 0 },
    "XRP_EUR": { "value_1": 45, "value_2": 16, "point": 2 },
    "XRP_HKD": { "value_1": 44, "value_2": 16, "point": 1 },
    "XRP_USD": { "value_1": 43, "value_2": 16, "point": 2 },
    "XRP_JPY": { "value_1": 42, "value_2": 16, "point": 0 },
    "XRP_THB": { "value_1": 50, "value_2": 16, "point": 1 },
    "XRP_MYR": { "value_1": 49, "value_2": 16, "point": 1 },
    "XRP_SGD": { "value_1": 48, "value_2": 16, "point": 2 },
    "XRP_TWD": { "value_1": 47, "value_2": 16, "point": 0 },
    "BBB_BTC": { "value_1": 56, "value_2": 15, "point": 6 },
    "XRP_BTC": { "value_1": 55, "value_2": 12, "point": 6 },
    "LTC_BTC": { "value_1": 54, "value_2": 13, "point": 6 },
    "BCC_BTC": { "value_1": 53, "value_2": 14, "point": 6 },
    "ETH_BTC": { "value_1": 52, "value_2": 15, "point": 6 },
    "BBB_ETH": { "value_1": 57, "value_2": 15, "point": 6 }
}
var getFairValue = (data_input, symbol, fix) => {
    var current_symbol = data_input.list_coin_currency.find(o => o.symbol == symbol.replace("_","").toLowerCase());
    var fairValue = null;
    var total_percen = 0;
    var total_percen_all = 0;
    var total_value = 0;
    var list_data_detail = {}

    if (data_input.config_show.PEpercentage) {
        Object.keys(data_input.config_show.PEpercentage).map(key => {
            if (data_input.price_engine_data[current_symbol.symbol] != undefined) {
                if (data_input.price_engine_data[current_symbol.symbol]['available'] != undefined) {
                    list_data_detail[key] = {

                    };
                    total_percen_all += parseFloat(data_input.config_show.PEpercentage[key]);
                    if (data_input.price_engine_data[current_symbol.symbol]['available'][key] == '1') {
                        total_percen += parseFloat(data_input.config_show.PEpercentage[key]);
                        list_data_detail[key].percen = data_input.config_show.PEpercentage[key];
                        if (data_input.config_show.PEtype[key] == 1) {
                            total_value += parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['bid_price'][key].new) * data_input.config_show.PEpercentage[key];
                            list_data_detail[key].price = parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['bid_price'][key].new).toFixed(fix);
                            list_data_detail[key].org = parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['bid_price'][key].org).toFixed(fix);
                            list_data_detail[key].type = "bid";
                        }
                        if (data_input.config_show.PEtype[key] == 2) {
                            total_value += parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['ask_price'][key].new) * data_input.config_show.PEpercentage[key];
                            list_data_detail[key].price = parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['ask_price'][key].new).toFixed(fix);
                            list_data_detail[key].org = parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['ask_price'][key].org).toFixed(fix);
                            list_data_detail[key].type = "ask";
                        }
                        if (data_input.config_show.PEtype[key] == 3) {
                            total_value += parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['mid_price'][key].new) * data_input.config_show.PEpercentage[key];
                            list_data_detail[key].price = parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['mid_price'][key].new).toFixed(fix);
                            list_data_detail[key].org = parseFloat(data_input.price_engine_data[current_symbol.coin + current_symbol.currency]['mid_price'][key].org).toFixed(fix);
                            list_data_detail[key].type = "mid";
                        }
                    } else {
                        list_data_detail[key].percen = '---'
                    }
                }
            }
        });
    }

    fairValue = parseFloat(total_value / total_percen);

    return {
        fairValue: fairValue,
        list_data_detail: list_data_detail,
        total_percen_all: total_percen_all
    };
}

class checkNOPController {
    constructor() {
        this.browser = null;
        this.logImageCount = 1;
        this.timeDelay = config.get("timeDelay");
        this.showBrower = !config.get("showBrowser");
        this.screen_info = null;
        this.MySqlControllerMagin = new mySqlController();
        this.MySqlControllerSpot = new mySqlController();
        this.redisController = new redisController();
    }

    setConfig(data) {
        var environment = data.data.environment;
        this.MySqlControllerMagin.setConfig(config.get('mysql').task_check_nop[environment].margin);
        this.MySqlControllerSpot.setConfig(config.get('mysql').task_check_nop[environment].spot);
        this.screen_info = config.get('screen_nop')[environment];
        this.redisController.set_config_redis(config.get('redis').task_check_nop[environment]);
        MyEmitter.emit(define_a.MESSAGE_EMITER.SET_CONFIG_CHECK_NOP_OK, {
            data: data
        });
    }

    async check(data) {
        log.info('task check nop', `time : ${new Date().toISOString()}`);
        this.browser = await puppeteer.launch({ headless: this.showBrower, ignoreHTTPSErrors: true });
        const page = await this.browser.newPage();
        await page.setViewport({
            width: 1800,
            height: 2000
        })
        let result = await this.Login(page);
        if (result) {
            console.log("login success");
            switch (data.data.screen) {
                case 'nop_realtime':
                case 'nop_daily':
                    var list_symbol = data.data.list_symbol.map(e=> {return e.item_text});
                    this.ReadPageHome(page, data.data.market, data.data.screen, list_symbol, data.clientId);
                    break;

                case 'price_engine':
                    this.readpagePiceEngine(page, data.clientId, data.data.list_symbol);
                    break;

                default:
                    break;
            }

        }
    }

    clearIMG() {
        let directory = `${appDir}/log/tmp/task_report_price_engine/`;
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    }

    async readpagePiceEngine(page, clientId, list_symbol_input) {
        this.clearIMG();
        
        await page.click('#sidebar-menu > div > ul > li:nth-child(4) > ul > li:nth-child(1) > a');
        var result = {};
        try {
            for (let index = 0; index < Object.keys(list_selector).length; index++) {
                let key = Object.keys(list_selector)[index];
                if (list_symbol_input.find(o => o.item_text == key)) {
                    var selector_1 = `body > div.container.body.ng-scope > div > div.top_nav > div > nav > ul > li.open > ul > li:nth-child(${list_selector[key].value_1}) > a`;
                    var selector_2 = `body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div.row.config_pe.ng-scope > div > div > div.x_content > form > div:nth-child(${list_selector[key].value_2}) > div.col-md-3.col-sm-3.col-xs-3.form-group.has-feedback.t-9 > span`;
                    await page.waitFor(1000);
                    //click vào tab price engine
                    await page.click('body > div.container.body.ng-scope > div > div.top_nav > div > nav > ul > li:nth-child(2) > a');
                    await page.waitFor(2000);
                    //click vào menu chọn symbol
                    await page.click(selector_1);
                    await page.waitFor(2000);
                    // click vào radio Calculate from rates of exchanges
                    await page.evaluate(() => {
                        var test = document.querySelector('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div.row.config_pe.ng-scope > div > div > div.x_content > form > div:nth-child(5) > div > label > input')
                        test.click();
                    });
                    // lấy data rootscope
                    let root_data = await page.evaluate(() => {
                        let rootScope = angular.element(document).scope();
                        return {
                            "config_show": rootScope.config_show,
                            "price_engine_data": rootScope.price_engine_data,
                            "list_coin_currency": rootScope.list_coin_currency
                        }

                    });

                    //Lấy data fairvalue trên màn hình
                    await page.waitFor(150);
                    let element = await page.$(selector_2);
                    let fair_value = element ? await (await element.getProperty('textContent')).jsonValue() : null;
                    // chup anh
                    let path_file_img = `${appDir}/log/tmp/task_report_price_engine/${key}.png`;
                    let selector = 'body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div.row.config_pe.ng-scope > div > div';
                    var rect = await page.evaluate(selector => {
                        var element = document.querySelector(selector);
                        var { x, y, width, height } = element.getBoundingClientRect();
                        return { left: x, top: y, width, height, id: element.id };
                    }, selector);

                    await page.screenshot({
                        path: path_file_img,
                        clip: {
                            x: rect.left - 5,
                            y: rect.top - 5,
                            width: rect.width + 5 * 2,
                            height: rect.height + 5 * 2
                        }
                    });

                    result[key] = {
                        fair_value: fair_value,
                        config_show: root_data.config_show,
                        price_engine_data: root_data.price_engine_data,
                        list_coin_currency: root_data.list_coin_currency
                    }
                    console.log(`read ${key} ok`);
                }
            };
            this.compareDataPriceEngine(result, clientId);
        } catch (error) {
            MyEmitter.emit(define_a.MESSAGE_EMITER.ERROR_PARSE_SCREEN_PRICE_ENGINE, {
                error: error,
                clientId: clientId
            });
        }

        await this.browser.close();
    }

    async ReadPageHome(page, market, type_screen, list_symbol, clientId) {
        this.clearIMG();
        await page.waitFor(2000);
        switch (type_screen) {
            case 'nop_realtime':
                await page.click('#sidebar-menu > div > ul > li:nth-child(2) > ul > li:nth-child(1) > a');
                await page.waitFor(1000);
                 //click vao market 
                await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(1) > label');
                if(market ==  'spot'){
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(3) label');                
                    await page.waitFor(1000);
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(3) label');                
                }
                else{
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(4) > label');
                    await page.waitFor(1000);
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(4) > label');
                }
                break;

            case 'nop_daily':
                await page.click('#sidebar-menu > div > ul > li:nth-child(2) > ul > li:nth-child(2) > a');
                await page.waitFor(1000);
                //click vao market 
                await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(2) > label');
                if(market ==  'spot'){
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(4) > label');
                    await page.waitFor(1000);
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(4) > label');
                }
                else{
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(5) > label');
                    await page.waitFor(1000);
                    await page.click('body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div > div.x_title > div.nop-select > ul > li:nth-child(5) > label');
                }
                break;
        
            default:
                break;
        }
      
        let result = await page.evaluate(() => {
            let sync_nop_data = (typeMarket, rootScope) => {
                var curr_nop = [];
                for (let i = 0; i < rootScope.list_coin_currency.length; i++) {
                    let sym = rootScope.list_coin_currency[i].pair_cd;
                    let symbolType = rootScope.list_coin_currency[i].type;
                    let isIco = rootScope.list_coin_currency[i].is_ico != null ? rootScope.list_coin_currency[i].is_ico : false;
                    let digit = rootScope.list_coin_currency[i].num_digit;

                    let item_default = {
                        symbol: sym,
                        type: symbolType,
                        is_ico: isIco,
                        digit: digit,
                        real_time: {
                            orderBuyExpense: 0,
                            orderSellExpense: 0,
                            coverBuyExpense: 0,
                            coverSellExpense: 0,
                            buyExpense: 0,
                            sellExpense: 0,
                            abs_customer: 0,
                            abs_cover: 0,
                            abs_nop: 0,
                            customer_buy: 0,
                            customer_sell: 0,
                            customer_nop: 0,
                            cover_buy: 0,
                            cover_sell: 0,
                            cover_nop: 0,
                            buy: 0,
                            sell: 0,
                            nop: 0,
                            realized: 0,
                            realized_PL_lot: 0,
                            unrealized: 0,
                            unrealized_PL_lot: 0,
                            balance: 0,
                            balance_jpy: 0,
                            balance_usd: 0,
                            customer_buy_avg: 0,
                            customer_sell_avg: 0,
                            customer_nop_avg: 0,
                            cover_buy_avg: 0,
                            cover_sell_avg: 0,
                            cover_nop_avg: 0,
                            nop_avg: 0
                        },
                        daily: {
                            orderBuyExpense: 0,
                            orderSellExpense: 0,
                            coverBuyExpense: 0,
                            coverSellExpense: 0,
                            buyExpense: 0,
                            sellExpense: 0,
                            abs_customer: 0,
                            abs_cover: 0,
                            abs_nop: 0,
                            customer_buy: 0,
                            customer_sell: 0,
                            customer_nop: 0,
                            cover_buy: 0,
                            cover_sell: 0,
                            cover_nop: 0,
                            buy: 0,
                            sell: 0,
                            nop: 0,
                            realized: 0,
                            realized_PL_lot: 0,
                            unrealized: 0,
                            unrealized_PL_lot: 0,
                            balance: 0,
                            balance_jpy: 0,
                            balance_usd: 0,
                            customer_buy_avg: 0,
                            customer_sell_avg: 0,
                            customer_nop_avg: 0,
                            cover_buy_avg: 0,
                            cover_sell_avg: 0,
                            cover_nop_avg: 0,
                            nop_avg: 0
                        }
                    };

                    let curr_item = JSON.parse(JSON.stringify(item_default));
                    console.log('typeMarket is', typeMarket)
                    var item = rootScope.data_symbols[typeMarket].getItemBy('symbol', sym);

                    if (!item)
                        item = angular.copy(item_default);
                    Object.keys(curr_item.real_time).forEach(function (key) {
                        curr_item.real_time[key] += item.real_time[key];
                    });

                    Object.keys(curr_item.daily).forEach(function (key) {
                        curr_item.daily[key] += item.daily[key];
                    });

                    curr_item.real_time.realized_PL_lot = Math.min(curr_item.real_time.buy, Math.abs(curr_item.real_time.sell)) > 0.00000001 ? curr_item.real_time.realized / Math.min(curr_item.real_time.buy, Math.abs(curr_item.real_time.sell)) : 0;
                    curr_item.real_time.unrealized_PL_lot = Math.abs(curr_item.real_time.abs_nop) > 0.00000001 ? curr_item.real_time.unrealized / Math.abs(curr_item.real_time.abs_nop) : 0;
                    curr_item.real_time.customer_nop_avg = Math.abs(curr_item.real_time.abs_customer) > 0.00000001 ? (curr_item.real_time.orderBuyExpense - curr_item.real_time.orderSellExpense) / Math.abs(curr_item.real_time.abs_customer) : 0;
                    curr_item.real_time.customer_buy_avg = curr_item.real_time.customer_buy > 0.00000001 ? curr_item.real_time.orderBuyExpense / curr_item.real_time.customer_buy : 0;
                    curr_item.real_time.customer_sell_avg = Math.abs(curr_item.real_time.customer_sell) > 0.00000001 ? -curr_item.real_time.orderSellExpense / Math.abs(curr_item.real_time.customer_sell) : 0;
                    curr_item.real_time.cover_buy_avg = curr_item.real_time.cover_buy > 0.00000001 ? curr_item.real_time.coverBuyExpense / curr_item.real_time.cover_buy : 0;
                    curr_item.real_time.cover_sell_avg = Math.abs(curr_item.real_time.cover_sell) > 0.00000001 ? -curr_item.real_time.coverSellExpense / Math.abs(curr_item.real_time.cover_sell) : 0;
                    curr_item.real_time.cover_nop_avg = Math.abs(curr_item.real_time.abs_cover) > 0.00000001 ? (curr_item.real_time.coverBuyExpense - curr_item.real_time.coverSellExpense) / Math.abs(curr_item.real_time.abs_cover) : 0;
                    curr_item.real_time.nop_avg = Math.abs(curr_item.real_time.abs_nop) > 0.00000001 ? (curr_item.real_time.buyExpense - curr_item.real_time.sellExpense) / Math.abs(curr_item.real_time.abs_nop) : 0;
                    curr_item.daily.realized_PL_lot = Math.min(curr_item.daily.buy, Math.abs(curr_item.daily.sell)) > 0.00000001 ? curr_item.daily.realized / Math.min(curr_item.daily.buy, Math.abs(curr_item.daily.sell)) : 0;
                    curr_item.daily.unrealized_PL_lot = Math.abs(curr_item.daily.abs_nop) > 0.00000001 ? curr_item.daily.unrealized / Math.abs(curr_item.daily.abs_nop) : 0;
                    curr_item.daily.customer_nop = curr_item.real_time.customer_nop;
                    curr_item.daily.cover_nop = curr_item.real_time.cover_nop;
                    curr_item.daily.nop = curr_item.real_time.nop;
                    curr_item.daily.customer_nop_avg = Math.abs(curr_item.real_time.abs_customer) > 0.00000001 ? (curr_item.real_time.orderBuyExpense - curr_item.real_time.orderSellExpense) / Math.abs(curr_item.real_time.abs_customer) : 0;
                    curr_item.daily.customer_buy_avg = curr_item.daily.customer_buy > 0.00000001 ? curr_item.daily.orderBuyExpense / curr_item.daily.customer_buy : 0;
                    curr_item.daily.customer_sell_avg = Math.abs(curr_item.daily.customer_sell) > 0.00000001 ? -curr_item.daily.orderSellExpense / Math.abs(curr_item.daily.customer_sell) : 0;
                    curr_item.daily.cover_buy_avg = curr_item.daily.cover_buy > 0.00000001 ? curr_item.daily.coverBuyExpense / curr_item.daily.cover_buy : 0;
                    curr_item.daily.cover_sell_avg = Math.abs(curr_item.daily.cover_sell) > 0.00000001 ? -curr_item.daily.coverSellExpense / Math.abs(curr_item.daily.cover_sell) : 0;
                    curr_item.daily.cover_nop_avg = Math.abs(curr_item.real_time.abs_cover) > 0.00000001 ? (curr_item.real_time.coverBuyExpense - curr_item.real_time.coverSellExpense) / Math.abs(curr_item.real_time.abs_cover) : 0;
                    curr_item.daily.nop_avg = Math.abs(curr_item.real_time.abs_nop) > 0.00000001 ? (curr_item.real_time.buyExpense - curr_item.real_time.sellExpense) / Math.abs(curr_item.real_time.abs_nop) : 0;
                    curr_nop.push(curr_item);
                }
                return curr_nop;
            };
            let rootScope = angular.element(document).scope();
            var nop_data_spot = sync_nop_data('spot', rootScope);
            var nop_data_leverage = sync_nop_data('margin', rootScope);
            var nop_data_fx = sync_nop_data('FX', rootScope);
            return {
                market_nop: rootScope.market_nop,
                apec_nop: rootScope.apec_nop,
                curr_nop_realtime_all: rootScope.curr_nop,
                curr_nop_realtime_leverage: nop_data_leverage,
                curr_nop_realtime_fx: nop_data_fx,
                curr_nop_realtime_spot: nop_data_spot,
                curr_nop_daily: rootScope.curr_nop,
            }

        });

        // chup anh
        let path_file_img = `${appDir}/log/tmp/task_report_price_engine/nop_screen.png`;
        let selector = 'body > div.container.body.ng-scope > div > div.right_col > div.ng-scope > div > div > div';
        var rect = await page.evaluate(selector => {
            var element = document.querySelector(selector);
            var { x, y, width, height } = element.getBoundingClientRect();
            return { left: x, top: y, width, height, id: element.id };
        }, selector);

        await page.screenshot({
            path: path_file_img,
            clip: {
                x: rect.left - 5,
                y: rect.top - 5,
                width: rect.width + 5 * 2,
                height: rect.height + 5 * 2
            }
        });

        let s_data = market == 'spot' ? result.curr_nop_realtime_spot : result.curr_nop_realtime_leverage;
        this.compareData(market, s_data, type_screen,list_symbol, clientId);
        await this.browser.close();
    }

    getDataFromDatabase(screen_data, market, list_symbol, clientId) {
        // run procedure
        var list_query_store = [""];
        let path_file_log = `${appDir}/files/sql_store/sql.1.txt`;
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(path_file_log)
        });
        var count = 0;
        lineReader.on('line', (line) => {
            if (line.includes('---end---')) {
                list_query_store.push("");
                count++;
            } else {
                list_query_store[count] += `${line} \n `;
            }
        }).on('close', async () => {
            let s_data = market == 'spot' ? screen_data.curr_nop_realtime_spot : screen_data.curr_nop_realtime_leverage;
            this.compareData(market, list_query_store, s_data, type_screen, list_symbol, clientId);
        });
    }

    compareDataPriceEngine(s_data, clientId) {
        var result = {};
        Object.keys(s_data).map((k) => {
            let data_input = s_data[k];
            let fix = list_selector[k].point;
            let fairValue = getFairValue(data_input, k, fix);
            if (parseFloat(data_input.fair_value.replace(/,/g, "")).toFixed(fix) != fairValue.fairValue.toFixed(fix)) {
                result[k] = {
                    status: 1,
                    detail: `${data_input.fair_value}(Màn hình) --- ${fairValue.fairValue}(Công thức)`,
                    list_data_detail: fairValue.list_data_detail,
                    total_percen_all: fairValue.total_percen_all
                };
            } else {
                result[k] = {
                    status: 0,
                    detail: `${data_input.fair_value}(Màn hình) --- ${fairValue.fairValue}(Công thức)`,
                    list_data_detail: fairValue.list_data_detail,
                    total_percen_all: fairValue.total_percen_all,
                    fair_value: data_input.fair_value,
                    fair_value_cal: fairValue.fairValue.toFixed(fix)
                };
            }
        });
        exportsExcel.createCheckPriceEngine(result, clientId);
    }

    async zipFile() {
        let folder_save = `${appDir}/log/tmp/task_report_price_engine`;
        // var folder_save = `${appDir}${define_a.pathFileSave}${task_name_template}/${current_task.task_name}/`;
        var path_file_zip_save = `${appDir}/log/tmp/zip/task_report_price_engine/img_data.zip`;

        if (fs.existsSync(path_file_zip_save)) {
            fs.unlinkSync(path_file_zip_save);
        }

        zipFolder(folder_save, path_file_zip_save, function (err) {
            if (err) {
                console.log('oh no!', err);
            } else {
                console.log('zip file ok');
            }
        });

    }

    async compareData(market, screen_data ,type_screen ,list_symbol ,clientId ) {
        var mysql_controller = market == 'spot' ? this.MySqlControllerSpot : this.MySqlControllerMagin;
        let list_key_redis = list_symbol.map(s => {
            return `price_engine_data_${s.replace('_', "").toLowerCase()}`
        });
        let list_price_obj = await this.redisController.getPrice(list_key_redis);
        let query ='';
        let query_daily ='';
        let where =` `;
        let where_2 =` `;

        query = ` TRUNCATE tmp_nop_v2; ` + list_symbol.map((s, i) => {
            return ` CALL calculate_nop_v2("${s}", 0, '', 0, ${JSON.parse(list_price_obj[i]).mov_avr}); `
            }).join("  ");

        switch (type_screen) {
            case 'nop_daily':
                let time = `${formattime(1,'yyyy-mm-dd')} 07:00:00`;
                query_daily = ` TRUNCATE tmp_nop_v2; ` + list_symbol.map((s, i) => {
                return ` CALL calculate_nop_v2("${s}", 0, "${time}", 0, ${JSON.parse(list_price_obj[i]).mov_avr}); `
                }).join("  ");
                where =` and execution_dt >= "${time} 7:00:00.000" `;
                where_2 =` and trade_dt >= "${time} 7:00:00.000" `;
                break;
            default:
                break;
        }
       
        let store = await mysql_controller.Transaction(query);

        if (store) {
            let result = await mysql_controller.Query('SELECT * FROM tmp_nop_v2 ORDER BY id ASC');
            let avg_customer_sell = await mysql_controller.Query(`
            SELECT 
            side,
            currency_pair_cd AS symbol,
                SUM(filled_quantity * execution_price) as s ,
                -(SUM(filled_quantity * execution_price) / SUM(filled_quantity)) AS avg
            FROM
                bpex_execution_orders
                where side  = 3 ${where}
                GROUP BY symbol
            `);

            let avg_customer_buy = await mysql_controller.Query(`
            SELECT 
            side,
            currency_pair_cd AS symbol,
                SUM(filled_quantity * execution_price) as s,
                SUM(filled_quantity * execution_price) / SUM(filled_quantity) AS avg
            FROM
                bpex_execution_orders
                where side  = 1 ${where}
                GROUP BY symbol
            `);

            let avg_cover_buy = await mysql_controller.Query(
                `
                SELECT 
                side,
                currency_pair_cd as symbol,
                SUM(amount * price) as s ,
                SUM(amount * price) / SUM(amount) as avg
                FROM
                    bpex_covers
                    where side = 3 ${where_2}
                GROUP BY symbol;
                `
            );

            let avg_cover_sell = await mysql_controller.Query(
                `
                SELECT 
                side,
                currency_pair_cd as symbol,
                SUM(amount * price) as s ,
                SUM(amount * price) / SUM(amount) as avg
                FROM
                    bpex_covers
                    where side = 1 ${where_2}
                GROUP BY symbol;
                `
            );

            // get tỷ giá từ redis
            switch (type_screen) {
                case 'nop_realtime':
                    this.checkDataRealTime(result, screen_data, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, list_symbol, clientId);
                    break;

                case 'nop_daily':
                    let store_2 = await mysql_controller.Transaction(query_daily);
                    let result_2  = await mysql_controller.Query('SELECT * FROM tmp_nop_v2 ORDER BY id ASC');
                    let data_check = this.mergerDataDaily(result, result_2);
                    this.checkDataDaily(data_check, screen_data, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, list_symbol, clientId);
                    break;
            
                default:
                    break;
            }
           
        }
        
    }

    checkDataRealTime(database, data_screen, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, list_symbol, clientId) {
        var result = {};
        list_symbol.map(s => {
            result[s] = {}
            let d_database = database.find(o => o.symbol === s);
            // thêm trường balance
            d_database = this.mergerAVG(d_database, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, s);
            data_screen.map(e => {
                e.real_time.realized_avg = e.real_time.realized_PL_lot;
                e.real_time.unrealized_avg = e.real_time.unrealized_PL_lot;
                return e;
            })
            let d_screen = data_screen.find(o => o.symbol === s);
            
            list_check.map(k => {
                if (Math.abs(d_database[k]).toFixed(0) != Math.abs(d_screen.real_time[k]).toFixed(0)) {
                    result[s][k] = `${d_database[k].toFixed(2)}(db) - ${d_screen.real_time[k].toFixed(0)}(screen)`;
                }
            })
        });

        exportsExcel.createCheckNOP(result, clientId);

        // MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_NOP_RESULT, {
        //     data: { nop_realtime: result },
        //     clientId: clientId
        // });

    }

    checkDataDaily(database, data_screen, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, list_symbol, clientId) {
        var result = {};
        list_symbol.map(s => {
            result[s] = {}
            let d_database = database.find(o => o.symbol === s);
            // thêm trường balance
            d_database = this.mergerAVG(d_database, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, s);
            data_screen.map(e => {
                e.daily.realized_avg = e.daily.realized_PL_lot;
                e.daily.unrealized_avg = e.daily.unrealized_PL_lot;
                return e;
            })
            let d_screen = data_screen.find(o => o.symbol === s);
            
            list_check.map(k => {
                if (Math.abs(d_database[k]).toFixed(0) != Math.abs(d_screen.daily[k]).toFixed(0)) {
                    result[s][k] = `${d_database[k].toFixed(2)}(db) - ${d_screen.daily[k].toFixed(0)}(screen)`;
                }
            })
        });

        exportsExcel.createCheckNOP(result, clientId);

        // MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_NOP_RESULT, {
        //     data: { nop_realtime: result },
        //     clientId: clientId
        // });

    }

    mergerDataDaily(data_1, data_2){
        data_1.map(d_1=>{
            let d_2 = data_2.find(d_2 => d_2.symbol === d_1.symbol);
            d_1.customer_buy = d_1.customer_buy- d_2.customer_buy;
            d_1.customer_sell = d_1.customer_sell- d_2.customer_sell;
            d_1.cover_buy = d_1.cover_buy- d_2.cover_buy;
            d_1.cover_sell = d_1.cover_sell- d_2.cover_sell;
            d_1.realized = d_1.realized - d_2.realized;
            d_1.realized = d_1.unrealized - d_2.unrealized;
            return d_1;
        });
        return data_1;
    }

    mergerAVG(data, avg_cover_buy, avg_cover_sell, avg_customer_buy, avg_customer_sell, s) {
        let avg_cover_buy_s = avg_cover_buy.find(o => o.symbol === s);
        let avg_cover_sell_s = avg_cover_sell.find(o => o.symbol === s);
        let avg_customer_buy_s = avg_customer_buy.find(o => o.symbol === s);
        let avg_customer_sell_s = avg_customer_sell.find(o => o.symbol === s);

        data.cover_buy_avg = avg_cover_buy_s ? avg_cover_buy_s.avg : 0;
        data.cover_sell_avg = avg_cover_sell_s ? avg_cover_sell_s.avg : 0;
        data.customer_buy_avg = avg_customer_buy_s ? avg_customer_buy_s.avg : 0;
        data.customer_sell_avg = avg_customer_sell_s ? avg_customer_sell_s.avg : 0;

        //nop_avg
        data.cover_nop_avg = data.cover_nop == 0 ? 0 : ((avg_cover_buy_s ? avg_cover_buy_s.s : 0) - (avg_cover_sell_s ? avg_cover_sell_s.s : 0)) / Math.abs(data.cover_nop);
        data.customer_nop_avg = data.customer_nop == 0 ? 0 : ((avg_customer_buy_s ? avg_customer_buy_s.s : 0) - (avg_customer_sell_s ? avg_customer_sell_s.s : 0)) / Math.abs(data.customer_nop);
        let total_cover_buy = avg_cover_buy_s ? avg_cover_buy_s.s : 0;
        let total_customer_buy = avg_customer_buy_s ? avg_customer_buy_s.s : 0;
        let total_cover_sell = avg_cover_sell_s ? avg_cover_sell_s.s : 0;
        let total_customer_sell = avg_customer_sell_s ? avg_customer_sell_s.s : 0;

        data.nop_avg = Math.abs(data.customer_buy + data.cover_buy - (Math.abs(data.customer_sell) + Math.abs(data.cover_sell))) == 0 ? 0 : (total_cover_buy + total_customer_buy - total_cover_sell - total_customer_sell) / Math.abs(data.customer_buy + data.cover_buy - (Math.abs(data.customer_sell) + Math.abs(data.cover_sell)));

        data.realized_avg = Math.min((Math.abs(data.customer_buy) + Math.abs(data.cover_buy)), (Math.abs(data.customer_sell) + Math.abs(data.cover_sell))) == 0 ? 0 : data.realized / Math.min((Math.abs(data.customer_buy) + Math.abs(data.cover_buy)), (Math.abs(data.customer_sell) + Math.abs(data.cover_sell)));
        data.unrealized_avg = data.nop == 0 ? 0 : data.unrealized / Math.abs(data.nop);

        return data;
    }


    async Login(page) {
        //await page.setCookie(...G_define.cookiesNOP);
        await page.goto(this.screen_info.ip, { waitUntil: 'networkidle2' });
        return await this.checkLogin(page);
    }

    async checkLogin(page) {
        await page.waitFor(2000);
        let check = await page.$('body > div:nth-child(1) > div > div > section > form > div:nth-child(4) > input');
        if (check) {
            let user = this.screen_info.user;
            let pass = this.screen_info.pass;
            await page.type("body > div:nth-child(1) > div > div > section > form > div:nth-child(2) > input", user);
            await page.type("body > div:nth-child(1) > div > div > section > form > div:nth-child(3) > input", pass);
            await page.waitFor(1000);
            await page.click('body > div:nth-child(1) > div > div > section > form > div:nth-child(4) > input');
        }
        await page.waitFor(10000);
        check = await page.$('body > div:nth-child(1) > div > div > section > form > div:nth-child(4) > input');

        if (check) {
            return false;
        }
        else return true;
    }
}

module.exports = new checkNOPController();

