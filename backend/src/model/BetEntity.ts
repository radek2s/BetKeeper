export class BetEntity {

    constructor(
        public id: number,
        public title: string,
        public option1: string,
        public option2: string,
        public isFinished: boolean,
        public winner: boolean
    ) {

    }
}