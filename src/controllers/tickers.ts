import { Request, Response } from "express";
import { ConfigParams } from "../config/config";
import { ByBitApi } from "../exchange/helper";

const api: ByBitApi = new ByBitApi(
    true,
    ConfigParams.API_KEY,
    ConfigParams.API_SECRET,
)

async function tickers(req: Request, res: Response) {
    try {
        console.log("Hello Place Order Controller", req.body)
       let category: "linear"|"inverse" = "linear";

       let symbol:string | undefined ;
       if(req.body && req.body.category == "inverse") {
            category=req.body.category;
       }
       symbol =req.body && req.body.symbol ? req.body.symbol : undefined;
        //we find the current price with the help of our bybitexchange helper
        const t: any = await api.getCurrentPrice({
            category:category,
            symbol:symbol
        });
       const markPrice = t.result.list[0].markPrice;
       const lastPrice = t.result.list[0].lastPrice;
        console.log({"markPrice":markPrice,"lastPrice":lastPrice});
        res.json(t.result);

    } catch (error) {
        console.log("Failed to request", error)

    }


}
export { tickers }