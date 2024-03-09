import { LinearClient, LinearOrder, LinearPositionIdx } from "bybit-api";

export class BybitExchange {
    //call our client 
    private linear: LinearClient

    //create a constructor with the required keys

    constructor(options: { key: string, secret: string, testnet: boolean, baseUrl: string }) {
        this.linear = new LinearClient(options)

    }

    //we crate an async function to create and order or make an order
    //every async function should return a promsie

    async makeOrder(params: {
        symbol: string, side: any, qty: number, order_type: any,
        time_in_force: any, reduce_only: boolean, close_on_trigger: boolean, price: number, position_idx: LinearPositionIdx
    }): Promise<LinearOrder | null> {
        console.log(params)
        let { result, ret_code, ret_msg } = await this.linear.placeActiveOrder(params)
        if (ret_code === 0) {
            console.log(result)
            return result
        } else {
            console.log(ret_code, ret_msg)
            throw new Error(ret_msg);
        }
    }
    //get Current price Helper
    async getCurrentPrice(symbol: string): Promise<number | null> {
        try {
            const { result, ret_code, ret_msg } = await this.linear.getTickers({ symbol })
            let _result = result.find((item: { symbol: string }) => item.symbol === symbol)
            if (ret_code === 0) {
                return _result.last_price
            }
            console.log(result)
            if (ret_code === 0 && _result[0]) {
                return _result[0]?.symbol.last_price
            } else {
                throw new Error(ret_msg)
            }

        } catch (error) {

        }
        return null

    }

}