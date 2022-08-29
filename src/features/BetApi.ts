import axios from "axios";
import BetEntry from "../models/BetEntry";
const path = "http://localhost:8000";

export default class BetApi {

    async getAllBets(): Promise<BetEntry[]> {
      const result = await axios.get(`${path}/api/bets`)
      return result.data.map((data: any) => new BetEntry(data.id, data.title, "", data.option1, data.option2))
      }
      
    async getBetById (betId: number) {
      return await axios.get(`${path}/api/bet/${betId}`)
    }
      
    async addNewBet (request: BetEntry){
      console.log(request);
      return await axios.post(`${path}/api/bet`, request)
    }
       
    async updateBetById (bet: BetEntry) {
        return await axios.put(`${path}/api/bet/${bet.id}`, bet)
      }
         
    deleteBetById (betId: number) {
        return axios.delete(`${path}/api/bet/${betId}`)
    }
}