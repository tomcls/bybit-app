import { Request, Response } from "express";
import { ConfigParams } from "../config/config";
import { ByBitApi } from "../exchange/helper";


async function makeOrder(req: Request, res: Response) {
    try {
        console.log(new Date() + " Place Order Controller body=", req.body);

        if (req.body) {
            const payload = req.body;
            let account: string = payload.account ?? null; // BYBIT_TEST1
            if (account) {
                let isTestnet = true;
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
                
                let amount = payload.amount ?? null; // 1000$
                let positionSide = payload.positionSide ?? null; // LONG / SHORT
                let symbol = payload.symbol ?? null;// BTCUSDT
                let leverage = payload.leverage ?? null; // 50(x)
                let targetPrice = payload.targetPrice ?? null; // 71000$
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

                    const tp: number = parseFloat(targetPrice);//parseFloat(lastPrice) * 1.005;
                    let sl: number = parseFloat(longStop);//parseFloat(lastPrice) * 0.996;
                    if (positionSide === "SHORT") {
                        sl = parseFloat(shortStop);//parseFloat(lastPrice) * 0.996;
                    }
                    // console.log({ "balance": balance, "lastPrice": lastPrice, "qty": qty, "tp": takeProfit, "sl": stopLoss, "l": l })

                    const result = await api.placeOrder({
                        category: 'linear',
                        symbol: symbol,
                        side: positionSide === 'LONG' ? 'Buy' : 'Sell',
                        orderType: "Market",
                        qty: qty.toString(),
                        triggerDirection: 1,
                        isLeverage: 1,
                        triggerBy: 'LastPrice',
                        takeProfit: tp.toFixed(4),
                        stopLoss: sl.toFixed(4),
                        tpTriggerBy: "LastPrice",
                        slTriggerBy: "LastPrice",
                        tpslMode: 'Partial',
                        tpOrderType: 'Limit',
                        slOrderType: 'Limit',
                        tpLimitPrice: tp.toFixed(4),
                        slLimitPrice: sl.toFixed(4),
                        positionIdx: 0,
                    });
                    console.log(new Date() + "  order executed")
                    res.status(200).json({ "lastPrice": lastPrice, "balance": balance, "qty": qty, "tp": tp, "sl": sl, "result": result, "leverage": l })
                } else {
                    console.log('Position already opened', position.result);
                    res.status(200).json({ "message": "Position already open", "data": position.result })
                }
            } else {
                res.status(501).json({ error: true, message: "NNo account input provided" })
            }


            // // we log the price we bought at or sold at 
            // price = side === 'Buy' ? console.log("Bought at this Price", price) : console.log("Sold at this Price", price)
            // we log the json resposne



        } else {
            console.log("Request wasnt Sent check for an error")
            res.status(502).json({ error: true })
        }

    } catch (error) {
        console.log("Failed to request", error)

    }


}

export { makeOrder }