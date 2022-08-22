import express, { Application, Request, Response } from "express"
import cors from "cors"
import bodyParser from "body-parser";
import { BetEntity } from "./model/BetEntity";
import { SqLiteService } from "./sqLiteService";

const app:Application = express();
const PORT = process.env.PORT || 8000

const dbService = new SqLiteService("./betKeeper.db")

app.use(bodyParser.json())
app.use(cors())

app.get("/api/bets", (req: Request, res: Response): void => {
    dbService.getAllBets()
    .then((bets) => {
        res.send(JSON.stringify(bets))
    })
    .catch(() => {
        res.status(200).send(JSON.stringify([]))
    })
})

app.post("/api/bet", (req: Request, res: Response): void => {
    const bet = req.body
    dbService.saveBet(bet).then(() => {
        res.send(JSON.stringify({operation: "saved"}))
    }).catch(() => {
        res.status(500).send()
    })
})

app.get("/api/bet/:id", (req: Request, res: Response): void => {
    console.log("Get by ID", req.params.id)
    //TODO: Add dbService.get(id)
    const bet: BetEntity = new BetEntity(
        1, "Main Bet", ":)", "Option 1", "Option 2",
        false, false
    )
    res.send(JSON.stringify(bet))
})

app.put("/api/bet/:id", (req: Request, res: Response): void => {
    const id = req.params.id
    if(!id) res.status(400).send()

    dbService.updateBet(req.body).then(()=> {
        res.send(JSON.stringify({operation: "updated"}))
    }).catch(() => {
        res.status(500).send()
    })

})

app.delete("/api/bet/:id", (req: Request, res: Response): void => {
    const id = req.params.id
    if(!id) res.status(400).send()

    dbService.deleteBet(+id).then(()=> {
        res.send(JSON.stringify({operation: "deleted"}))
    }).catch(() => {
        res.status(500).send()
    })
})

app.listen(PORT, ():void => {
    console.log("Server is running...")
})