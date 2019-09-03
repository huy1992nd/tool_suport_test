var MyEmitter = require('../lib/events');
var define_a = require('../define');
var puppeteer = require('puppeteer');
let config = require("config");
var log = require('../lib/log').log;

class exportNOPController {
    constructor() {
        this.browser = null;
        this.logImageCount = 1;
        this.timeDelay = config.get("timeDelay");
        this.server = config.get("server");
        this.showBrower = !config.get("showBrowser");
        this.account = config.get("account");
    }

  

    async run(username) {
        log.info('task_export_data_screen_nop',`username : ${username} , time : ${new Date().toISOString()}`);
        this.browser = await puppeteer.launch({ headless: this.showBrower, ignoreHTTPSErrors: true });
        const page = await this.browser.newPage();
        await page.setViewport({
            width: 1800,
            height: 2000
        })
        let result = await this.Login(page);
        if (result) {
            console.log("login success");
            this.ReadPageHome(page, username);
        }
    }

    async ReadPageHome(page, username) {
        await page.waitFor(3000);
        let result = await page.evaluate(() => {
              
            function sync_nop_data(typeMarket, rootScope) {

                var curr_nop = [];
         
                for (let i = 0; i < rootScope.list_coin_currency.length; i++) {
                    let sym = rootScope.list_coin_currency[i].pair_cd;
                    let leftCoin = rootScope.list_coin_currency[i].coin;
                    let rightCoin = rootScope.list_coin_currency[i].currency;
                    let symbolType = rootScope.list_coin_currency[i].type;
                    let isIco = rootScope.list_coin_currency[i].is_ico!=null? rootScope.list_coin_currency[i].is_ico:false;
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
                    console.log('typeMarket is',typeMarket)
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
            var nop_data_spot = sync_nop_data('spot',rootScope);
            var nop_data_leverage = sync_nop_data('margin',rootScope);
            var nop_data_fx = sync_nop_data('FX',rootScope);
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

        log.info('task_export_data_screen_nop',`username : ${username} , time : ${new Date().toISOString()} Ok`);
        
        MyEmitter.emit(define_a.data_nop, {
            data:result,
            username:username 
        });
		await this.browser.close();
    }

    async Login(page) {
        //await page.setCookie(...G_define.cookiesNOP);
        await page.goto(this.server + "/#/");
        return await this.checkLogin(page);
    }

    async checkLogin(page) {
        await page.waitFor(2000);
        let check = await page.$('body > div:nth-child(1) > div > div > section > form > div:nth-child(4) > input');
        if (check) {
            let user = this.account.user;
            let pass = this.account.pass;
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

module.exports = new exportNOPController();

