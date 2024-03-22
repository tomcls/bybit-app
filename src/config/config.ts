import 'dotenv/config'

export const ConfigParams:any = {
    BYBIT_TEST1_API_KEY: process.env.BYBIT_TEST1_API_KEY || "",
    BYBIT_TEST1_API_SECRET: process.env.BYBIT_TEST1_API_SECRET || "",
    BYBIT_TEST2_API_KEY: process.env.BYBIT_TEST2_API_KEY || "",
    BYBIT_TEST2_API_SECRET: process.env.BYBIT_TEST2_API_SECRET || "",
    BYBIT_TEST3_API_KEY: process.env.BYBIT_TEST3_API_KEY || "",
    BYBIT_TEST3_API_SECRET: process.env.BYBIT_TEST3_API_SECRET || "",
    TEST_NET: true,
    URL: process.env.BYBIT_TESTNET_URL || "",
    REDIS_URL: process.env.REDIS_URL || ""
}