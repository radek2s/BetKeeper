import axios from "axios"
const path: string = "http://localhost:8080"

export default class BetApi {
  constructor() {}

  getAllBets: any = () => {
    return axios
      .get(`${path}/api/bets`)
      .then(function (response: any) {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }

  getBetsById: any = (betId: number) => {
    return axios
      .get(`${path}/api/bet?ID=${betId}}`)
      .then(function (response: any) {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }

  addNewBet: any = (request: string) => {
    return axios
      .post(`${path}/api/bet`, request)
      .then(function (response: any) {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }

  updateBetById: any = (betId: number, request: string) => {
    return axios
      .put(`${path}/api/bet?ID=${betId}}`, request)
      .then(function (response: any) {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }

  deleteBetById: any = (betId: number) => {
    return axios
      .delete(`${path}/api/bet?ID=${betId}}`)
      .then(function (response: any) {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }
}
