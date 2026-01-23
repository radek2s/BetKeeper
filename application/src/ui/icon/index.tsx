import type { FunctionComponent } from "react";
import { AddIcon } from "./add";
import { ArrowDropdownIcon } from "./arrow-dropdown";
import { ArrowLeftIcon } from "./arrow-left";
import { BugIcon } from "./bug";
import { CalendarIcon } from "./calendar";
import { CheckIcon } from "./check";
import { ChevronLeftIcon } from "./chevron-left";
import { CloseIcon } from "./close";
import { DeleteIcon } from "./delete";
import { ErrorIcon } from "./error";
import { EventIcon } from "./event";
import { FactCheckIcon } from "./fact-check";
import { GiftIcon } from "./gift";
import { GroupIcon } from "./group";
import { GroupAddIcon } from "./group-add";
import { GroupsIcon } from "./groups";
import { HandshakeIcon } from "./handshake";
import { LogoutIcon } from "./logout";
import { MailIcon } from "./mail";
import { MoreIcon } from "./more";
import { NoteIcon } from "./note";
import { NotificationIcon } from "./notification";
import { PersonIcon } from "./person";
import { PersonOffIcon } from "./person-off";
import { QuestionMarkIcon } from "./question-mark";
import { SearchIcon } from "./search";
import { SecurityKeyIcon } from "./security-key";
import { SendIcon } from "./send";
import { SortIcon } from "./sort";
import { SortDownIcon } from "./sort-down";
import { SortUpIcon } from "./sort-up";
import { TimelineIcon } from "./timeline";
import { TimerIcon } from "./timer";
import { TrophyIcon } from "./trophy";
import type { IconProps, IconType } from "./types";
import { VerifiedIcon } from "./verified";
import { WavingHandIcon } from "./waving-hand";

const iconMap: Record<IconType, React.FC<IconProps>> = {
  add: AddIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-dropdown": ArrowDropdownIcon,
  bug: BugIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  "chevron-left": ChevronLeftIcon,
  close: CloseIcon,
  delete: DeleteIcon,
  error: ErrorIcon,
  event: EventIcon,
  "fact-check": FactCheckIcon,
  gift: GiftIcon,
  group: GroupIcon,
  "group-add": GroupAddIcon,
  groups: GroupsIcon,
  handshake: HandshakeIcon,
  logout: LogoutIcon,
  mail: MailIcon,
  more: MoreIcon,
  note: NoteIcon,
  notification: NotificationIcon,
  person: PersonIcon,
  "person-off": PersonOffIcon,
  "question-mark": QuestionMarkIcon,
  search: SearchIcon,
  "security-key": SecurityKeyIcon,
  sort: SortIcon,
  "sort-down": SortDownIcon,
  "sort-up": SortUpIcon,
  send: SendIcon,
  timeline: TimelineIcon,
  timer: TimerIcon,
  trophy: TrophyIcon,
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
