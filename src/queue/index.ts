import { createClient } from 'redis';
import { ConfigParams } from '../config/config';
import { ByBitApi } from '../exchange/helper';

// redis queue



export const Queue = async () => {
    const client = createClient({
        url: ConfigParams.REDIS_URL
    });
    await client.connect();
    const channelTest1 = client.duplicate();
    const channelTest2 = client.duplicate();
    const channelTest3 = client.duplicate();

    await channelTest1.connect();
    await channelTest2.connect();
    await channelTest3.connect();

    console.log(`client.isOpen: ${client.isOpen}, client.isReady: ${client.isReady}`);
    await channelTest1.subscribe('BYBIT_TEST1', async (message: any) => {
        console.log(`channelTest1 subscriber collected message: ${message}`);
        const payload = JSON.parse(message);
        await placeOrder(payload);
    }, true);

    await channelTest2.subscribe('BYBIT_TEST2', async (message: any) => {
        console.log(`channelTest2 subscriber collected message: ${message}`);
        const payload = JSON.parse(message);
        await placeOrder(payload);
    }, true);

    await channelTest3.subscribe('BYBIT_TEST3', async (message: any) => {
        console.log(`channelTest3 subscriber collected message: ${message}`);
        const payload = JSON.parse(message);
        await placeOrder(payload);
    }, true);

}

const placeOrder = async (payload: any) => {
    let isTestnet = true;
    let account: string = payload.account ?? null; // BYBIT_TEST1
    if (account) {
        if (account.includes("TEST")) {
            isTestnet = true;
        } else {
            isTestnet = false;
        }
        const api: ByBitApi = new ByBitApi(
            isTestnet,
            ConfigParams[account + "_API_KEY"], // BYBIT_TEST1_API_KEY
            ConfigParams[account + "_API_SECRET"],
        )
        console.log(ConfigParams[account + "_API_SECRET"]);
        let amount = payload.amount ?? null; // 1000$
        let positionSide = payload.positionSide ?? null; // LONG / SHORT
        let symbol = payload.symbol ?? null;// BTCUSDT
        let leverage = payload.leverage ?? null; // 50(x)
        let targetPrice:string = payload.targetPrice ?? null; // 71000$
        let longStop = payload.longStop ?? null; // 70000$
        let shortStop = payload.shortStop ?? null; // 72000$


        // Check if open position
        const position: any = await api.position({
            category: 'linear',
            symbol: symbol
        });

        // No position: start processing the order
        if (position.result && position.result.list[0].positionValue === "") {

            // Set leverage
            const l = await api.setLeverage({
                category: 'linear',
                symbol: symbol,
                buyLeverage: leverage,//'50',
                sellLeverage: leverage,//'50',
            });

            // Get the current price
            const tickers: any = await api.getCurrentPrice({
                category: 'linear',
                symbol: symbol
            });
            const lastPrice:string = tickers.result.list[0].lastPrice;
            const coin = 'USDT';

            // Get the wallet balance
            const t: any = await api.balance({
                accountType: 'UNIFIED',
                coin: coin
            });
            const coins = t.result.list[0].coin;
            let currentCoin: any;
            coins.forEach((e: any) => {
                if (e.coin === coin) {
                    currentCoin = e;
                }
            });

            const balance = currentCoin.walletBalance ?? null;
            const qty: number = parseFloat(amount) / parseFloat(lastPrice) * 0.999;// parseFloat((balance / lastPrice * 0.999).toFixed(3));
            const tp: number = parseFloat(targetPrice);//parseFloat(lastPrice) * 1.005;
            let sl: number;//parseFloat(lastPrice) * 0.996;
            if (positionSide === "SHORT" && shortStop) {
                sl = parseFloat(shortStop);//parseFloat(lastPrice) * 0.996;
            } else {
                sl = parseFloat(longStop);//parseFloat(lastPrice) * 0.996;
            }
            // console.log({ "balance": balance, "lastPrice": lastPrice, "qty": qty, "tp": takeProfit, "sl": stopLoss, "l": l })

            const result: any = await api.placeOrder({
                category: 'linear',
                symbol: symbol,
                side: positionSide === 'LONG' ? 'Buy' : 'Sell',
                orderType: "Market",
                qty: qty.toFixed(2),
                triggerDirection: 1,
                isLeverage: 1,
                triggerBy: 'LastPrice',
                takeProfit: tp.toFixed(2),
                stopLoss: sl.toFixed(2),
                tpTriggerBy: "LastPrice",
                slTriggerBy: "LastPrice",
                tpslMode: 'Partial',
                tpOrderType: 'Limit',
                slOrderType: 'Limit',
                tpLimitPrice: tp.toFixed(2),
                slLimitPrice: sl.toFixed(2),
                positionIdx: 0,
            });

            if (result && result.retMsg == "OK") {
                console.log(new Date() + "  Order executed", JSON.stringify( { "lastPrice": lastPrice, "balance": balance, "qty": qty.toFixed(2), "tp": tp.toFixed(2), "sl": sl.toFixed(2), "result": result, "leverage": l }))
            } else {
                console.log(new Date() + "  Error placing an order ", JSON.stringify({ "lastPrice": lastPrice, "balance": balance, "qty": qty.toFixed(2), "tp": tp.toFixed(2), "sl": sl.toFixed(2), "result": result, "leverage": l }))
            }

        } else {
            console.log('Position already opened', position.result);
        }
    } else {
        console.log({ error: true, message: "No account input provided" })
    }
}