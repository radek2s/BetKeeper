type BetState = 0 | 1 | 2;

export default class BetEntry {

    title: string;
    resolved: BetState;
    betOption1: string;
    betOption2: string;
    
    constructor(title: string, betOption1: string, betOption2: string) {
        this.title = title;
        this.betOption1 = betOption1;
        this.betOption2 = betOption2;
        this.resolved = 0;
    }

    resolve(winner: 1 | 2): void {    
        this.resolved = winner;
    }

}