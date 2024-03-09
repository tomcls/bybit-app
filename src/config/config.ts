import 'dotenv/config'

export const ConfigParams = {
    API_KEY: process.env.BYBIT_API_KEY || "",
    API_SECRET: process.env.BYBIT_API_SECRET || "",
    TEST_NET: true,
    URL: process.env.BYBIT_URL || ""
}