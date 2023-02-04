/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
        this.initDb().then(() => {
            console.log(`Database ${databaseLocation} opened correctly`)
        }).catch((e: any) => {
            console.error(e)
            console.log(`Database ${databaseLocation} could not be opened!`)
        })
    }

    async initDb(): Promise<void> {
        try {
            console.log("Checking database connection...")
            await this.getAllBets()
        } catch (e: any) {
            if (e.code === 'SQLITE_ERROR') {
                console.log("Trying to initialize schema...")
                await this.createBetTable()
                try {
                    console.log("Schema validation...")
                    await this.getAllBets()
                } catch (e2) {
                    console.error(e2)
                }
            }
        }
    }

    createBetTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE bets(
                [id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                [title] TEXT NOT NULL, 
                [description] TEXT,
                [option1] TEXT,
                [option2] TEXT,
                [bet_resolve] INTEGER,
                [archived] INTEGER);
            `, (error) => {
                if (error) reject(error)
                resolve()
            })
        })
    }

    getAllBets(): Promise<BetEntity[]> {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT id, title, description, option1, option2, bet_resolve, archived FROM bets", (error, rows) => {
                if (error) { reject(error) }
                else {
                    const response: BetEntity[] = []
                    rows.forEach((row) => {
                        response.push(new BetEntity(
                            row.id,
                            row.title,
                            row.description,
                            row.option1,
                            row.option2,
                            row.bet_resolve,
                            row.archived === 1
                        ))
                    })
                    resolve(response)
                }
            })
        })
    }

    getAllActiveBets(): Promise<BetEntity[]> {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT id, title, description, option1, option2, bet_resolve, archived FROM bets WHERE archived=0", (error, rows) => {
                if (error) { reject(error) }
                else {
                    const response: BetEntity[] = []
                    rows.forEach((row) => {
                        response.push(new BetEntity(
                            row.id,
                            row.title,
                            row.description,
                            row.option1,
                            row.option2,
                            row.bet_resolve,
                            row.archived === 1
                        ))
                    })
                    resolve(response)
                }
            })
        })
    }

    getAllArchivedBets(): Promise<BetEntity[]> {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT id, title, description, option1, option2, bet_resolve, archived FROM bets WHERE archived=1", (error, rows) => {
                if (error) { reject(error) }
                else {
                    const response: BetEntity[] = []
                    rows.forEach((row) => {
                        response.push(new BetEntity(
                            row.id,
                            row.title,
                            row.description,
                            row.option1,
                            row.option2,
                            row.bet_resolve,
                            row.archived === 1
                        ))
                    })
                    resolve(response)
                }
            })
        })

    }

    getBet(id: number): Promise<BetEntity> {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT id, title, description, option1, option2, bet_resolve, archived FROM bets WHERE id=$id", {
                $id: id
            }, (error, row) => {
                if (error) reject(error)
                if (row) {
                    const response = new BetEntity(
                        row.id,
                        row.title,
                        row.description,
                        row.option1,
                        row.option2,
                        row.bet_resolve,
                        row.archived === 1
                    )
                    resolve(response)
                } else {
                    reject(new BetNotFoundError(id))
                }
            })
        })
    }

    setArchive(betId: number, archived: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE bets SET archived=$archived WHERE id=$id;`, {
                $id: betId,
                $archived: archived
            }, function (error) {
                if (error) reject(error)
                if (this.changes == 0) reject(new BetNotFoundError(betId))
                console.log("Updated row", betId)
                resolve()
            }
            )
        })
    }

    saveBet(bet: BetEntity): Promise<BetEntity> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO bets(title, description, option1, option2, bet_resolve, archived) VALUES(?, ?, ?, ?, ?, ?)`,
                [bet.title, bet.description, bet.option1, bet.option2, bet.betResolve, bet.archived ? 1 : 0],
                function (error) {
                    if (error) reject(error)
                    console.log(`Added with id=${this.lastID}`)
                    bet.id = this.lastID
                    resolve(bet)
                })
        })
    }

    deleteBet(betId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM bets where id=$id`, { $id: betId }, function (error) {
                if (error) reject(error)
                if (this.changes == 0) reject(new BetNotFoundError(betId))
                console.log("Deleted row", betId)
                resolve()
            }
            )
        })
    }

    updateBet(bet: BetEntity): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE bets SET
                title=$title,
                description=$description,
                option1=$option1,
                option2=$option2,
                bet_resolve=$betResolve,
                archived=$archived
            WHERE id=$id;`, {
                $id: bet.id,
                $title: bet.title,
                $description: bet.description,
                $option1: bet.option1,
                $option2: bet.option2,
                $betResolve: bet.betResolve,
                $archived: bet.archived ? 1 : 0
            }, function (error) {
                if (error) reject(error)
                if (this.changes == 0) reject(new BetNotFoundError(bet.id))
                console.log("Updated row", bet.id)
                resolve()
            }
            )
        })
    }
}