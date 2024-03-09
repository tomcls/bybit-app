import { CategoryV5, GetTickersParamsV5, GetWalletBalanceParamsV5, OrderFilterV5, OrderParamsV5, OrderResultV5, OrderSideV5, OrderTimeInForceV5, OrderTriggerByV5, OrderTypeV5, PositionInfoParamsV5, RestClientV5, SetLeverageParamsV5, SetTradingStopParamsV5, TPSLModeV5, WalletBalanceV5 } from "bybit-api";

export class ByBitApi {

    private client: RestClientV5;

    constructor(testnet: boolean, key: string, secret: string) {
        this.client = new RestClientV5({
            testnet: testnet,
            key: key,
            secret: secret,
        });
    }
    // https://bybit-exchange.github.io/docs/v5/order/create-order
    placeOrder = async (params: OrderParamsV5) => {
        const o = await this.client.submitOrder(params);
        return o;
    }
    position = async (params: PositionInfoParamsV5) => {
        const o = await this.client.getPositionInfo(params);
        return o;
    }
    sl = async (params: SetTradingStopParamsV5) => {
        const o = await this.client.setTradingStop(params);
        return o;
    }
     // https://bybit-exchange.github.io/docs/v5/market/tickers
    getCurrentPrice = async (params: GetTickersParamsV5<"linear" | "inverse">) => {
        const t = await this.client.getTickers(params);
        return t;
    }
     // https://bybit-exchange.github.io/docs/v5/market/tickers
     balance = async (params: GetWalletBalanceParamsV5) => {
        const t = await this.client.getWalletBalance(params);
        return t;
    }
    // https://bybit-exchange.github.io/docs/v5/position/leverage
    setLeverage = async (params: SetLeverageParamsV5) => {
        const l = await this.client.setLeverage(params);
        return l;
    }
    // https://bybit-exchange.github.io/docs/v5/position/trading-stop
    setTradingStop = async (params: {
        category: CategoryV5,
        symbol: string,
        takeProfit: string, //'0.6',
        stopLoss:string, // '0.2',
        tpTriggerBy:OrderTriggerByV5, // 'MarkPrice',
        slTriggerBy: OrderTriggerByV5,//'IndexPrice',
        tpslMode: TPSLModeV5, // 'Partial',
        tpOrderType:OrderTypeV5// 'Limit',
        slOrderType: OrderTypeV5, //'Limit',
        tpSize: string,//'50',
        slSize:string,// '50',
        tpLimitPrice:string,// '0.57',
        slLimitPrice:string// '0.21',
        positionIdx: 0 | 1 | 2 // 0,
    }) => {
        const l = await this.client.setTradingStop(params);
        return l;
    }
}