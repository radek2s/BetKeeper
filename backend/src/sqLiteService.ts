import { Database } from "sqlite3";
import { BetEntity } from "./model/BetEntity";

export class SqLiteService {

    private db: Database

    constructor(databaseLocation: string) {
        this.db = new Database(databaseLocation)
    }

    getAllBets(): Promise<BetEntity[]> {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT id, title, description, option1, option2, finished, winner FROM bets", (error, rows) => {
                const response: BetEntity[] = []
                rows.forEach((row) => {
                    response.push(new BetEntity(
                        row.id,
                        row.title,
                        row.description,
                        row.option1,
                        row.option2,
                        row.isFinished == 1,
                        row.winner == 1
                    ))
                })
                resolve(response)
            })
        })
    }

    saveBet(bet: BetEntity): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO bets(title, description, option1, option2, finished, winner) VALUES(?, ?, ?, ?, ?, ?)`,
            [bet.title, bet.description, bet.option1, bet.option2, bet.isFinished ? 1 : 0, bet.winner ? 1 : 0],
            (error) => {
                console.log("Added with id")
                resolve()
            })
        })
    }

    deleteBet(betId: number): Promise<void> {
        return new Promise((resolve,reject) => {
            this.db.run(`DELETE FROM bets where id=$id`, {$id: betId}, (error) => {
                console.log("Deleted row", betId)
                resolve()
            }
        )})
    }

    updateBet(bet: BetEntity): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE bets SET
                title=$title,
                description=$description,
                option1=$option1,
                option2=$option2,
                finished=$finished,
                winner=$winner
            WHERE id=$id;`, {
                $id: bet.id,
                $title: bet.title,
                $description: bet.description,
                $option1: bet.option1,
                $option2: bet.option2,
                $finished: bet.isFinished ? 1 : 0,
                $winner: bet.winner ? 1 : 0
            }, (error) => {
                console.log("Updated row", bet.id)
                resolve()
            }
        )})
    }
}