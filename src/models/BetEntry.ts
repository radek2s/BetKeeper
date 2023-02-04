export enum BetResolve {
  Person1,
  Person2,
  Draw,
  Pending,
}

export default class BetEntry {
  id: number | string
  title: string
  description: string
  archived: boolean
  option1: string
  option2: string
  betResolve: BetResolve

  constructor(
    id: number | string,
    title: string,
    description: string,
    option1: string,
    option2: string,
    betResolve = BetResolve.Pending,
    archived = false
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.option1 = option1
    this.option2 = option2
    this.betResolve = betResolve
    this.archived = archived
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: any): BetEntry {
    return new this(
      obj.id,
      obj.title,
      obj.description,
      obj.option1,
      obj.option2,
      obj.betResolve,
      obj.archived || false
    )
  }
}
