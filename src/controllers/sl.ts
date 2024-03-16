import { Request, Response } from "express";
import { ConfigParams } from "../config/config";
import { ByBitApi } from "../exchange/helper";
import { SetTradingStopParamsV5 } from "bybit-api";

const api: ByBitApi = new ByBitApi(
    true,
    ConfigParams.BYBIT_TEST1_API_KEY,
    ConfigParams.BYBIT_TEST1_API_SECRET,
)
//https://bybit-exchange.github.io/docs/v5/account/wallet-balance
async function sl(req: Request, res: Response) {
    try {

        console.log("set stop loss", req.body)
        let symbol = req.body && req.body.symbol ? req.body.symbol : undefined; //You can pass multiple coins to query, separated by comma. USDT,USDC

        const tickers: any = await api.getCurrentPrice({
            category: 'linear',
            symbol: symbol
        });
        const lastPrice = tickers.result.list[0].lastPrice;
        console.log(lastPrice);
        const coin = 'USDT';
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
        const qty: number = parseFloat((balance / lastPrice * 0.998).toFixed(3));
        const takeProfit: number = parseFloat(lastPrice) *1.005;
        const stopLoss: number = parseFloat(lastPrice) *0.996;
        const tpLimitPrice: number = takeProfit - (takeProfit * 0.01)
        const slLimitPrice: number = stopLoss + (stopLoss * 0.01)
        console.log({ "balance": balance, "lastPrice": lastPrice, "qty": qty, "tp": takeProfit, "sl": stopLoss })

        console.log('.toFixed(4)', takeProfit);

        const p: SetTradingStopParamsV5 = {
            symbol: 'BTCUSDT',
            category: 'linear',
            takeProfit: takeProfit.toFixed(4),
            stopLoss: stopLoss.toFixed(4),
            tpTriggerBy: 'MarkPrice',
            slTriggerBy: 'IndexPrice',
            tpslMode: 'Partial',
            slOrderType: 'Limit',
            tpLimitPrice: takeProfit.toFixed(4),
            slLimitPrice: stopLoss.toFixed(4),
            tpSize: '50',
            slSize: '50',
            positionIdx: 0
        };
        const ts = await api.sl(p);
        res.json({ "result": ts, "params": p, "lastPrice": lastPrice, "balance": balance, "takeProfit":takeProfit,"stopLoss":stopLoss });
      //  console.log(ts)

    } catch (error) {
        console.log("Failed to request", error)

    }


}
export { sl }