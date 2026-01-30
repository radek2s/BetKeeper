import DevUserSwitch from "@app/features/dev/UserSwitch";

type AuthModeType = "CORBADO" | "MANUAL";
const AUTH_MODE: AuthModeType = (process.env.NEXT_PUBLIC_AUTH_MODE ??
  "CORBADO") as AuthModeType;

export default async function DevPage() {
  if (AUTH_MODE !== "MANUAL")
    return <div className="text-center">Module disabled</div>;
  return (
    <div className="flex justify-center">
      <DevUserSwitch />
    </div>
  );
}
