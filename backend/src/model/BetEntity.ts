export class BetEntity {

    constructor(
        public id: number,
        public title: string,
        public description: string,
        public option1: string,
        public option2: string,
        public betResolve: BetResolve
    ) {

    }
}

export enum BetResolve {
    Person1,
    Person2,
    Draw,
    Pending
}