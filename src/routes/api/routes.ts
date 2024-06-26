import { Router } from "express";
import { makeOrder } from "../../controllers/placeOrder";
import {tickers} from "../../controllers/tickers";
import {balance} from "../../controllers/balance";
import {sl} from "../../controllers/sl";
import {position} from "../../controllers/position";
import {info} from "../../controllers/info";



const router = Router()

router.post('/order', makeOrder)
router.post('/tickers', tickers)
router.post('/balance', balance)
router.post('/sl', sl)
router.post('/position', position)
router.post('/info', info)

export { router as makeOrderRoute }