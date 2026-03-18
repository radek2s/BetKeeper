import type { $ZodIssue } from "zod/v4/core";

interface Props {
  issues: $ZodIssue[];
}
export function InvalidRequestDataMessage({ issues }: Props) {
  return (
    <div className="flex flex-col text-xs text-error text-center gap-2">
      {issues.map((issue) => (
        <span key={issue.message}>
          {issue.path.join(".")} - {issue.message}
        </span>
      ))}
    </div>
  );
}

export default InvalidRequestDataMessage;
