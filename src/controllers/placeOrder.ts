import { Request, Response } from "express";
import { ConfigParams } from "../config/config";
import { createClient} from 'redis'

async function makeOrder(req: Request, res: Response) {
    try {
        //console.log(new Date() + " Place Order Controller body=", req.body);

        if (req.body) {
            const payload = req.body;
            let account: string = payload.account ?? null; // BYBIT_TEST1
            if (account) {
                const client = createClient({
                    url: ConfigParams.REDIS_URL
                });

                await client.connect();
                console.log(`Publishing message on ${account}`,JSON.stringify(payload));
                await client.publish(account, JSON.stringify(payload));
                res.status(200).json({ "message": `Publishing message on ${account}`, "data": payload })
                /*let isTestnet = true;
                if(account.includes("TEST")){
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
                let targetPrice = payload.targetPrice ??null; // 71000$
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
                    const lastPrice = tickers.result.list[0].lastPrice;
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
                    const qty: number = parseFloat((amount / lastPrice * 0.999).toFixed(3));// parseFloat((balance / lastPrice * 0.999).toFixed(3));

                    const tp: number = parseFloat(targetPrice.toFixed(2));//parseFloat(lastPrice) * 1.005;
                    let sl: number;//parseFloat(lastPrice) * 0.996;
                    if (positionSide === "SHORT" && shortStop) {
                        sl = parseFloat(shortStop.toFixed(2));//parseFloat(lastPrice) * 0.996;
                    } else {
                        sl = parseFloat(longStop.toFixed(2));//parseFloat(lastPrice) * 0.996;
                    }
                    // console.log({ "balance": balance, "lastPrice": lastPrice, "qty": qty, "tp": takeProfit, "sl": stopLoss, "l": l })

                    const result:any = await api.placeOrder({
                        category: 'linear',
                        symbol: symbol,
                        side: positionSide === 'LONG' ? 'Buy' : 'Sell',
                        orderType: "Market",
                        qty: qty.toString(),
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

                    if(result && result.retMsg == "OK") {
                        console.log(new Date() + "  Order executed",result)
                        res.status(200).json({ "lastPrice": lastPrice, "balance": balance, "qty": qty, "tp": tp, "sl": sl, "result": result, "leverage": l })
                    } else {
                        console.log(new Date() + "  Error placing an order ",result)
                        res.status(200).json({ "lastPrice": lastPrice, "balance": balance, "qty": qty, "tp": tp, "sl": sl, "result": result, "leverage": l })
                    }
                    
                } else {
                    console.log('Position already opened', position.result);
                    res.status(200).json({ "message": "Position already open", "data": position.result })
                }*/
            } else {
                console.log({ error: true, message: "No account input provided" })
                res.status(501).json({ error: true, message: "No account input provided" })
            }


            // // we log the price we bought at or sold at 
            // price = side === 'Buy' ? console.log("Bought at this Price", price) : console.log("Sold at this Price", price)
            // we log the json resposne



        } else {
            console.log({ error: true, message: "Payload not provided" })
            res.status(502).json({ error: true })
        }

    } catch (error) {
        console.log({ error: true, message: error })
        console.log("Failed to request", error)

    }


}

export { makeOrder }