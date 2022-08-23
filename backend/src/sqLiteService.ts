import { Database } from "sqlite3";
import { BetEntity } from "./model/BetEntity";

export class BetNotFoundError extends Error {
    constructor(betId: number) {
        super(`Bet with id=${betId} could not be found`)
    }
}

export class SqLiteService {

    private db: Database

    constructor(databaseLocation: string) {
        this.db = new Database(databaseLocation)
        console.log(`Database ${databaseLocation} opened correctly`)
    }

    createBetTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`CRETAE TABLE bets(
                [id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                [title] TEXT NOT NULL, 
                [description] TEXT,
                [option1] TEXT,
                [option2] TEXT,
                [finished] INTEGER,
                [winner] INTEGER
            `, (error) => {
                console.error(error)
                resolve()
            })
        })
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
                        row.finished == 1,
                        row.winner == 1
                    ))
                })
                resolve(response)
            })
        })
    }

    getBet(id: number): Promise<BetEntity> {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT id, title, description, option1, option2, finished, winner FROM bets WHERE id=$id", {
                $id: id
            }, (error, row) => {
                if(row) {
                    const response = new BetEntity(
                        row.id,
                        row.title,
                        row.description,
                        row.option1,
                        row.option2,
                        row.finished == 1,
                        row.winner == 1
                    )
                    resolve(response)
                } else {
                    reject(new BetNotFoundError(id))
                }                
            })
        })
    }

    saveBet(bet: BetEntity): Promise<BetEntity> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO bets(title, description, option1, option2, finished, winner) VALUES(?, ?, ?, ?, ?, ?)`,
            [bet.title, bet.description, bet.option1, bet.option2, bet.isFinished ? 1 : 0, bet.winner ? 1 : 0],
            function (error) {
                console.log(`Added with id=${this.lastID}`)
                bet.id = this.lastID
                resolve(bet)
            })
        })
    }

    deleteBet(betId: number): Promise<void> {
        return new Promise((resolve,reject) => {
            this.db.run(`DELETE FROM bets where id=$id`, {$id: betId}, function (error) {
                if(this.changes == 0) reject(new BetNotFoundError(betId))
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
            }, function (error) {
                if(this.changes == 0) reject(new BetNotFoundError(bet.id))
                console.log("Updated row", bet.id)
                resolve()
            }
        )})
    }
}