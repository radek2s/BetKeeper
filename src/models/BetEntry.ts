export default class BetEntry {

    id: number;
    title: string;
    description: string;
    option1: string;
    option2: string;
    isFinished: boolean;
    winner: boolean;
    
    constructor(id: number, title: string, description: string, option1: string, option2: string, isFinished = false, winner = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.option1 = option1;
        this.option2 = option2;
        this.isFinished = isFinished;
        this.winner = winner;
    }
}