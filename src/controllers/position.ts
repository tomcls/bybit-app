import { Request, Response } from "express";
import { ConfigParams } from "../config/config";
import { ByBitApi } from "../exchange/helper";



async function position(req: Request, res: Response) {
    try {
        console.log("Get Postion Controller", req.body);
        const api: ByBitApi = new ByBitApi(
            true,
            ConfigParams.BYBIT_TEST1_API_KEY,
            ConfigParams.BYBIT_TEST1_API_SECRET,
        )
        let category: "linear" | "inverse" = "linear";

        let symbol: string | undefined;
        if (req.body && req.body.category == "inverse") {
            category = req.body.category;
        }
        symbol = req.body && req.body.symbol ? req.body.symbol : undefined;
        //we find the current price with the help of our bybitexchange helper
        const t: any = await api.position({
            category: category,
            symbol: symbol
        });

        res.json(t.result);

    } catch (error) {
        console.log("Failed to request", error)

    }


}
export { position }