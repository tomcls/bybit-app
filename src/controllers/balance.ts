import { Request, Response } from "express";
import { ConfigParams } from "../config/config";
import { ByBitApi } from "../exchange/helper";

//https://bybit-exchange.github.io/docs/v5/account/wallet-balance
async function balance(req: Request, res: Response) {
    try {

        console.log("Get Wallet balance", req.body);

        const api: ByBitApi = new ByBitApi(
            true,
            ConfigParams.BYBIT_TEST1_API_KEY,
            ConfigParams.BYBIT_TEST1_API_SECRET,
        )
        let coin = req.body && req.body.coin ? req.body.coin : undefined; //You can pass multiple coins to query, separated by comma. USDT,USDC
        console.log({
            "accountType": 'UNIFIED',
            "coin": coin
        });
        const t: any = await api.balance({
            accountType: 'UNIFIED',
            coin: coin
        });
        const coins = t.result.list[0].coin;
        let currentCoin = null;
        coins.forEach((e: any) => {
            if (e.coin === coin) {
                currentCoin = e;
            }
        });
        res.json(t.result);
    } catch (error) {
        console.log("Failed to request", error)
    }
}
export { balance }