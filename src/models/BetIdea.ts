export default class BetIdea {
  id: number | string
  title: string
  option: string

  constructor(id: number | string, title: string, option: string) {
    this.id = id
    this.title = title
    this.option = option
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: any): BetIdea {
    return new this(obj.id, obj.title, obj.option)
  }
}
