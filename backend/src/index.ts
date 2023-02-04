/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
import express, { Application, Request, Response } from "express"
import cors from "cors"
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'

import { BetNotFoundError, SqLiteService } from "./sqLiteService";

dotenv.config()

const app: Application = express();

const PORT = process.env.PORT || 8000
const HOSTNAME = process.env.HOST || "localhost"
const DB_LOCATION = process.env.DB_LOCATION || "./betKeeper.db"

const dbService = new SqLiteService(DB_LOCATION)

app.use(bodyParser.json())
app.use(cors())

app.get("/api/bet", async (req: Request, res: Response) => {
    try {
        console.log(`${new Date().toISOString()} [GET] /api/bet`)
        switch (req.query.state) {
            case 'active': res.send(await dbService.getAllActiveBets()); break
            case 'archived': res.send(await dbService.getAllArchivedBets()); break
            default: res.send(await dbService.getAllBets());
        }
    } catch (e) {
        console.error(e)
        res.status(500).send()
    }
})

app.post("/api/bet", async (req: Request, res: Response) => {
    try {
        console.log(`${new Date().toISOString()} [POST] /api/bet`)
        const bet = req.body
        const response = await dbService.saveBet(bet)
        res.send(response)
    } catch (e) {
        console.error(e)
        res.status(500).send()
    }
})

app.get("/api/bet/:id", async (req: Request, res: Response) => {
    try {
        console.log(`${new Date().toISOString()} [GET] /api/bet/${req.params.id}`)
        const response = await dbService.getBet(+req.params.id)
        res.send(response)
    } catch (e) {
        console.error(e)
        if (e instanceof BetNotFoundError) {
            res.status(404).send()
        }
        res.status(500).send()
    }
})

app.put("/api/bet/:id", async (req: Request, res: Response) => {
    try {
        console.log(`${new Date().toISOString()} [PUT] /api/bet/${req.params.id}`)
        const id = req.params.id
        if (!id) res.status(400).send()
        await dbService.updateBet(req.body)
        res.status(204).send()
    } catch (e) {
        console.error(e)
        if (e instanceof BetNotFoundError) {
            res.status(404).send()
        }
        res.status(500).send()
    }
})

app.delete("/api/bet/:id", async (req: Request, res: Response) => {
    try {
        console.log(`${new Date().toISOString()} [DELETE] /api/bet/${req.params.id}`)
        const id = req.params.id
        if (!id) res.status(400).send()

        await dbService.deleteBet(+id)
        res.status(204).send()
        //https://dev.to/pragativerma18/youre-not-using-http-status-codes-right-pc6
    } catch (e) {
        console.error(e)
        if (e instanceof BetNotFoundError) {
            res.status(404).send()
        }
        res.status(500).send()
    }
})

app.patch("/api/bet/:id/archive", async (req: Request, res: Response) => {
    try {
        console.log(`${new Date().toISOString()} [PATCH] /api/bet/${req.params.id}`)
        const id = +req.params.id
        const result = req.query.state
        if (!result) throw new Error("Invalid state param")
        dbService.setArchive(id, +result)
        res.status(201).send()
    } catch (e) {
        console.error(e)
        if (e instanceof BetNotFoundError) {
            res.status(404).send()
        }
        res.status(500).send()
    }
})

app.listen(+PORT, HOSTNAME, () => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT}`)
})