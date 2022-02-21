import BetEntry from "../models/BetEntry";

const BetElement:React.FC<{bet:BetEntry}> = ({bet}) => {
    return (
        <div>
            <h1>{bet.title}</h1>
            <div>
                <p onClick={() => bet.resolve(1)}>{bet.betOption1}</p>
                <p onClick={() => bet.resolve(2)}>{bet.betOption2}</p>
            </div>
        </div>
    )
};

export default BetElement;