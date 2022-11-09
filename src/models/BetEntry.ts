export default class BetEntry {
  id: number | string
  title: string
  description: string
  option1: string
  option2: string
  isFinished: boolean
  winner: boolean

  constructor(
    id: number | string,
    title: string,
    description: string,
    option1: string,
    option2: string,
    isFinished = false,
    winner = false
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.option1 = option1
    this.option2 = option2
    this.isFinished = isFinished
    this.winner = winner
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: any): BetEntry {
    return new this(
      obj.id,
      obj.title,
      obj.description,
      obj.option1,
      obj.option2,
      obj.isFinished,
      obj.winner
    )
  }
}
