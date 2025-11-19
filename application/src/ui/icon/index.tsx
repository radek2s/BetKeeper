import type { FunctionComponent } from "react";
import { AddIcon } from "./add";
import { ArrowLeftIcon } from "./arrow-left";
import { BugIcon } from "./bug";
import { CalendarIcon } from "./calendar";
import { CheckIcon } from "./check";
import { ChevronLeftIcon } from "./chevron-left";
import { CloseIcon } from "./close";
import { DeleteIcon } from "./delete";
import { ErrorIcon } from "./error";
import { EventIcon } from "./event";
import { GroupIcon } from "./group";
import { GroupsIcon } from "./groups";
import { LogoutIcon } from "./logout";
import { MailIcon } from "./mail";
import { MoreIcon } from "./more";
import { NoteIcon } from "./note";
import { NotificationIcon } from "./notification";
import { PersonIcon } from "./person";
import { PersonOffIcon } from "./person-off";
import { QuestionMarkIcon } from "./question-mark";
import { SecurityKeyIcon } from "./security-key";
import { SendIcon } from "./send";
import { TimerIcon } from "./timer";
import type { IconProps, IconType } from "./types";
import { VerifiedIcon } from "./verified";
import { WavingHandIcon } from "./waving-hand";

const iconMap: Record<IconType, React.FC<IconProps>> = {
  add: AddIcon,
  "arrow-left": ArrowLeftIcon,
  bug: BugIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  "chevron-left": ChevronLeftIcon,
  close: CloseIcon,
  delete: DeleteIcon,
  error: ErrorIcon,
  event: EventIcon,
  group: GroupIcon,
  groups: GroupsIcon,
  logout: LogoutIcon,
  mail: MailIcon,
  more: MoreIcon,
  note: NoteIcon,
  notification: NotificationIcon,
  person: PersonIcon,
  "person-off": PersonOffIcon,
  "question-mark": QuestionMarkIcon,
  "security-key": SecurityKeyIcon,
  send: SendIcon,
  timer: TimerIcon,
  verified: VerifiedIcon,
  "waving-hand": WavingHandIcon,
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
