import type { FunctionComponent } from "react";
import { AddIcon } from "./add";
import { ArrowLeftIcon } from "./arrow-left";
import { BugIcon } from "./bug";
import { CalendarIcon } from "./calendar";
import { CheckIcon } from "./check";
import { CloseIcon } from "./close";
import { ErrorIcon } from "./error";
import { EventIcon } from "./event";
import { GroupIcon } from "./group";
import { GroupsIcon } from "./groups";
import { LogoutIcon } from "./logout";
import { MailIcon } from "./mail";
import { MoreIcon } from "./more";
import { NoteIcon } from "./note";
import { NotificationIcon } from "./notification";
import { QuestionMarkIcon } from "./question-mark";
import { TimerIcon } from "./timer";
import type { IconProps, IconType } from "./types";
import { VerifiedIcon } from "./verified";

const iconMap: Record<IconType, React.FC<IconProps>> = {
  add: AddIcon,
  "arrow-left": ArrowLeftIcon,
  bug: BugIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  close: CloseIcon,
  error: ErrorIcon,
  event: EventIcon,
  group: GroupIcon,
  groups: GroupsIcon,
  logout: LogoutIcon,
  mail: MailIcon,
  more: MoreIcon,
  note: NoteIcon,
  notification: NotificationIcon,
  "question-mark": QuestionMarkIcon,
  timer: TimerIcon,
  verified: VerifiedIcon,
};

function getIcon(type: IconType): FunctionComponent<IconProps> {
  return iconMap[type] || (() => <div>?</div>);
}

interface Props {
  name: IconType;
  className?: string;
}
export function Icon({ name, className }: Props) {
  const Component = getIcon(name);
  return <Component className={`icon ${className}`} />;
}
