import { Icon } from "@app/ui/icon";

interface CreationDateProps {
  date: Date;
}
function BetCreationDate({ date }: CreationDateProps) {
  return (
    <div className="flex gap-1">
      <Icon name="calendar" />
      <span>{date.toLocaleDateString()}</span>
    </div>
  );
}

export default BetCreationDate;
