interface Props {
  progress: number;
}
export function WizzardProgress({ progress }: Props) {
  if (progress > 2 || progress < 0)
    throw new Error("Wizzard Progress require progress in range 0-2");

  const getPercentage = () => {
    switch (progress) {
      case 0:
        return 0;
      case 1:
        return 50;
      case 2:
        return 100;
    }
  };

  return (
    <div className="wizzard-progress">
      <div
        className="wizzard-progress__active"
        style={{ width: `${getPercentage()}%` }}
      />
      <div className={`dot ${progress > 1 ? "completed" : ""}`} />
      <div className="dot" />
      <div className={`dot ${progress > 0 ? "completed" : ""}`} />
      <div
        className="dot__active"
        style={{ left: `calc(${getPercentage()}% - 12px)` }}>
        {progress + 1}
      </div>
    </div>
  );
}
