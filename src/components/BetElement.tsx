import BetEntry from "../models/BetEntry";

const BetElement:React.FC<{bet:BetEntry}> = ({bet}) => {
    return (
        <div className="wesoły-div-😂">
            <h1>{bet.title}</h1>
            <div className="options flex">
                <div className={bet.resolved == 1 ? 'winner' : ''} onClick={() => bet.resolve(1)}>{bet.betOption1}</div>
                <div className={bet.resolved == 2 ? 'winner' : ''} onClick={() => bet.resolve(2)}>{bet.betOption2}</div>
            </div>
        </div>
    )
};

export default BetElement;