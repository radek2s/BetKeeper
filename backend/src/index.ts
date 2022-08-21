import express, { Application, Request, Response } from "express"
import bodyParser from "body-parser";
import { BetEntity } from "./model/BetEntity";

const app:Application = express();
const PORT = process.env.PORT || 8000

app.use(bodyParser.json())

app.get("/api/bets", (req: Request, res: Response): void => {
    const mockResponse:BetEntity[] = []
    mockResponse.push(new BetEntity(1, "Main Title",
    "Option 1", "Option 2", false, false))
    mockResponse.push(new BetEntity(2,"Secondary bet",
    "Wear dress", "Wear skirt", true, true))
    res.send(JSON.stringify(mockResponse))
})

app.post("/api/bet", (req: Request, res: Response): void => {
    const bet = req.body
    console.log("Saving bet: ", bet)
    res.send(JSON.stringify({operation: "saved"}))
})

app.get("/api/bet/:id", (req: Request, res: Response): void => {
    console.log("Get by ID", req.params.id)
    const bet: BetEntity = new BetEntity(
        1, "Main Bet", "Option 1", "Option 2",
        false, false
    )
    res.send(JSON.stringify(bet))
})

app.put("/api/bet/:id", (req: Request, res: Response): void => {
    console.log("Update ID", req.params.id, req.body)
    res.send(JSON.stringify({operation: "updated"}))
})

app.delete("/api/bet/:id", (req: Request, res: Response): void => {
    console.log("Delete ID", req.params.id)
    res.send(JSON.stringify({operation: "deleted"}))
})

app.listen(PORT, ():void => {
    console.log("Server is running...")
})