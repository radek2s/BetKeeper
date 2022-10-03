import BetEntry from "../models/BetEntry";
import { BetDataService } from "../providers/BetDataProvider";

/**
 * Bet BackendServer Service
 * 
 * Fetch and upload data into dedicated local backend service.
 */
export default class BetServerService implements BetDataService {

    private path = "http://localhost:8000" //TODO: load from env variable
   
    //TODO: Move all method implementations from "src/features/BetApi.ts"
    //      into this files. 
    
    getAllBets(): Promise<BetEntry[]> {
        throw new Error("Method not implemented.");
    }
    getBetById(id: number): Promise<BetEntry> {
        throw new Error("Method not implemented.");
    }
    addNewBet(bet: BetEntry): Promise<BetEntry> {
        throw new Error("Method not implemented.");
    }
    updateBet(bet: BetEntry): Promise<BetEntry> {
        throw new Error("Method not implemented.");
    }
    deleteBet(id: number): void {
        throw new Error("Method not implemented.");
    }
}