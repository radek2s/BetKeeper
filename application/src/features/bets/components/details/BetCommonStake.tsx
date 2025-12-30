interface CommonStakesProps {
  stake: string;
}
function BetCommonStake({ stake }: CommonStakesProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold">Stakes</h2>
      <p className="text-xs text-gray">when anyone win he:</p>
      <p className="my-3">{stake}</p>
      <hr className="vertical-line" />
    </div>
  );
}

export default BetCommonStake;
